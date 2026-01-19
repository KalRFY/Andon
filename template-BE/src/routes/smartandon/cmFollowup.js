const express = require('express');
const router = express.Router();
const cmFollowupController = require('../../controllers/smartandon/cmFollowup.controller');

router.get('/cm-followup', cmFollowupController.getFollowups);

module.exports = router;