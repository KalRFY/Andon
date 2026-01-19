const express = require('express');
const inspectionController = require('../controllers/inspection.controller');

const router = express.Router();

router.get('/classes', inspectionController.getInspectionClasses);
router.post('/classes', inspectionController.addInspectionClass);
router.get('/history', inspectionController.getInspectionHistory);

module.exports = router;
