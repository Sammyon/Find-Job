const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

let authc = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    const payload = verifyToken(access_token);

    const user = await User.findByPk(payload.userId);
    // console.log(payload, user, `AUTHC DATA`);
    if (!user) {
      throw {
        name: `authenticationNoUser`,
      };
    }

    req.user = {
      UserId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authc;
