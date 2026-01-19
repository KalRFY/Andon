const express = require('express');
const router = express.Router();
const userController = require('../../controllers/smartandon/user.controller');
const { authMiddleware } = require('../../middlewares/auth');

router.get('/', userController.defaultController);
router.get('/user', authMiddleware, userController.getCurrentUserController);

module.exports = router;

