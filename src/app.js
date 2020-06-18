const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv/config");

const authRouter = require("./routes/auth-router");
const userRouter = require("./routes/user-router");
const postRouter = require("./routes/post-router");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// routers middleware
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);


app.get("/", (req, res) => {
    res.status(200).send(" ----  Solidarity Backend  ---- ");
})

app.use("", (req, res) => {
    res.status(404).send("Opps! 404 Not Found.");
})


const localDBConnection = "mongodb://localhost/SolidarityDB";
// const cloudDBConnection = process.env.DB_CONNECTION;

mongoose.connect(localDBConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("Connected to DB.");
    } // TODO : change password & hide env file 
}
);

app.listen(process.env.PORT || 2020, () => {
    console.log("App Started.");
})