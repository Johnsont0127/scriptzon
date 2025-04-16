const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const User = require('../models/user');
const Affiliate = require('../models/affiliate');

// Affiliate Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    // Check if user is an affiliate
    const affiliate = await Affiliate.findOne({ user: req.user.id });
    
    if (!affiliate) {
      return res.redirect('/affiliates/join');
    }
    
    // Get referrals
    const referrals = await User.find({ referredBy: affiliate.referralCode }).select('name email plan date');
    
    res.render('affiliate-dashboard', {
      title: 'Affiliate Dashboard - ScriptZon',
      user: req.user,
      affiliate,
      referrals,
      earnings: referrals.length * 30 * 0.3 // Simple calculation: $30 * 30% commission
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error loading affiliate dashboard');
    res.redirect('/dashboard');
  }
});

// Join Affiliate Program
router.get('/join', ensureAuthenticated, async (req, res) => {
  try {
    // Check if user is already an affiliate
    const existingAffiliate = await Affiliate.findOne({ user: req.user.id });
    
    if (existingAffiliate) {
      return res.redirect('/affiliates/dashboard');
    }
    
    res.render('affiliate-join', {
      title: 'Join Affiliate Program - ScriptZon',
      user: req.user
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error loading affiliate join page');
    res.redirect('/dashboard');
  }
});

// Process Affiliate Join
router.post('/join', ensureAuthenticated, async (req, res) => {
  try {
    // Check if user is already an affiliate
    const existingAffiliate = await Affiliate.findOne({ user: req.user.id });
    
    if (existingAffiliate) {
      return res.redirect('/affiliates/dashboard');
    }
    
    // Generate unique referral code
    const referralCode = 'SCZ' + req.user.id.substring(0, 6);
    
    // Create new affiliate
    const newAffiliate = new Affiliate({
      user: req.user.id,
      name: req.user.name,
      email: req.user.email,
      referralCode,
      paymentEmail: req.body.paymentEmail || req.user.email
    });
    
    await newAffiliate.save();
    
    // Update user with affiliate ID
    await User.findByIdAndUpdate(req.user.id, {
      affiliateId: newAffiliate._id
    });
    
    req.flash('success_msg', 'You have successfully joined the affiliate program!');
    res.redirect('/affiliates/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error joining affiliate program');
    res.redirect('/affiliates/join');
  }
});

// Refer a Friend Page
router.get('/refer', ensureAuthenticated, async (req, res) => {
  try {
    // Check if user is an affiliate
    const affiliate = await Affiliate.findOne({ user: req.user.id });
    
    if (!affiliate) {
      return res.redirect('/affiliates/join');
    }
    
    res.render('refer-friend', {
      title: 'Refer a Friend - ScriptZon',
      user: req.user,
      affiliate
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error loading refer a friend page');
    res.redirect('/dashboard');
  }
});

module.exports = router;
