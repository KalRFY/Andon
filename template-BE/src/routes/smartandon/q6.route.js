const express = require('express');

const router = express.Router();
const q6Controller = require('../../controllers/smartandon/q6.controller');

router.get('/', q6Controller.defaultController);
router.get('/q6-analysis', q6Controller.getQ6AnalysisController);
router.get('/o6-analysis', q6Controller.getO6AnalysisController);

module.exports = router;