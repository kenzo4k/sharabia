import { loadStripe } from '@stripe/stripe-js';

// Load Stripe once outside components to avoid multiple loads
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
);

export default stripePromise;
