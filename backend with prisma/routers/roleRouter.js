const express = require('express');
const router = express.Router();

const {
    getRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
} = require('../controllers/roleController');

router.get('/roles', getRoles);
router.get('/roles/:id', getRoleById);
router.post('/roles', createRole);
router.put('/roles/:id', updateRole);
router.delete('/roles/:id', deleteRole);

module.exports = router;