if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

const express = require("express");
const errorHandler = require("./helpers/errorHandler");
const app = express();
const cors = require('cors')
const routes = require('./routes')

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes)

app.use(errorHandler);

module.exports = app