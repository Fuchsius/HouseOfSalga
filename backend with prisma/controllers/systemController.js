const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Get all systems
const getSystems = async (req, res) => {
    try {
        const systems = await prisma.system.findMany();
        res.status(200).json(systems);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving systems' });
    }
};

// Get system by ID
const getSystemById = async (req, res) => {
    const systemId = parseInt(req.params.id);

    try {
        const system = await prisma.system.findUnique({
            where: { id: systemId }
        });

        if (!system) {
            return res.status(404).json({ error: 'System not found' });
        }

        res.status(200).json(system);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving system' });
    }
};

// Create new system
const createSystem = async (req, res) => {
    const { name, description, deliveryFee, taxRate } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        const system = await prisma.system.create({
            data: {
                name,
                description,
                deliveryFee,
                taxRate
            }
        });

        res.status(201).json(system);
    } catch (error) {
        res.status(500).json({ error: 'Error creating system' });
    }
};

// Update system
const updateSystem = async (req, res) => {
    const systemId = parseInt(req.params.id);
    const { name, description, deliveryFee, taxRate } = req.body;

    try {
        const system = await prisma.system.update({
            where: { id: systemId },
            data: { name, description, deliveryFee, taxRate }
        });

        res.status(200).json(system);
    } catch (error) {
        res.status(500).json({ error: 'Error updating system' });
    }
};

// Delete system
const deleteSystem = async (req, res) => {
    const systemId = parseInt(req.params.id);

    try {
        await prisma.system.delete({
            where: { id: systemId }
        });

        res.status(200).json({ message: 'System deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting system' });
    }
};

module.exports = {
    getSystems,
    getSystemById,
    createSystem,
    updateSystem,
    deleteSystem
};
