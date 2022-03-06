"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Job.belongsTo(models.User, { foreignKey: "authorId" });
      Job.belongsTo(models.Company, { foreignKey: "companyId" });
    }
  }
  Job.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Title cannot be empty" },
          notEmpty: { msg: "Title cannot be empty" },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "Description cannot be empty" },
          notEmpty: { msg: "Description cannot be empty" },
        },
      },
      imgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Image URL cannot be empty" },
          notEmpty: { msg: "Image URL cannot be empty" },
        },
      },
      companyId: DataTypes.INTEGER,
      authorId: DataTypes.INTEGER,
      jobType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Job Type cannot be empty" },
          notEmpty: { msg: "Job Type cannot be empty" },
        },
      },
    },
    {
      sequelize,
      modelName: "Job",
    }
  );
  return Job;
};
