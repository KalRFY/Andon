const express = require('express');
const router = express.Router();
const robotInspectionController = require('../controllers/robotInspectionController');

// Routes for robot inspection with AI
router.post('/ai-analyze', robotInspectionController.uploadInspection, robotInspectionController.createInspection);
router.get('/', robotInspectionController.getInspections);
router.put('/:id', robotInspectionController.updateInspection);
router.delete('/:id', robotInspectionController.deleteInspection);

module.exports = router;
