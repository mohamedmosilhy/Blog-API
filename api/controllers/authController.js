var jwt = require("jsonwebtoken");
const crypto = require("crypto");
const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).send({ message: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).send({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || "dev_secret",
        { expiresIn: "1d", jwtid: crypto.randomUUID() },
      );

      res.send({ token, role: user.role, username: user.username });
    } catch (error) {
      res.status(500).send({ message: "Something went wrong" });
    }
  },
  register: async (req, res) => {
    try {
      const { email, password, username } = req.body;

      if (!email || !password || !username) {
        return res.status(400).send({ message: "Missing fields" });
      }

      if (await prisma.user.findUnique({ where: { email } })) {
        return res.status(401).send({ message: "That Email exists already" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          username: username,
          email: email,
          password: hashedPassword,
          role: "USER",
        },
      });

      res.send({ username, email });
    } catch (error) {
      res.status(500).send({ message: "Something went wrong" });
    }
  },
};
