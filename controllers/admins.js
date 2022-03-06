const { compare } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");
const { OAuth2Client } = require("google-auth-library");
const clientID = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class ControllerAdmins {
  static async register(req, res, next) {
    try {
      const { email, password, phoneNumber, address } = req.body;
      let user = await User.create({
        email,
        password,
        phoneNumber,
        address,
      });
      res.status(201).json({ id: user.id, email: user.email });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw {
          name: "adminLoginNoInput",
        };
      }

      let user = await User.findOne({
        where: {
          email: email,
        },
      });

      if (!user) {
        throw {
          name: "adminLoginFailed",
        };
      }

      const comparePassword = compare(password, user.password);

      if (!comparePassword) {
        throw {
          name: "adminLoginFailed",
        };
      }

      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const token = signToken(payload);

      res.status(200).json({ access_token: token });
    } catch (error) {
      next(error);
    }
  }

  static async loginGoogle(req, res, next) {
    try {
      const { googleToken } = req.body;
      const ticket = await clientID.verifyIdToken({
        idToken: googleToken,
        audience: process.env.CLIENT_ID,
      });

      const payload = ticket.getPayload();

      let [user, isCreated] = await User.findOrCreate({
        where: {
          email: payload.email,
        },
        defaults: {
          email: payload.email,
          password: payload.email,
          role: "staff",
        },
      });

      // console.log(user, `USER GOOGLE DATA`);

      if (!isCreated && user.address) {
        const payload = {
          userId: user.id,
          email: user.email,
          role: user.role,
        };

        const token = signToken(payload);

        res
          .status(201)
          .json({ email: user.email, isCreated, access_token: token });
      } else {
        res.status(201).json({ email: user.email, isCreated });
      }
    } catch (error) {
      next(error);
    }
  }

  static async googleReg(req, res, next) {
    try {
      const { email, password, phoneNumber, address } = req.body;

      let findUser = await User.findOne({
        where: {
          email,
        },
      });

      if (!findUser) {
        throw {
          name: "googleRegUserNotFound",
        };
      }

      let user = await User.update(
        {
          password,
          phoneNumber,
          address,
        },
        {
          where: {
            email,
          },
          individualHooks: true,
          returning: true,
        }
      );

      const payload = {
        userId: user[1][0].id,
        email: user[1][0].email,
        role: user[1][0].role,
      };
      const token = signToken(payload);

      res
        .status(201)
        .json({ access_token: token, message: `Account has been created!` });
    } catch (error) {
      next(error);
    }
  }

  static async userData(req, res, next) {
    try {
      const { UserId } = req.user;
      const user = await User.findOne({
        attributes: {
          exclude: [
            "password",
            "createdAt",
            "updatedAt",
            "phoneNumber",
            "address",
          ],
        },
        where: {
          id: UserId,
        },
      });
      if (!user) {
        throw {
          name: "userDataNotFound"
        };
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ControllerAdmins;
