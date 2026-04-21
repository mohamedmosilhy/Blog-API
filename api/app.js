const express = require("express");
require("dotenv").config();

const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");
const loginRouter = require("./routes/authRoutes");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    ...(process.env.CLIENT_ORIGIN ? [process.env.CLIENT_ORIGIN] : []),
    ...(process.env.CLIENT_ORIGINS
      ? process.env.CLIENT_ORIGINS.split(",").map((value) => value.trim())
      : []),
  ].filter(Boolean);

  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || allowedOrigins[0]);
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
