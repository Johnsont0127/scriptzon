const Script = require('../models/Script');

// Render landing page
exports.renderLanding = (req, res) => {
  res.render('landing', {
    title: 'AI-Powered Video Scripts for Amazon Influencers',
    layout: false
  });
};

// Render dashboard
exports.renderDashboard = async (req, res) => {
  try {
    // Get user's scripts
    const scripts = await Script.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    res.render('dashboard', {
      title: 'Dashboard',
      layout: 'dashboard-layout',
      path: '/dashboard',
      scripts
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'An error occurred while loading your dashboard');
    res.redirect('/');
  }
};

// Render pricing page
exports.renderPricing = (req, res) => {
  res.render('pricing', {
    title: 'Pricing'
  });
};

// Render about page
exports.renderAbout = (req, res) => {
  res.render('about', {
    title: 'About'
  });
};

// Render terms page
exports.renderTerms = (req, res) => {
  res.render('terms', {
    title: 'Terms of Service'
  });
};

// Render privacy page
exports.renderPrivacy = (req, res) => {
  res.render('privacy', {
    title: 'Privacy Policy'
  });
};

// Render success page after payment
exports.renderSuccess = (req, res) => {
  res.render('success', {
    title: 'Payment Successful'
  });
};

// Render cancel page after payment cancellation
exports.renderCancel = (req, res) => {
  res.render('cancel', {
    title: 'Payment Cancelled'
  });
};
