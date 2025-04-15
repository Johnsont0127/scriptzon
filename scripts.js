const express = require('express');
const router = express.Router();
const { ensureAuthenticated, checkScriptLimit } = require('../middleware/auth');

// Controllers
const scriptController = require('../controllers/scriptController');

// Script generator page
router.get('/generate', ensureAuthenticated, checkScriptLimit, scriptController.renderGenerator);

// Generate script
router.post('/generate', ensureAuthenticated, checkScriptLimit, scriptController.generateScript);

// Get all scripts
router.get('/', ensureAuthenticated, scriptController.getAllScripts);

// Get single script
router.get('/:id', ensureAuthenticated, scriptController.getScript);

// Delete script
router.delete('/:id', ensureAuthenticated, scriptController.deleteScript);

// Regenerate script
router.post('/:id/regenerate', ensureAuthenticated, checkScriptLimit, scriptController.regenerateScript);

// Download script
router.get('/:id/download', ensureAuthenticated, scriptController.downloadScript);

module.exports = router;
