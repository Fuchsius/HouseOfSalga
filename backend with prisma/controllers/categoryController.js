const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            where: { status: { not: "deleted" } },
            include: { products: true }
        });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving categories' });
    }
};

// Get category by ID
const getCategoryById = async (req, res) => {
    const categoryId = parseInt(req.params.id);
    try {
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: { products: true }
        });

        if (!category || category.status === "deleted") {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving category' });
    }
};

// Create new category
const createCategory = async (req, res) => {
    const { name, description, status } = req.body;

    if (!name) {
        return res.status(400).json("Name is required");
    }

    try {
        const category = await prisma.category.create({
            data: {
                name,
                description,
                status: status || 'active'
            }
        });

        res.status(201).json(category, "Category created successfully");
    } catch (error) {
        res.status(500).json({ error: 'Error creating category' });
    }
};

// Update category
const updateCategory = async (req, res) => {
    const categoryId = parseInt(req.params.id);
    const { name, description, status } = req.body;

    try {
        const category = await prisma.category.update({
            where: { id: categoryId },
            data: { name, description, status }
        });

        res.status(200).json(category, "Category updated successfully");
    } catch (error) {
        res.status(500).json({ error: 'Error updating category' });
    }
};

// Soft delete category
const deleteCategory = async (req, res) => {
    const categoryId = parseInt(req.params.id);

    try {
        const category = await prisma.category.update({
            where: { id: categoryId },
            data: { status: "deleted" }
        });

        res.status(200).json(category, "Category deleted");
    } catch (error) {
        res.status(500).json({ error: 'Error deleting category' });
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
