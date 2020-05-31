const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRouter = require("./routes/auth-router");
const userRouter = require("./routes/user-router");
const postRouter = require("./routes/post-router");

const app = express();

app.use(bodyParser.json());

// routers middleware
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);


app.get("/", (req, res) => {
    res.send("Hi!");
})

app.use("", (req, res) => {
    res.send("Opps! 404 Not Found.");
})

mongoose.connect("mongodb://localhost/SolidarityDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, () => {
    console.log("Connected to DB.");
});

app.listen(process.env.PORT || 2020, () => {
    console.log("App Started.");
})