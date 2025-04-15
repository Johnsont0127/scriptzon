module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to access this resource');
    res.redirect('/users/login');
  },
  
  ensureGuest: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');
  },

  checkScriptLimit: function(req, res, next) {
    // If user is on a pro plan, allow unlimited scripts
    if (req.user.subscription.plan !== 'free') {
      return next();
    }
    
    // For free users, check if they've reached their monthly limit
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Reset count if it's a new month
    if (req.user.scriptCount.month !== currentMonth || 
        req.user.scriptCount.year !== currentYear) {
      req.user.scriptCount.count = 0;
      req.user.scriptCount.month = currentMonth;
      req.user.scriptCount.year = currentYear;
      req.user.save();
      return next();
    }
    
    // Check if user has reached the limit (3 scripts per month for free plan)
    if (req.user.scriptCount.count >= 3) {
      req.flash('error_msg', 'You have reached your monthly script limit. Please upgrade to continue.');
      return res.redirect('/dashboard');
    }
    
    next();
  }
};
