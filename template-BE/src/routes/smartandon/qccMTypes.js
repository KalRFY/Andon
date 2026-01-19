const express = require('express');
const router = express.Router();
const qccMTypesController = require('../../controllers/smartandon/qccMTypes.controller');

router.get('/qcc-m-types', qccMTypesController.getQccMTypes);

module.exports = router;
