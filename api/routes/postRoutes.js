const express = require("express");

const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const router = express.Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", authMiddleware, roleMiddleware("AUTHOR"), createPost);
router.put("/:id", authMiddleware, roleMiddleware("AUTHOR"), updatePost);
router.delete("/:id", authMiddleware, roleMiddleware("AUTHOR"), deletePost);

module.exports = router;
