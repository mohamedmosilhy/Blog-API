const express = require("express");
const {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", getAllComments);
router.post("/", authMiddleware, createComment);
router.put("/:id", authMiddleware, updateComment);
router.delete("/:id", authMiddleware, deleteComment);

module.exports = router;
