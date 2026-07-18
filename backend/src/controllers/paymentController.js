import stripe from '../utils/stripe.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

/**
 * @desc    Create Stripe PaymentIntent for an order
 * @route   POST /api/payments/create-payment-intent
 * @access  Public
 */
export const createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      res.status(400);
      throw new Error('Order ID is required');
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (order.paymentStatus === 'paid') {
      res.status(400);
      throw new Error('Order is already paid');
    }

    // Convert order total to cents (Stripe expects amount in cents)
    const amountInCents = Math.round(order.total * 100);

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber
      },
      automatic_payment_methods: {
        enabled: true
      }
    });

    // Save paymentIntentId to order
    order.paymentIntentId = paymentIntent.id;
    await order.save();

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Handle Stripe Webhook Events
 * @route   POST /api/payments/webhook
 * @access  Public (stripe system callback)
 */
export const handleWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // req.body must be raw string / Buffer for signature validation to succeed
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);

    try {
      // Find order by paymentIntentId or metadata
      const orderId = paymentIntent.metadata.orderId;
      const order = await Order.findById(orderId);

      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        order.paymentIntentId = paymentIntent.id;
        
        // Deduct inventory stock for purchased products
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: -item.quantity }
          });
          console.log(`Deducted ${item.quantity} stock for Product ID: ${item.productId}`);
        }

        await order.save();
        console.log(`Order ${order.orderNumber} successfully marked as PAID.`);
      } else {
        console.warn(`Order not found or already paid for ID: ${orderId}`);
      }
    } catch (err) {
      console.error(`Error updating order status for PaymentIntent: ${paymentIntent.id}`, err);
      return res.status(500).json({ error: 'Database update failed' });
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};
