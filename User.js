const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro_monthly', 'pro_annual'],
      default: 'free'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    stripeCustomerId: {
      type: String
    },
    stripeSubscriptionId: {
      type: String
    }
  },
  scriptCount: {
    count: {
      type: Number,
      default: 0
    },
    month: {
      type: Number,
      default: new Date().getMonth()
    },
    year: {
      type: Number,
      default: new Date().getFullYear()
    }
  },
  affiliate: {
    isAffiliate: {
      type: Boolean,
      default: false
    },
    referralCode: {
      type: String
    },
    referredBy: {
      type: String
    },
    earnings: {
      type: Number,
      default: 0
    },
    referrals: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      date: {
        type: Date,
        default: Date.now
      },
      commission: {
        type: Number,
        default: 0
      },
      status: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
      }
    }]
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
