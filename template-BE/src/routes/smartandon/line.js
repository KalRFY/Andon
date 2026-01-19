const express = require('express');
const router = express.Router();
const lineController = require('../../controllers/smartandon/line.controller');

router.get('/line', lineController.getLine);

module.exports = router;