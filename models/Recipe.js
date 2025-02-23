const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    instructions: { type: String, required: true },
    image: { type: String },
    category: { type: String, required: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Лайки
}, { timestamps: true });

RecipeSchema.index({ title: "text", category: 1 });

module.exports = mongoose.model("Recipe", RecipeSchema);
