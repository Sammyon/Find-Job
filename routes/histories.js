const express = require("express");
const router = express.Router();
const Controller = require("../controllers");
const authorization = require("../middlewares/authzPatch");

router.get("/", Controller.getHistories);
router.patch("/:jobId", authorization, Controller.updateJobStatus);

module.exports = router;