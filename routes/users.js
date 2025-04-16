const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../middleware/auth');
const User = require('../models/user');

// Login Page
router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login - ScriptZon'
  });
});

// Register Page
router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register - ScriptZon'
  });
});

// Register Handle
router.post('/register', async (req, res) => {
  const { name, email, password, password2 } = req.body;
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
      title: 'Register - ScriptZon',
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    try {
      // Check if user exists
      const user = await User.findOne({ email });
      
      if (user) {
        errors.push({ msg: 'Email is already registered' });
        res.render('register', {
          title: 'Register - ScriptZon',
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        // Save user to database
        await newUser.save();
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/users/login');
      }
    } catch (err) {
      console.error(err);
      res.render('error', {
        message: 'Server Error',
        error: { status: 500, stack: err.stack }
      });
    }
  }
});

// Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
});

// Account Page
router.get('/account', ensureAuthenticated, (req, res) => {
  res.render('account', {
    title: 'Account Settings - ScriptZon',
    user: req.user
  });
});

// Update Account
router.post('/account', ensureAuthenticated, async (req, res) => {
  const { name, email } = req.body;
  
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email
    });
    
    req.flash('success_msg', 'Account updated successfully');
    res.redirect('/users/account');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error updating account');
    res.redirect('/users/account');
  }
});

// Forgot Password Page
router.get('/forgot-password', (req, res) => {
  res.render('forgot-password', {
    title: 'Forgot Password - ScriptZon'
  });
});

// Reset Password Page
router.get('/reset-password/:token', (req, res) => {
  res.render('reset-password', {
    title: 'Reset Password - ScriptZon',
    token: req.params.token
  });
});

module.exports = router;
