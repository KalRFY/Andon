const express = require('express');
const router = express.Router();
const kyMachineController = require('../../controllers/smartandon/kyMachine.controller');
const upload = require('../../middlewares/upload');

router.get('/lines', kyMachineController.getLines);
router.get('/machines', kyMachineController.getMachines);
router.get('/get', kyMachineController.getKYMachineData);
router.get('/colordash', kyMachineController.getColorDash);

router.post('/add', upload.single('ilustration'), kyMachineController.addKY);
router.put('/edit', upload.single('ilustration'), kyMachineController.editKY);
router.delete('/delete/:id', kyMachineController.deleteKY);

module.exports = router;
