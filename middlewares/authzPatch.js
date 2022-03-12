let authzPatch = async (req, res, next) => {
  try {
    const { role } = req.user;
    if (role === "admin") {
      next();
    } else {
      throw { name: "authzPatchFailed" };
    }
  } catch (error) {
    next(error);
  }
};

module.exports = authzPatch;
