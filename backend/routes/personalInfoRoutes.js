const express = require('express');
const router = express.Router();
const personalInfoController = require('../controllers/personalInfoController');

router.post('/', personalInfoController.createPersonalInfo);
router.get('/', personalInfoController.getAllPersonalInfo);
router.get('/:id', personalInfoController.getPersonalInfoById);
router.put('/:id', personalInfoController.updatePersonalInfo);
router.delete('/:id', personalInfoController.deletePersonalInfo);

module.exports = router;
