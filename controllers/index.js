const { Company, Job, History } = require("../models");
const { Op } = require("sequelize");

class Controller {
  static async addJob(req, res, next) {
    try {
      const { title, description, imgUrl, companyId, jobType } = req.body;
      const { UserId, email } = req.user;

      let newJob = await Job.create({
        title,
        description,
        imgUrl,
        companyId,
        authorId: UserId,
        jobType,
      });

      await History.create({
        entityId: newJob.id,
        name: newJob.title,
        description: `Job with id ${newJob.id} created`,
        updatedBy: email,
      });

      res.status(201).json(newJob);
    } catch (error) {
      next(error);
    }
  }

  static async getJobs(req, res, next) {
    try {
      const { UserId, role } = req.user;

      if (role === "staff") {
        let jobs = await Job.findAll({
          include: {
            model: Company,
          },
          where: {
            authorId: UserId,
          },
        });

        res.status(200).json(jobs);
      } else {
        let jobs = await Job.findAll({
          include: {
            model: Company,
          },
        });

        res.status(200).json(jobs);
      }
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
      } else if (job.status === "archived") {
        throw {
          name: `getJobDetailArchived`,
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
      const { email } = req.user;

      let findJob = await Job.findByPk(jobId);

      if (!findJob) {
        throw {
          name: `editJobNotFound`,
        };
      } else if (findJob.status === "archived") {
        throw {
          name: `editJobArchived`,
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

      await History.create({
        entityId: findJob[1][0].id,
        name: findJob[1][0].title,
        description: `Job with id ${findJob[1][0].id} edited`,
        updatedBy: email,
      });

      res.status(200).json(editjob[1][0]);
    } catch (error) {
      next(error);
    }
  }

  static async deleteJob(req, res, next) {
    try {
      const { jobId } = req.params;
      const { email } = req.user;

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

      await History.create({
        entityId: findJob.id,
        name: findJob.title,
        description: `Job with id ${findJob.id} permanently deleted`,
        updatedBy: email,
      });

      res
        .status(200)
        .json({ message: `Job ${findJob.title} success to delete` });
    } catch (error) {
      next(error);
    }
  }

  static async updateJobStatus(req, res, next) {
    try {
      const { jobId } = req.params;
      const { status } = req.body;
      const { email } = req.user;

      let jobBeforeUpdate = await Job.findOne({
        where: {
          id: jobId,
        },
        attributes: ["status"],
      });

      if (!jobBeforeUpdate) {
        throw { name: "updateJobStatusNotFound" };
      }

      let job = await Job.update(
        { status },
        {
          where: {
            id: jobId,
          },
          returning: true,
        }
      );

      await History.create({
        entityId: job[1][0].id,
        name: job[1][0].title,
        description: `Job with id ${job[1][0].id} status has been updated from ${jobBeforeUpdate.status} to ${job.status}`,
        updatedBy: email,
      });

      res.status(200).json(job[1][0]);
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

  static async getHistories(req, res, next) {
    try {
      let histories = await History.findAll();
      res.status(200).json(histories);
    } catch (error) {
      next(error);
    }
  }

  static async getArchivedJobs(req, res, next) {
    try {
      let jobs = await Job.findAll({
        where: {
          status: `archived`,
        },
      });

      res.status(200).json(jobs);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
