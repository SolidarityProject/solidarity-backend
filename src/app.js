const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv/config");

const authRouter = require("./routes/auth-router");
const userRouter = require("./routes/user-router");
const postRouter = require("./routes/post-router");
const starredPostRouter = require("./routes/starred-router");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// routers middleware
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/starred-posts", starredPostRouter);

app.get("/", (req, res) => {
  res.status(200).send("----  Solidarity Backend  ----");
});

app.use("", (req, res) => {
  res.status(404).send("Opps! 404 Not Found.");
});

mongoose.connect(
  process.env.DB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Connected to DB.");
    }
  }
);

app.listen(process.env.PORT || 2020, () => {
  console.log("App Started.");
});

module.exports = app;
