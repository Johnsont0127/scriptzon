const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

// Render login page
exports.renderLogin = (req, res) => {
  res.render('login', {
    title: 'Login'
  });
};

// Render register page
exports.renderRegister = (req, res) => {
  const referralCode = req.query.ref || null;
  res.render('register', {
    title: 'Register',
    referralCode
  });
};

// Register user
exports.registerUser = async (req, res) => {
  const { name, email, password, password2, referralCode } = req.body;
  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  // Check passwords match
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  // Check password length
  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      title: 'Register',
      errors,
      name,
      email,
      password,
      password2,
      referralCode
    });
  } else {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        errors.push({ msg: 'Email is already registered' });
        return res.render('register', {
          title: 'Register',
          errors,
          name,
          email,
          password,
          password2,
          referralCode
        });
      }

      // Create new user
      const newUser = new User({
        name,
        email,
        password
      });

      // If user was referred, add referral code
      if (referralCode) {
        const referrer = await User.findOne({ 'affiliate.referralCode': referralCode });
        if (referrer) {
          newUser.affiliate.referredBy = referralCode;
        }
      }

      // Generate a unique referral code for the new user
      newUser.affiliate.referralCode = uuidv4().substring(0, 8);

      // Hash password
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);

      // Save user
      await newUser.save();

      // If this was a referral, update the referrer's affiliate data
      if (referralCode) {
        const referrer = await User.findOne({ 'affiliate.referralCode': referralCode });
        if (referrer) {
          // Add this user to the referrer's referrals list
          referrer.affiliate.referrals.push({
            userId: newUser._id,
            date: Date.now(),
            commission: 0,
            status: 'pending'
          });
          await referrer.save();
        }
      }

      req.flash('success_msg', 'You are now registered and can log in');
      res.redirect('/users/login');
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'An error occurred during registration');
      res.redirect('/users/register');
    }
  }
};

// Login user
exports.loginUser = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
};

// Logout user
exports.logoutUser = (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
};

// Render account page
exports.renderAccount = (req, res) => {
  res.render('account', {
    title: 'Account Settings',
    layout: 'dashboard-layout',
    path: '/users/account'
  });
};

// Update account
exports.updateAccount = async (req, res) => {
  const { name, email } = req.body;
  
  try {
    // Update user
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email
    });
    
    req.flash('success_msg', 'Account updated successfully');
    res.redirect('/users/account');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'An error occurred while updating your account');
    res.redirect('/users/account');
  }
};

// Render forgot password page
exports.renderForgotPassword = (req, res) => {
  res.render('forgot-password', {
    title: 'Forgot Password'
  });
};

// Process forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      req.flash('error_msg', 'No account with that email address exists');
      return res.redirect('/users/forgot-password');
    }
    
    // Generate reset token
    const token = crypto.randomBytes(20).toString('hex');
    
    // Set token and expiration
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
    await user.save();
    
    // In a real application, you would send an email with the reset link
    // For this example, we'll just flash a message with the token
    req.flash('success_msg', `Password reset token: ${token}`);
    res.redirect('/users/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'An error occurred');
    res.redirect('/users/forgot-password');
  }
};

// Render reset password page
exports.renderResetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      req.flash('error_msg', 'Password reset token is invalid or has expired');
      return res.redirect('/users/forgot-password');
    }
    
    res.render('reset-password', {
      title: 'Reset Password',
      token: req.params.token
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'An error occurred');
    res.redirect('/users/forgot-password');
  }
};

// Process reset password
exports.resetPassword = async (req, res) => {
  const { password, password2 } = req.body;
  const { token } = req.params;
  
  // Validate passwords
  if (password !== password2) {
    req.flash('error_msg', 'Passwords do not match');
    return res.redirect(`/users/reset-password/${token}`);
  }
  
  if (password.length < 6) {
    req.flash('error_msg', 'Password should be at least 6 characters');
    return res.redirect(`/users/reset-password/${token}`);
  }
  
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      req.flash('error_msg', 'Password reset token is invalid or has expired');
      return res.redirect('/users/forgot-password');
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    
    req.flash('success_msg', 'Your password has been updated. You can now log in with your new password');
    res.redirect('/users/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'An error occurred');
    res.redirect(`/users/reset-password/${token}`);
  }
};
