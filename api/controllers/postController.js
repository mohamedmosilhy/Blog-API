const prisma = require("../lib/prisma");

module.exports = {
  getAllPosts: async (req, res) => {
    try {
      let posts;

      if (req.user?.role === "AUTHOR") {
        const authorId = Number.parseInt(req.user.userId, 10);

        if (Number.isNaN(authorId)) {
          return res.status(400).send({ message: "Invalid author id" });
        }

        posts = await prisma.post.findMany({
          where: { authorId },
          include: {
            author: true,
            comments: true,
          },
        });
      } else {
        posts = await prisma.post.findMany({
          where: { published: true },
          include: {
            author: true,
            comments: true,
          },
        });
      }
      res.send(posts);
    } catch (error) {
      res.status(500).send({ message: "Something Went Wrong" });
    }
  },
  getPostById: async (req, res) => {
    try {
      const postId = Number.parseInt(req.params.id, 10);
      if (Number.isNaN(postId)) {
        return res.status(400).send({ message: "Invalid post id" });
      }

      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
        include: {
          comments: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }

      res.send(post);
    } catch (error) {
      res.status(500).send({ message: "Something Went Wrong" });
    }
  },
  createPost: async (req, res) => {
    try {
      const { title, content, published } = req.body;
      const authorId = req.user.userId;
      if (!title || !content || published === undefined || !authorId) {
        return res.status(400).send({ message: "Missing fields" });
      }

      const parsedAuthorId = Number.parseInt(authorId, 10);
      if (Number.isNaN(parsedAuthorId)) {
        return res.status(400).send({ message: "Invalid author id" });
      }

      if (typeof published !== "boolean") {
        return res.status(400).send({ message: "published must be a boolean" });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: parsedAuthorId,
        },
      });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const post = await prisma.post.create({
        data: {
          title,
          content,
          published,
          authorId: parsedAuthorId,
        },
      });

      res.status(201).send(post);
    } catch (error) {
      res.status(500).send({ message: "Something Went Wrong" });
    }
  },
  updatePost: async (req, res) => {
    try {
      const postId = Number.parseInt(req.params.id, 10);
      const userId = Number.parseInt(req.user.userId, 10);

      if (Number.isNaN(postId)) {
        return res.status(400).send({ message: "Invalid post id" });
      }

      if (Number.isNaN(userId)) {
        return res.status(400).send({ message: "Invalid user id" });
      }

      const { title, content, published } = req.body;
      if (!title || !content || published === undefined) {
        return res.status(400).send({ message: "Missing fields" });
      }

      if (typeof published !== "boolean") {
        return res.status(400).send({ message: "published must be a boolean" });
      }

      let post = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }

      if (userId !== post.authorId) {
        return res.status(403).send({ message: "forbidden" });
      }

      post = await prisma.post.update({
        data: {
          content,
          title,
          published,
        },
        where: { id: postId },
        include: {
          author: true,
          comments: true,
        },
      });
      res.send(post);
    } catch (error) {
      res.status(500).send({ message: "Something Went Wrong" });
    }
  },
  deletePost: async (req, res) => {
    try {
      const postId = Number.parseInt(req.params.id, 10);
      const userId = Number.parseInt(req.user.userId, 10);

      if (Number.isNaN(postId)) {
        return res.status(400).send({ message: "Invalid post id" });
      }

      if (Number.isNaN(userId)) {
        return res.status(400).send({ message: "Invalid user id" });
      }

      const post = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }

      if (userId !== post.authorId) {
        return res.status(403).send({ message: "forbidden" });
      }

      await prisma.post.delete({
        where: { id: postId },
      });

      res.send({ message: "Post deleted" });
    } catch (error) {
      res.status(500).send({ message: "Something Went Wrong" });
    }
  },

  publishPost: async (req, res) => {
    try {
      const postId = Number.parseInt(req.params.id, 10);
      const userId = Number.parseInt(req.user.userId, 10);

      if (Number.isNaN(postId)) {
        return res.status(400).send({ message: "Invalid post id" });
      }

      if (Number.isNaN(userId)) {
        return res.status(400).send({ message: "Invalid user id" });
      }

      const post = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }

      if (userId !== post.authorId) {
        return res.status(403).send({ message: "forbidden" });
      }

      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          published: !post.published,
        },
      });

      res.send(updatedPost);
    } catch (error) {
      res.status(500).send({ message: "Something Went Wrong" });
    }
  },
};
