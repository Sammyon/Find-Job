if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

const express = require("express");
const errorHandler = require("./helpers/errorHandler");
const app = express();
const port = 3000;
const cors = require('cors')
const routes = require('./routes')

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes)

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
