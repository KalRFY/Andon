const express = require('express');
const router = express.Router();
const machineController = require('../../controllers/smartandon/machine.controller');

router.get('/machine', machineController.getMachine);
router.post('/newMachine', machineController.createMachine);
router.put('/machine/:fid', machineController.updateMachine);
router.delete('/machine/:fid', machineController.deleteMachine);

module.exports = router;