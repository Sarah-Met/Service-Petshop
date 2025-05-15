import categoryModel from '../models/categoryModel.js';

// Create category
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await categoryModel.create({
            name,
            description
        });
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in creating category",
            error
        });
    }
};

// Get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.status(200).json({
            success: true,
            message: "All Categories List",
            categories
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in getting categories",
            error
        });
    }
};

// Get single category
export const getSingleCategory = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Single Category Fetched",
            category
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in getting single category",
            error
        });
    }
};

// Update category
export const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await categoryModel.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Category Updated Successfully",
            category
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in updating category",
            error
        });
    }
};

// Delete category
export const deleteCategory = async (req, res) => {
    try {
        const category = await categoryModel.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Category Deleted Successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in deleting category",
            error
        });
    }
}; 