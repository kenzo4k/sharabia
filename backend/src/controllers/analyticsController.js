import TrafficLog from '../models/TrafficLog.js';
import AdSpend from '../models/AdSpend.js';
import Order from '../models/Order.js';

/**
 * @desc    Track a page view or user action
 * @route   POST /api/analytics/track
 * @access  Public
 */
export const trackEvent = async (req, res, next) => {
  try {
    const { path, sessionID, utmSource = 'direct', action = 'view' } = req.body;

    if (!path || !sessionID) {
      return res.status(400).json({ success: false, message: 'Path and sessionID are required' });
    }

    const sanitizedUtm = String(utmSource).trim().toLowerCase() || 'direct';

    const log = await TrafficLog.create({
      path,
      sessionID,
      utmSource: sanitizedUtm,
      action
    });

    res.status(201).json({ success: true, log });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Save/update ad spend costs for a channel
 * @route   POST /api/analytics/ad-spend
 * @access  Private (Admin Only)
 */
export const saveAdSpend = async (req, res, next) => {
  try {
    const { channel, spend, impressions = 0, date } = req.body;

    if (!channel || spend === undefined) {
      res.status(400);
      throw new Error('Channel and spend are required');
    }

    const sanitizedChannel = String(channel).trim().toLowerCase();
    
    // Set date to midnight of today if not specified
    const spendDate = date ? new Date(date) : new Date();
    spendDate.setHours(0, 0, 0, 0);

    const adSpend = await AdSpend.findOneAndUpdate(
      { channel: sanitizedChannel, date: spendDate },
      { 
        $set: { 
          spend: Number(spend),
          impressions: Number(impressions)
        } 
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Ad spend saved successfully',
      adSpend
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get aggregated stats for the 3 dashboards (Business Health, Marketing, Funnel)
 * @route   GET /api/analytics/report
 * @access  Private (Admin Only)
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const dateRange = parseInt(days) || 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);
    startDate.setHours(0, 0, 0, 0);

    // 1. Aggregate Business Health Metrics
    const bHealthAgg = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startDate },
          paymentStatus: { $in: ['paid', 'pending'] } // include processed orders
        } 
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalOrders: { $sum: 1 },
          aov: { $avg: '$total' },
          totalItems: { $sum: { $size: '$items' } }
        }
      }
    ]);

    const totalUniqueSessionsCount = await TrafficLog.distinct('sessionID', {
      createdAt: { $gte: startDate }
    });

    const activeUsersCount = await TrafficLog.distinct('sessionID', {
      createdAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) } // 15 mins
    });

    const totalOrdersCount = bHealthAgg[0]?.totalOrders || 0;
    const totalRevenue = bHealthAgg[0]?.totalRevenue || 0;
    const aov = bHealthAgg[0]?.aov || 0;
    const totalUniqueCount = totalUniqueSessionsCount.length || 1;

    // Cancelled orders calculation
    const cancelledCount = await Order.countDocuments({
      createdAt: { $gte: startDate },
      paymentStatus: 'failed'
    });
    const totalAnyOrders = await Order.countDocuments({
      createdAt: { $gte: startDate }
    });

    const businessHealth = {
      totalRevenue: Math.round(totalRevenue),
      totalOrders: totalOrdersCount,
      aov: Math.round(aov),
      conversionRate: Math.round((totalOrdersCount / totalUniqueCount) * 10000) / 100,
      itemsPerOrder: totalOrdersCount > 0 ? Math.round((bHealthAgg[0].totalItems / totalOrdersCount) * 10) / 10 : 0,
      cancellationRate: totalAnyOrders > 0 ? Math.round((cancelledCount / totalAnyOrders) * 10000) / 100 : 0,
      activeUsers: activeUsersCount.length
    };

    // 2. Aggregate Marketing Efficiency Metrics
    const ordersByChannel = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startDate },
          paymentStatus: { $in: ['paid', 'pending'] }
        } 
      },
      {
        $group: {
          _id: { $toLower: '$utmSource' },
          revenue: { $sum: '$total' },
          conversions: { $sum: 1 }
        }
      }
    ]);

    const logsByChannel = await TrafficLog.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $toLower: '$utmSource' },
          clicks: { $addToSet: '$sessionID' }
        }
      },
      {
        $project: {
          channel: '$_id',
          clicks: { $size: '$clicks' }
        }
      }
    ]);

    const spendsByChannel = await AdSpend.aggregate([
      { $match: { date: { $gte: startDate } } },
      {
        $group: {
          _id: '$channel',
          spent: { $sum: '$spend' },
          impressions: { $sum: '$impressions' }
        }
      }
    ]);

    const channels = ['google', 'facebook', 'email', 'direct'];
    const marketingEfficiency = channels.map(channel => {
      const clickData = logsByChannel.find(l => l.channel === channel);
      const orderData = ordersByChannel.find(o => o._id === channel);
      const spendData = spendsByChannel.find(s => s._id === channel);

      const clicks = clickData?.clicks || 0;
      const revenue = orderData?.revenue || 0;
      const conversions = orderData?.conversions || 0;
      const spent = spendData?.spent || 0;
      const impressions = spendData?.impressions || 0;

      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const cpa = conversions > 0 ? spent / conversions : 0;
      const roas = spent > 0 ? revenue / spent : 0;

      return {
        channel,
        clicks,
        revenue: Math.round(revenue),
        conversions,
        spent,
        impressions,
        ctr: Math.round(ctr * 100) / 100,
        cpa: Math.round(cpa),
        roas: Math.round(roas * 100) / 100
      };
    });

    // 3. Aggregate On-Site experience funnel
    const allTrafficCount = totalUniqueCount;
    const productViewsCount = (await TrafficLog.distinct('sessionID', {
      createdAt: { $gte: startDate },
      $or: [
        { path: { $regex: '^\/product\/', $options: 'i' } },
        { path: { $regex: 'product', $options: 'i' } }
      ]
    })).length;
    
    const cartAddsCount = (await TrafficLog.distinct('sessionID', {
      createdAt: { $gte: startDate },
      action: 'cart_add'
    })).length;

    const checkoutStartsCount = (await TrafficLog.distinct('sessionID', {
      createdAt: { $gte: startDate },
      action: 'checkout_start'
    })).length;

    const funnel = [
      { name: 'زيارة الموقع', count: allTrafficCount },
      { name: 'مشاهدة المنتجات', count: productViewsCount },
      { name: 'إضافة للسلة', count: cartAddsCount },
      { name: 'بدء الدفع', count: checkoutStartsCount },
      { name: 'إتمام الشراء', count: totalOrdersCount }
    ];

    const report = {
      businessHealth,
      marketingEfficiency,
      funnel
    };

    res.status(200).json({ success: true, report });
  } catch (err) {
    next(err);
  }
};
