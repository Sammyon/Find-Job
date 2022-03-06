const { Job } = require("../models");

const authorization = async (req, res, next) => {
  try {
    const { UserId, role } = req.user;
    const { jobId } = req.params;

    if (role !== "admin") {
      const user = await Job.findOne({
        where: {
          id: jobId,
          authorId: UserId,
        },
      });

      if (!user) {
        throw {
          name: `authorizationFailed`,
        };
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authorization;
