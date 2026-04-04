module.exports = (role) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ message: "unauthorized" });
  }

  if (role !== req.user.role) {
    return res.status(403).send({ message: "forbidden" });
  }

  next();
};
