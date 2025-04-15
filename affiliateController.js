const User = require('../models/User');
const Affiliate = require('../models/Affiliate');
const { v4: uuidv4 } = require('uuid');

// Render affiliate dashboard
exports.renderDashboard = async (req, res) => {
  try {
    // Check if user is already an affiliate
    if (!req.user.affiliate.isAffiliate) {
      return res.render('affiliate-join', {
        title: 'Become an Affiliate',
        layout: 'dashboard-layout',
        path: '/affiliates/dashboard'
      });
    }
    
    // Get affiliate data
    const affiliate = await Affiliate.findOne({ user: req.user.id }).populate('signups.user', 'name email');
    
    if (!affiliate) {
      req.flash('error_msg', 'Affiliate account not found');
      return res.redirect('/dashboard');
    }
    
    res.render('affiliate-dashboard', {
      title: 'Affiliate Dashboard',
      layout: 'dashboard-layout',
      path: '/affiliates/dashboard',
      affiliate
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error loading affiliate dashboard');
    res.redirect('/dashboard');
  }
};

// Join affiliate program
exports.joinAffiliate = async (req, res) => {
  try {
    // Check if user is already an affiliate
    if (req.user.affiliate.isAffiliate) {
      req.flash('error_msg', 'You are already an affiliate');
      return res.redirect('/affiliates/dashboard');
    }
    
    // Generate referral code if not exists
    const referralCode = req.user.affiliate.referralCode || uuidv4().substring(0, 8);
    
    // Create referral link
    const referralLink = `${process.env.BASE_URL}/users/register?ref=${referralCode}`;
    
    // Update user as affiliate
    await User.findByIdAndUpdate(req.user.id, {
      'affiliate.isAffiliate': true,
      'affiliate.referralCode': referralCode
    });
    
    // Create affiliate record
    const newAffiliate = new Affiliate({
      user: req.user.id,
      referralCode,
      referralLink
    });
    
    await newAffiliate.save();
    
    req.flash('success_msg', 'You have successfully joined the affiliate program');
    res.redirect('/affiliates/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error joining affiliate program');
    res.redirect('/affiliates/dashboard');
  }
};

// Get affiliate stats
exports.getStats = async (req, res) => {
  try {
    // Check if user is an affiliate
    if (!req.user.affiliate.isAffiliate) {
      return res.status(403).json({ success: false, error: 'Not an affiliate' });
    }
    
    // Get affiliate data
    const affiliate = await Affiliate.findOne({ user: req.user.id });
    
    if (!affiliate) {
      return res.status(404).json({ success: false, error: 'Affiliate account not found' });
    }
    
    // Calculate stats
    const stats = {
      clicks: affiliate.clicks,
      signups: affiliate.signups.length,
      totalEarnings: affiliate.totalEarnings,
      pendingEarnings: affiliate.pendingEarnings,
      paidEarnings: affiliate.paidEarnings
    };
    
    res.status(200).json({ success: true, stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Track referral click
exports.trackClick = async (req, res) => {
  try {
    const { code } = req.params;
    
    // Find affiliate by referral code
    const affiliate = await Affiliate.findOne({ referralCode: code });
    
    if (!affiliate) {
      return res.redirect('/');
    }
    
    // Increment click count
    affiliate.clicks += 1;
    await affiliate.save();
    
    // Set referral cookie
    res.cookie('referral', code, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }); // 30 days
    
    // Redirect to registration page with referral code
    res.redirect(`/users/register?ref=${code}`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};

// Render signup with referral
exports.renderSignupWithReferral = (req, res) => {
  const { code } = req.params;
  
  // Set referral cookie
  res.cookie('referral', code, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }); // 30 days
  
  // Redirect to registration page with referral code
  res.redirect(`/users/register?ref=${code}`);
};
