const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const pubSubSubscriber = require("./pubSubSubscriber");

const app = express();

// require("dotenv").config();

// import helmet from "helmet";
const helmet = require("helmet");
const bodyParser = require("body-parser");

// Middleware
const corsOptions = {
  exposedHeaders: "X-Auth-Token",
};

app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

// Api routes below
app.get("/", (_, res) => {
  res.send("Um. You weren't suppose to find this");
});

app.use("/pubsubhubbub", pubSubSubscriber.listener());

module.exports = app;
