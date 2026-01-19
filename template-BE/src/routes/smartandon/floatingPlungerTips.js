const express = require('express');
const router = express.Router();
const floatingPlungerTipsController = require('../../controllers/smartandon/floatingPlungerTips.controller');

router.get('/floatingPlungerTips/', floatingPlungerTipsController.getFloatingPlungerTips);
router.post('/floatingPlungerTips/', floatingPlungerTipsController.createFloatingPlungerTip);
router.put('/floatingPlungerTips/:id', floatingPlungerTipsController.updateFloatingPlungerTip);
router.delete('/floatingPlungerTips/delete/:id', floatingPlungerTipsController.deleteFloatingPlungerTip);
router.get('/floatingPlungerTips/machines', floatingPlungerTipsController.getFloatingPlungerTipsMachines);
router.get('/floatingPlungerTips/ikdm-0101', floatingPlungerTipsController.getFloatingPlungerTips0101);
router.get('/floatingPlungerTips/ikdm-0102', floatingPlungerTipsController.getFloatingPlungerTips0102);








module.exports = router;