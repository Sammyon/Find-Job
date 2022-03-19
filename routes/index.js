const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authc");
const jobs = require("./jobs");
const admins = require("./admins");
const users = require("./users");
const Controller = require("../controllers");

router.use("/admins", admins);
router.use("/users", users);
router.get("/companies", Controller.getCompanies);

router.use(authentication);
router.use("/jobs", jobs);

module.exports = router;