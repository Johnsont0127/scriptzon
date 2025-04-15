const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

// Controllers
const paymentController = require('../controllers/paymentController');

// Create checkout session for Pro Monthly
router.post('/create-checkout-session/monthly', ensureAuthenticated, paymentController.createMonthlyCheckoutSession);

// Create checkout session for Pro Annual
router.post('/create-checkout-session/annual', ensureAuthenticated, paymentController.createAnnualCheckoutSession);

// Stripe webhook
router.post('/webhook', express.raw({type: 'application/json'}), paymentController.handleWebhook);

// Customer portal
router.get('/customer-portal', ensureAuthenticated, paymentController.customerPortal);

// Cancel subscription
router.post('/cancel-subscription', ensureAuthenticated, paymentController.cancelSubscription);

module.exports = router;
