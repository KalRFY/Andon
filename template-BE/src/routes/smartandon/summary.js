const express = require('express');
const router = express.Router();
const summaryController = require('../../controllers/smartandon/summary.controller');

router.get('/ltb-summary', summaryController.getLTBSummary);
router.get('/ltr-sltr-summary', summaryController.getLTRSLTRSummary);

module.exports = router;