const express = require("express");
const { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe } = require("../controllers/recipeController");
const { toggleFavorite, toggleLike } = require("../controllers/userController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

router.post("/", authMiddleware, adminMiddleware, upload.single("image"), createRecipe);
router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), updateRecipe);
router.delete("/:id", authMiddleware, adminMiddleware, deleteRecipe);
router.post("/favorite", authMiddleware, toggleFavorite);
router.post("/like", authMiddleware, toggleLike);

module.exports = router;
