const express = require("express");
require("dotenv").config();

const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");

const app = express();
app.use(express.json());

app.use("/posts", postRouter);
app.use("/comments", commentRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT);
