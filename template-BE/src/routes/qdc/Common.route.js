const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const commonController = require('../../controllers/qdc/Common.controller');

const router = express.Router();

router.route('/line/search').post(commonController.searchLine);

module.exports = router;
