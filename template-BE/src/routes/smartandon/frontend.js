const express = require('express');
const router = express.Router();
const frontendController = require('../../controllers/smartandon/frontend.controller');

router.get('/frontend', frontendController.getFrontend);

module.exports = router;