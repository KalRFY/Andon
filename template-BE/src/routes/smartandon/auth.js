const express = require('express');

const router = express.Router();
const authController = require('../../controllers/smartandon/auth.controller');

router.get('/', authController.defaultController);
router.post('/register', authController.registerController);
router.post('/login', authController.loginController);

module.exports = router;