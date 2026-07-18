import express from 'express';
import { 
  trackEvent, 
  saveAdSpend, 
  getDashboardStats 
} from '../controllers/analyticsController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// POST /api/analytics/track - Track a client-side page view/action (Public)
router.post('/track', trackEvent);

// POST /api/analytics/ad-spend - Add or update marketing expenses (Admin Only)
router.post('/ad-spend', protect, adminOnly, saveAdSpend);

// GET /api/analytics/report - Get marketing/funnel dashboards stats (Admin Only)
router.get('/report', protect, adminOnly, getDashboardStats);

export default router;
