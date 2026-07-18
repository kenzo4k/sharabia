import express from 'express';
import { createPaymentIntent, handleWebhook } from '../controllers/paymentController.js';

const router = express.Router();

// POST /api/payments/create-payment-intent
router.post('/create-payment-intent', createPaymentIntent);

// POST /api/payments/webhook
router.post('/webhook', handleWebhook);

export default router;
