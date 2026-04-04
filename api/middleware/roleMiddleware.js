module.exports = (role) => (req, res, next) => {
  if (!req.user) {
    res.status(401).send({ message: "unauthorized" });
  }
  if (role !== req.user.role) {
    res.status(403).send({ message: "forbidden" });
  }
  next();
};
