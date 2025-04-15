const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

// Controllers
const affiliateController = require('../controllers/affiliateController');

// Affiliate dashboard
router.get('/dashboard', ensureAuthenticated, affiliateController.renderDashboard);

// Become an affiliate
router.post('/join', ensureAuthenticated, affiliateController.joinAffiliate);

// Get affiliate stats
router.get('/stats', ensureAuthenticated, affiliateController.getStats);

// Track referral click
router.get('/track/:code', affiliateController.trackClick);

// Referral signup
router.get('/signup/:code', affiliateController.renderSignupWithReferral);

module.exports = router;
