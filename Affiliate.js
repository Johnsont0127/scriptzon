const mongoose = require('mongoose');

const AffiliateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referralCode: {
    type: String,
    required: true,
    unique: true
  },
  referralLink: {
    type: String,
    required: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  signups: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'cancelled'],
      default: 'pending'
    }
  }],
  commissions: [{
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending'
    },
    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    paymentType: {
      type: String,
      enum: ['initial', 'recurring'],
      default: 'initial'
    }
  }],
  totalEarnings: {
    type: Number,
    default: 0
  },
  pendingEarnings: {
    type: Number,
    default: 0
  },
  paidEarnings: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Affiliate = mongoose.model('Affiliate', AffiliateSchema);

module.exports = Affiliate;
