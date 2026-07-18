import mongoose from 'mongoose';

const adSpendSchema = new mongoose.Schema({
  channel: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  spend: {
    type: Number,
    required: true,
    min: 0
  },
  impressions: {
    type: Number,
    default: 0,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: () => {
      const d = new Date();
      d.setHours(0,0,0,0);
      return d;
    },
    index: true
  }
});

const AdSpend = mongoose.model('AdSpend', adSpendSchema);

export default AdSpend;
