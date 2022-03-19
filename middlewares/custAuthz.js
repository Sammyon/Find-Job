const { Bookmark } = require("../models");

const custAuthz = async (req, res, next) => {
  try {
    const { UserId, role } = req.user;
    const { bookmarkId } = req.params;

    if (role !== "user") {
      throw { name: "authorizationFailed" };
    }

    const auth = await Bookmark.findByPk(bookmarkId);
    if (!auth) {
      throw { name: "authorizationFailed" };
    }

    if (auth.UserId !== UserId) {
      throw { name: "authorizationFailed" }
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = custAuthz;
