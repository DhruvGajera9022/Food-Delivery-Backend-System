const express = require("express");
require("dotenv").config();
const router = require("./routers/auth");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs");

app.use(express.static("assets"));
app.use(express.static("plugins"));

app.use("/", router);

app.listen(process.env.PORT, () => {
    console.log(`Server started at ${process.env.URL}${process.env.PORT}`);
});
