const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authc");
const ControllerAdmins = require("../controllers/admins");

router.post("/register", ControllerAdmins.register);
router.post("/login", ControllerAdmins.login);
router.post("/google", ControllerAdmins.loginGoogle);
router.post("/google/register", ControllerAdmins.googleReg);
router.get("/profile", authentication, ControllerAdmins.userData);

module.exports = router;