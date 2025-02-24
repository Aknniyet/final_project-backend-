const express = require("express");
const userController = require("../controllers/userController"); 
const authMiddleware = require("../middleware/authMiddleware").authMiddleware;

const router = express.Router();

router.post("/favorites", authMiddleware, userController.toggleFavorite);
router.get("/favorites", authMiddleware, userController.getFavorites);
router.post("/likes", authMiddleware, userController.toggleLike);

module.exports = router; 
