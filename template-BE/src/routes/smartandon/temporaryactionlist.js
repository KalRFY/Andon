const express = require('express');
const router = express.Router();
const temporaryActionController = require('../../controllers/smartandon/temporaryaction.controller');

router.get('/temporary', temporaryActionController.getTemporaryAction);
router.post('/temporary', temporaryActionController.createTemporaryAction);
router.put('/temporary/:fid', temporaryActionController.updateTemporaryAction);
router.delete('/temporary/delete/:fid', temporaryActionController.deleteTemporaryAction);

module.exports = router;