"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Company.hasMany(models.Job, { foreignKey: "companyId" });
    }
  }
  Company.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Name cannot be empty" },
          notEmpty: { msg: "Name cannot be empty" },
        },
      },
      companyLogo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Company Logo cannot be empty" },
          notEmpty: { msg: "Company Logo cannot be empty" },
        },
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Location cannot be empty" },
          notEmpty: { msg: "Location cannot be empty" },
        },
      },
      email: DataTypes.STRING,
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Description cannot be empty" },
          notEmpty: { msg: "Description cannot be empty" },
        },
      },
    },
    {
      sequelize,
      modelName: "Company",
    }
  );
  return Company;
};
