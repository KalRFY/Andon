const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/smartandon/dashboard.controller');

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Dashboard API is working',
    data: {
      version: '1.0.0',
      endpoints: [
        '/dashboard',
        '/dashboard/metrics',
        '/dashboard/data',
        '/dashboard/machine-stop-input'
      ]
    }
  });
});

router.get('/data', dashboardController.getDashboardData);

router.post('/machine-stop-input', dashboardController.saveMachineStopInput);

module.exports = router;