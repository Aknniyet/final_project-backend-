const User = require("../models/User");
const Recipe = require("../models/Recipe");

// Toggle favorite recipe 
exports.toggleFavorite = async (req, res) => {
    try {
        const { recipeId } = req.body; // Get recipe ID from request body
        if (!recipeId) return res.status(400).json({ message: "Recipe ID is required" });

        const recipe = await Recipe.findById(recipeId); 
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        const user = await User.findById(req.user.id); 
        if (!user) return res.status(404).json({ message: "User not found" });

        const index = user.favorites.indexOf(recipeId); // Check if recipe is in favorites
        if (index === -1) {
            user.favorites.push(recipeId);
        } else {
            user.favorites.splice(index, 1); 
        }

        await user.save(); 
        res.json({ favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

//  Get user's favorite recipes
exports.getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("favorites"); 
        res.json(user.favorites); 
    } catch (error) {
        res.status(500).json({ message: "Error retrieving favorites", error });
    }
};

// Toggle like on recipe
exports.toggleLike = async (req, res) => {
    try {
        const { recipeId } = req.body; 
        if (!recipeId) return res.status(400).json({ message: "Recipe ID is required" });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const index = user.likes.indexOf(recipeId); 
        if (index === -1) {
            user.likes.push(recipeId); 
        } else {
            user.likes.splice(index, 1); 
        }

        await user.save(); 
        res.json({ message: "Likes updated", likes: user.likes });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
