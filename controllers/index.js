const { Company, User, Job } = require("../models");

class Controller {
  static async addJob(req, res, next) {
    try {
      const { title, description, imgUrl, companyId, jobType } = req.body;
      const { UserId } = req.user;
      let newJob = await Job.create({
        title,
        description,
        imgUrl,
        companyId,
        authorId: UserId,
        jobType,
      });
      res.status(201).json(newJob);
    } catch (error) {
      next(error);
    }
  }

  static async getJobs(req, res, next) {
    try {
      let jobs = await Job.findAll({
        include: {
          model: Company,
        },
      });

      res.status(200).json(jobs);
    } catch (error) {
      next(error);
    }
  }

  static async getJobDetail(req, res, next) {
    try {
      const { jobId } = req.params;

      let job = await Job.findOne({
        include: {
          model: Company,
        },
        where: {
          id: jobId,
        },
      });

      if (!job) {
        throw {
          name: `getJobDetailJobNotFound`,
        };
      }

      res.status(200).json(job);
    } catch (error) {
      next(error);
    }
  }

  static async editJob(req, res, next) {
    try {
      const { jobId } = req.params;
      const { title, description, imgUrl, companyId, jobType } = req.body;

      let findJob = await Job.findByPk(jobId);

      if (!findJob) {
        throw {
          name: `editJobNotFound`,
        };
      }

      let editjob = await Job.update(
        { title, description, imgUrl, companyId, jobType },
        {
          include: {
            model: Company,
          },
          where: {
            id: jobId,
          },
          returning: true,
        }
      );

      res.status(200).json(editjob[1][0]);
    } catch (error) {
      next(error);
    }
  }

  static async deleteJob(req, res, next) {
    try {
      const { jobId } = req.params;

      let findJob = await Job.findByPk(jobId);

      if (!findJob) {
        throw {
          name: `deleteJobNotFound`,
        };
      }

      await Job.destroy({
        where: {
          id: jobId,
        },
      });

      res
        .status(200)
        .json({ message: `Job ${findJob.title} success to delete` });
    } catch (error) {
      next(error);
    }
  }

  static async getCompanies(req, res, next) {
    try {
      let companies = await Company.findAll();

      res.status(200).json(companies);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
