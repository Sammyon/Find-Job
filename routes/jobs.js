const express = require("express");
const router = express.Router();
const Controller = require("../controllers");
const authorization = require("../middlewares/authzEditDelete");
const histories = require("./histories");

router.get("/", Controller.getJobs);
router.post("/", Controller.addJob);

router.use("/histories", histories)

router.get("/:jobId", Controller.getJobDetail);
router.put("/:jobId", authorization, Controller.editJob);
router.delete("/:jobId", authorization, Controller.deleteJob);



module.exports = router;