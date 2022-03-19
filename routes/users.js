const express = require("express");
const router = express.Router();
const ControllerUsers = require("../controllers/users");
const ControllerAdmins = require("../controllers/admins");
const Controller = require("../controllers");
const custAuthz = require("../middlewares/custAuthz");
const authentication = require("../middlewares/authc");

router.post("/register", ControllerUsers.register);
router.post("/login", ControllerAdmins.login);
router.post("/google", ControllerUsers.loginGoogle);
router.post("/google/register", ControllerAdmins.googleReg);

router.get("/jobs", ControllerUsers.getJobs);
router.get("/jobs/:jobId", Controller.getJobDetail);
//!AUTH & AUTZ
router.use(authentication);

router.get("/bookmarks", ControllerUsers.getBookmark);
router.post("/bookmarks", ControllerUsers.addBookmark);
router.delete(
  "/bookmarks/:bookmarkId",
  custAuthz,
  ControllerUsers.deleteBookmark
);

module.exports = router;
