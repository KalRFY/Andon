const express = require('express');
const downloadController = require('../../controllers/smartandon/download.controller');

const router = express.Router();

router.get('/download-report', downloadController.downloadReport);
router.get('/download-template', downloadController.downloadTemplate);
router.get('/all-problems', downloadController.getAllProblems);
router.get('/image', downloadController.getImageController);
router.get('/download-excel', downloadController.downloadExcel);

module.exports = router;