const express = require("express");

const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  publishPost,
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const optionalAuthMiddleware = require("../middleware/optionalAuthMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const router = express.Router();

router.get("/", optionalAuthMiddleware, getAllPosts);
router.get("/:id", getPostById);
router.patch(
  "/:id/publish",
  authMiddleware,
  roleMiddleware("AUTHOR"),
  publishPost,
);
router.post("/", authMiddleware, roleMiddleware("AUTHOR"), createPost);
router.put("/:id", authMiddleware, roleMiddleware("AUTHOR"), updatePost);
router.delete("/:id", authMiddleware, roleMiddleware("AUTHOR"), deletePost);

module.exports = router;
