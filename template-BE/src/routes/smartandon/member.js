const express = require('express');
const router = express.Router();
const memberController = require('../../controllers/smartandon/member.controller');

router.get('/member', memberController.getMember);
router.get('/roles', memberController.getRoles);
router.get('/members-by-role/:role', memberController.getMembersByRole);

module.exports = router;
