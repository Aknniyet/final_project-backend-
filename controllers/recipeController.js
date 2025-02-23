const Recipe = require('../models/Recipe');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });
exports.upload = upload.single('image');

// Create a new recipe with category
exports.createRecipe = async (req, res) => {
    try {
        const { title, ingredients, instructions, category } = req.body;
        
        // Validate required fields
        if (!title || !ingredients || !instructions || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Allowed categories for validation
        const allowedCategories = ["Breakfast", "Lunch", "Dinner", "Dessert", "Drinks"];
        if (!allowedCategories.includes(category.trim())) {
            return res.status(400).json({ message: "Invalid category" });
        }

        const existingRecipe = await Recipe.findOne({ title: title.trim() });
        if (existingRecipe) {
            return res.status(400).json({ message: "A recipe with this title already exists" });
        }

        // Save image path if uploaded
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const newRecipe = new Recipe({
            title: title.trim(),
            ingredients: ingredients.split(',').map(i => i.trim()), 
            instructions: instructions.trim(),
            category: category.trim(),
            image: imagePath,
            createdBy: req.user.id
        });

        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating recipe" });
    }
};

// Retrieve all recipes with optional category filtering
exports.getRecipes = async (req, res) => {
    try {
        const { category, search } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (search) filter.title = { $regex: search, $options: "i" }; 

        const recipes = await Recipe.find(filter)
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving recipes" });
    }
};

// Retrieve a single recipe by ID
exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });
        res.json({ ...recipe.toObject(), imageUrl: recipe.image });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving recipe" });
    }
};

// Update a recipe with category validation
exports.updateRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        // Check user permissions 
        if (recipe.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        // Validate unique title if updated
        if (req.body.title) {
            const existingRecipe = await Recipe.findOne({ title: req.body.title.trim() });
            if (existingRecipe && existingRecipe._id.toString() !== recipe._id.toString()) {
                return res.status(400).json({ message: "A recipe with this title already exists" });
            }
            recipe.title = req.body.title.trim();
        }

        // Update fields if provided
        if (req.body.ingredients) recipe.ingredients = req.body.ingredients.split(",").map(i => i.trim());
        if (req.body.instructions) recipe.instructions = req.body.instructions.trim();
        if (req.body.category) recipe.category = req.body.category.trim();

        // Handle image update
        if (req.file) {
            if (recipe.image) {
                const oldImagePath = path.join(__dirname, "..", recipe.image);
                if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
            }
            recipe.image = `/uploads/${req.file.filename}`;
        }

        await recipe.save();
        res.json({ message: "Recipe successfully updated!", recipe });
    } catch (error) {
        res.status(500).json({ message: "Error updating recipe" });
    }
};

// Delete a recipe
exports.deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        // Check user permissions
        if (recipe.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        // Delete associated image if exists
        if (recipe.image) {
            const imagePath = path.join(__dirname, "..", recipe.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Recipe.deleteOne({ _id: req.params.id });
        return res.json({ message: "Recipe successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting recipe" });
    }
};

// Get distinct recipe categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Recipe.distinct("category", { category: { $ne: "" } });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving categories" });
    }
};

// Aggregation - Count recipes by category
exports.getRecipeStatistics = async (req, res) => {
    try {
        const { days } = req.query;
        const filterDate = new Date();
        filterDate.setDate(filterDate.getDate() - (days ? parseInt(days) : 30));

        const stats = await Recipe.aggregate([
            { $match: { category: { $ne: "" }, createdAt: { $gte: filterDate } } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const totalRecipes = await Recipe.countDocuments(); 

        res.json({ totalRecipes, stats });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving statistics" });
    }
};