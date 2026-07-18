import mongoose from 'mongoose';

const trafficLogSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  sessionID: {
    type: String,
    required: true
  },
  utmSource: {
    type: String,
    default: 'direct',
    lowercase: true,
    trim: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: ['view', 'cart_add', 'checkout_start', 'purchase'],
    default: 'view',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

const TrafficLog = mongoose.model('TrafficLog', trafficLogSchema);

export default TrafficLog;
