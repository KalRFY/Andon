const express = require('express');
const router = express.Router();
const focusThemaController = require('../../controllers/smartandon/focusThema.controller');

router.get('/focusThema/', focusThemaController.getFocusThema);

module.exports = router;
