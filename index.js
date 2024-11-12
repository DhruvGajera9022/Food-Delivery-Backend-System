const express = require("express");
require("dotenv").config();

const session = require("express-session");
const FileStore = require("session-file-store")(session);
const cors = require("cors");

const authRoute = require("./routes/authRoute");
const dashboardRoute = require("./routes/dashboardRoute");
const profileRoute = require("./routes/profileRoute");
const userRoute = require("./routes/userRoute");
const roleRoute = require("./routes/roleRoute");
const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoute");
const discountRoute = require("./routes/discountRoute");
const invoiceRoute = require("./routes/invoiceRoute");
const invoiceDetailsRoute = require("./routes/invoiceDetailsRoute");
const settingsRoute = require("./routes/settingsRoute");
const paymentRoute = require("./routes/paymentRoute");

// Initialize app
const app = express();


// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());


// Setup view engine 
app.set("view engine", "ejs");


// static file declaration
app.use(express.static("assets"));
app.use(express.static("plugins"));


// store session in file
let fileStoreOptions = {};


// session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new FileStore(fileStoreOptions),
}));


// routes
app.use("/", authRoute);
app.use("/", dashboardRoute);
app.use("/", profileRoute);
app.use("/", userRoute);
app.use("/", roleRoute);
app.use("/", categoryRoute);
app.use("/", productRoute);
app.use("/", discountRoute);
app.use("/", invoiceRoute);
app.use("/", invoiceDetailsRoute);
app.use("/", settingsRoute);
app.use("/", paymentRoute);


// start server
app.listen(process.env.PORT, () => {
    console.log(`Server started at ${process.env.URL}${process.env.PORT}`);
});
