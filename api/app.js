const express = require("express");
require("dotenv").config();

const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");
const loginRouter = require("./routes/authRoutes");

const app = express();
app.use(express.json());

app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use("/auth", loginRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT);
