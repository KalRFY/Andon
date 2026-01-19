const express = require('express');
const {auth} = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const upload = require("../../middlewares/upload");
const gaugeValidation = require('../../validations/qdc/Gauge.validation');
const gaugeController = require('../../controllers/qdc/Gauge.controller');

const router = express.Router();


router.route('/add').post(auth(), validate(gaugeValidation.createGauge), gaugeController.createGauge);
router.route('/edit').post(auth(), validate(gaugeValidation.updateGauge), gaugeController.updateGauge);
router.route('/delete').post(auth(), validate(gaugeValidation.deleteGauge), gaugeController.deleteGauge);
router.route('/search').post(auth(), validate(gaugeValidation.searchGauge), gaugeController.searchGauge);
router.route('/get').post(auth(), validate(gaugeValidation.getGauge), gaugeController.getGauge);

module.exports = router;
