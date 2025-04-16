const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../middleware/auth');

// Controllers
const userController = require('../controllers/userController');

// Login Page
router.get('/login', ensureGuest, userController.renderLogin);

// Register Page
router.get('/register', ensureGuest, userController.renderRegister);

// Register Handle
router.post('/register', userController.registerUser);

// Login Handle
router.post('/login', userController.loginUser);

// Logout Handle
router.get('/logout', userController.logoutUser);

// Account Page
router.get('/account', ensureAuthenticated, userController.renderAccount);

// Update Account
router.post('/account', ensureAuthenticated, userController.updateAccount);

// Forgot Password
router.get('/forgot-password', ensureGuest, userController.renderForgotPassword);
router.post('/forgot-password', userController.forgotPassword);

// Reset Password
router.get('/reset-password/:token', userController.renderResetPassword);
router.post('/reset-password/:token', userController.resetPassword);

module.exports = router;
