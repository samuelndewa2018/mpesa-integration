const express = require("express");
const app = express();
const ErrorHandler = require("./error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const fileUpload = require("express-fileupload");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(fileUpload());



// Route imports
const mpesaRoutes = require("./mpesa");

app.use("/api/v1", mpesaRoutes);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// it's for errorHandeling
app.use(ErrorHandler);

module.exports = app;
