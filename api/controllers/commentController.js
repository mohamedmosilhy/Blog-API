const prisma = require("../lib/prisma");

module.exports = {
  getAllComments: async (req, res) => {
    try {
      const comments = await prisma.comment.findMany({
        include: {
          user: true,
        },
      });
      res.send(comments);
    } catch (error) {
      res.status(500).send({ message: "Something went wrong" });
    }
  },

  createComment: async (req, res) => {
    try {
      const { content, postId } = req.body;
      const userId = req.user.userId;
      if (!content || !postId || !userId) {
        return res.status(400).send({ message: "Missing fields" });
      }

      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const comment = await prisma.comment.create({
        data: {
          content,
          postId,
          userId,
        },
        include: {
          user: true,
        },
      });

      res.send(comment);
    } catch (error) {
      res.status(500).send({ message: "Something went wrong" });
    }
  },

  updateComment: async (req, res) => {
    try {
      const commentId = Number.parseInt(req.params.id, 10);
      const userId = Number.parseInt(req.user.userId, 10);
      const { content } = req.body;

      if (Number.isNaN(commentId)) {
        return res.status(400).send({ message: "Invalid comment id" });
      }

      if (Number.isNaN(userId)) {
        return res.status(400).send({ message: "Invalid user id" });
      }

      if (!content) {
        return res.status(400).send({ message: "Missing fields" });
      }

      let comment = await prisma.comment.findUnique({
        where: { id: commentId },
      });

      if (!comment) {
        return res.status(404).send({ message: "comment not found" });
      }

      if (comment.userId !== userId) {
        return res.status(403).send({ message: "forbidden" });
      }

      comment = await prisma.comment.update({
        data: { content: content, editedAt: new Date() },
        where: { id: commentId },
        include: {
          user: true,
        },
      });
      res.send(comment);
    } catch (error) {
      res.status(500).send({ message: "Something went wrong" });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const commentId = Number.parseInt(req.params.id, 10);
      const userId = Number.parseInt(req.user.userId, 10);

      if (Number.isNaN(commentId)) {
        return res.status(400).send({ message: "Invalid comment id" });
      }

      if (Number.isNaN(userId)) {
        return res.status(400).send({ message: "Invalid user id" });
      }

      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
      });

      if (!comment) {
        return res.status(404).send({ message: "comment not found" });
      }

      if (comment.userId !== userId) {
        return res.status(403).send({ message: "forbidden" });
      }

      await prisma.comment.delete({
        where: {
          id: commentId,
        },
      });

      res.send({ message: "Comment deleted" });
    } catch (error) {
      res.status(500).send({ message: "Something went wrong" });
    }
  },
};
