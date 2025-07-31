const express = require('express');
const router = express.Router();
const {
    getSystems,
    getSystemById,
    createSystem,
    updateSystem,
    deleteSystem
} = require('../controllers/systemController');

router.get('/system', getSystems);
router.get('/system/:id', getSystemById);
router.post('/system/create', createSystem);
router.put('/system/update/:id', updateSystem);
router.delete('/system/delete/:id', deleteSystem);

module.exports = router;
