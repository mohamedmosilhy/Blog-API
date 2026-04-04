var jwt = require("jsonwebtoken");
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
        { expiresIn: "1d" },
      );

      res.send({ token });
    } catch (error) {
      res.status(500).send({ message: "Something went wrong" });
    }
  },
  register: async (req, res) => {},
};
