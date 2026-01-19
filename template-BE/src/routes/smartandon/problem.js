const express = require('express');

const router = express.Router();
const multer = require('multer');
const problemController = require('../../controllers/smartandon/problem.controller');

const upload = multer({ dest: 'upload/' });

router.get('/problem', problemController.getProblem);


router.get('/problemView', problemController.getProblemView);

router.get('/problemId/:fid', problemController.getProblemById);

router.get('/problemUpdate', problemController.getProblem);

router.put(
  '/update',
  upload.fields([
    { name: 'actualImage', maxCount: 1 },
    { name: 'uploadImage', maxCount: 1 },
    { name: 'standartImage', maxCount: 1 },
    { name: 'whyImage', maxCount: 1 },
    { name: 'whyLamaImage', maxCount: 1 },
    { name: 'uploadFile', maxCount: 1 },
    { name: 'attachmentMeeting', maxCount: 1 },
    { name: 'file_report', maxCount: 1 },
  ]),
  problemController.updateProblem
);

router.delete('/problem/delete/:id', problemController.deleteProblem);



module.exports = router;
