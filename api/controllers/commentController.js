const prisma = require("../lib/prisma");

module.exports = {
  getAllComments: async (req, res) => {
    try {
      const comments = await prisma.comment.findMany();
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
      });

      res.send(comment);
    } catch (error) {
      res.status(500).send({ message: "Something went wrong" });
    }
  },

  updateComment: async (req, res) => {
    try {
      const { content } = req.body;
      if (!content) {
        return res.status(400).send({ message: "Missing fields" });
      }

      let comment = await prisma.comment.findUnique({
        where: { id: parseInt(req.params.id) },
      });

      if (!comment) {
        return res.status(404).send({ message: "comment not found" });
      }

      comment = await prisma.comment.update({
        data: { content: content, editedAt: new Date() },
        where: { id: parseInt(req.params.id) },
      });
      res.send(comment);
    } catch (error) {
      res.status(500).send({ message: "Something went wrong" });
    }
  },

  deleteComment: async (req, res) => {
    try {
      await prisma.comment.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });

      res.send({ message: "Comment deleted" });
    } catch (error) {
      res.status(500).send({ message: "Something went wrong" });
    }
  },
};
