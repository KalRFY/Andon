const express = require('express');
const router = express.Router();
const machineStopInputController = require('../../controllers/smartandon/machineStopInput.controller');

router.get('/machineStopInput', machineStopInputController.getMachineStopInput);
router.get('/problemNameSuggestions', machineStopInputController.getProblemNameSuggestions);
router.put('/problemMachine', machineStopInputController.putMachineStopInput);

module.exports = router;