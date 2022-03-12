function errorHandler(err, req, res, next) {
  console.log(err.name, err, "ERROR HANDLER");

  let errors = [];
  switch (err.name) {
    case "SequelizeValidationError":
      err.errors.forEach((e) => {
        errors.push(e.message);
      });
      res.status(400).json({ Error: errors });
      errors = [];
      break;
    case "SequelizeUniqueConstraintError":
      err.errors.forEach((e) => {
        errors.push(e.message);
      });
      res.status(400).json({ Error: errors });
      errors = [];
      break;
    case "JsonWebTokenError":
      res.status(401).json({ Error: "Invalid token" });
      break;
    case "TokenExpiredError":
      res.status(401).json({ Error: "Token expired" });
      break;
    case "authenticationNoUser":
      res.status(401).json({ Error: "Invalid token or user" });
      break;
    case "authorizationFailed":
      res.status(403).json({ Error: "Forbidden to modify item" });
      break;
    case "authzPatchFailed":
      res.status(403).json({ Error: "Forbidden to modify item" });
      break;
    case "adminLoginNoInput":
      res.status(401).json({ Error: "Email and Password is required" });
      break;
    case "adminLoginFailed":
      res.status(401).json({ Error: "Wrong email or password" });
      break;
    case "generalJobNotFound":
      res.status(404).json({ Error: "Error job not found" });
      break;
    case "getJobDetailJobNotFound":
      res.status(404).json({ Error: "Error job not found" });
      break;
    case "getJobDetailArchived":
      res.status(404).json({ Error: "Error job not found" });
      break;
    case "editJobNotFound":
      res.status(404).json({ Error: "Error job not found" });
      break;
    case "editJobArchived":
      res.status(404).json({ Error: "Error job not found" });
      break;
    case "deleteJobNotFound":
      res.status(404).json({ Error: "Error job not found" });
      break;
    case "updateJobStatusNotFound":
      res.status(404).json({ Error: "Error job not found" });
      break;
    case "googleRegUserNotFound":
      res.status(401).json({ Error: "User not found" });
      break;
    case "userDataNotFound":
      res.status(401).json({ Error: "User not found" });
      break;
    default:
      res.status(500).json({ Error: "Internal server error" });
      break;
  }
}

module.exports = errorHandler;
