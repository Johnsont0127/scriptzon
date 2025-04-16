const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../middleware/auth');

// Controllers
const indexController = require('../controllers/indexController');

// Landing page
router.get('/', ensureGuest, indexController.renderLanding);

// Dashboard
router.get('/dashboard', ensureAuthenticated, indexController.renderDashboard);

// Pricing page
router.get('/pricing', indexController.renderPricing);

// About page
router.get('/about', indexController.renderAbout);

// Terms and Privacy
router.get('/terms', indexController.renderTerms);
router.get('/privacy', indexController.renderPrivacy);

// Success and cancel pages for Stripe
router.get('/success', indexController.renderSuccess);
router.get('/cancel', indexController.renderCancel);

module.exports = router;
