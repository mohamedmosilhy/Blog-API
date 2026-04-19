const express = require("express");
require("dotenv").config();

const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");
const loginRouter = require("./routes/authRoutes");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5174";

  if (!origin || origin === allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", origin || allowedOrigin);
    res.setHeader("Vary", "Origin");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use("/auth", loginRouter);

const PORT = process.env.PORT;

app.listen(PORT);
