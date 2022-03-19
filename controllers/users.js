const { compare } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User, Job, Bookmark, Company } = require("../models");
const { Op } = require("sequelize");
const { OAuth2Client } = require("google-auth-library");
const clientID = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class ControllerUsers {
  static async register(req, res, next) {
    try {
      const { email, password, phoneNumber, address } = req.body;
      let newUser = await User.create({
        email,
        password,
        role: "user",
        phoneNumber,
        address,
      });
      res.status(201).json({email: newUser.email});
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
          role: "user",
        },
      });

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

  static async addBookmark(req, res, next) {
    try {
      const { UserId } = req.user;
      const { JobId } = req.body;

      const job = await Job.findByPk(JobId);

      if (!job) throw { name: "generalJobNotFound" };

      const [bookmark, isCreated] = await Bookmark.findOrCreate({
        where: {
          UserId,
          JobId,
        },
        defaults: {
          UserId,
          JobId,
        },
      });
      res.status(201).json(bookmark);
    } catch (error) {
      next(error);
    }
  }

  static async deleteBookmark(req, res, next) {
    try {
      const { bookmarkId } = req.params;

      await Bookmark.destroy({
        where: {
          id: bookmarkId,
        },
      });
      res.status(201).json({ message: `Removed from Watch List` });
    } catch (error) {
      next(error);
    }
  }

  static async getBookmark(req, res, next) {
    try {
      const { role, UserId } = req.user;

      const bookmarks = await Bookmark.findAll({
        include: {
          model: Job,
          include: {
            model: Company,
          },
        },
        where: {
          UserId,
        },
      });

      res.status(200).json(bookmarks);
    } catch (error) {
      next(error);
    }
  }

  static async getJobs(req, res, next) {
    try {
      const { jobType, company, page } = req.query;
      // console.log(jobType, company, page, `page`);
      const search = {
        include: {
          model: Company,
        },
        where: {
          status: {
            [Op.not]: "archived",
          },
        },
        limit: 8,
        order: [["id", "ASC"]],
      };
      if (jobType) {
        search.where.jobType = jobType;
      }
      if (company) {
        search.where.companyId = company;
      }
      if (page) {
        search.offset = 8 * (page - 1);
      }
      // console.log(search , `search`);
      let jobs = await Job.findAndCountAll(search);
      let pages = Math.ceil(jobs.count / 8);
      // console.log(jobs);
      // console.log(pages, jobs.count);
      res.status(200).json({ count: pages, jobs: jobs.rows });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ControllerUsers;
