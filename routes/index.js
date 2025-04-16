const express = require('express');
const router = express.Router();

// Home page route
router.get('/', (req, res) => {
  res.render('landing', {
    title: 'ScriptZon - AI-Powered Video Scripts for Amazon Influencers'
  });
});

// About page route
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About ScriptZon'
  });
});

// Pricing page route
router.get('/pricing', (req, res) => {
  res.render('pricing', {
    title: 'ScriptZon Pricing Plans'
  });
});

module.exports = router;
