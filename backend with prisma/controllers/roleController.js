const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const getRoles = (req, res) => {
    prisma.role.findMany({
        include: {
            users: true
        }
    })
        .then(roles => {
            res.status(200).json(roles);
        })
        .catch(error => {
            res.status(500).json({ error: 'Error retrieving roles' });
        });
};

const getRoleById = (req, res) => {
    const roleId = parseInt(req.params.id);

    prisma.role.findUnique({
        where: {
            id: roleId,
        },
        include: {
            users: true
        }
    })
        .then(role => {
            if (role) {
                res.status(200).json(role);
            } else {
                res.status(404).json('Role not found');
            }
        })
        .catch(error => {
            res.status(500).json({ error: 'Error retrieving role' });
        });
};

const createRole = async (req, res) => {
    const { name, description, status } = req.body;

    if (!name || !description || !status) {
        return res.status(400).json('Name, description and status are required');
    }

    try {
        const role = await prisma.role.create({
            data: {
                name,
                description,
                status
            }
        });
        res.status(201).json('Role created successfully');
    } catch (error) {
        res.status(500).json({ error: 'Error creating role' });
    }
};

const updateRole = async (req, res) => {
    const roleId = parseInt(req.params.id);
    const { name, description, status } = req.body;

    try {
        const role = await prisma.role.update({
            where: { id: roleId },
            data: {
                name,
                description,
                status
            }
        });
        res.status(200).json('Role updated successfully');
    } catch (error) {
        res.status(500).json({ error: 'Error updating role' });
    }
};


const deleteRole = async (req, res) => {
    const roleId = parseInt(req.params.id);

    try {
        const role = await prisma.role.update({
            where: { id: roleId },
            data: { status: 'deleted' }
        });

        res.status(200).json('Role deleted successfully', role);
    } catch (error) {
        res.status(500).json({ error: 'Error deleting role' });
    }
};


module.exports = {
    getRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
};