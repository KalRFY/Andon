const express = require('express');
const router = express.Router();
const sparepartsController = require('../../controllers/smartandon/sparepart.controller');

router.get('/spareparts', sparepartsController.getSpareparts);
router.get('/spareparts/last-id', sparepartsController.getLastSparepartId);
router.post('/spareparts', sparepartsController.createSparepart);

module.exports = router;