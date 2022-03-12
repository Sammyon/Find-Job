const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authc");
const jobs = require("./jobs");
const admins = require("./admins");
const Controller = require("../controllers");

router.use("/admins", admins);

router.use(authentication);
router.get("/companies", Controller.getCompanies);
router.use("/jobs", jobs);

module.exports = router;