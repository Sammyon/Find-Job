"use strict";
const { Model } = require("sequelize");
const { hash } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Job, { foreignKey: "authorId" });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        unique: { msg: "Email must be unique" },
        allowNull: false,
        validate: {
          notNull: { msg: "Email cannot be empty" },
          notEmpty: { msg: "Email cannot be empty" },
          isEmail: { msg: "Email must be email format" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Password cannot be empty" },
          notEmpty: { msg: "Password cannot be empty" },
          len: {
            args: [5],
            msg: "Password length minimum 5 letters",
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "admin",
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
    },
    {
      hooks: {
        beforeCreate: (user) => {
          user.password = hash(user.password);
        },
        beforeBulkUpdate: (user) => {
          user.attributes.password = hash(user.attributes.password, 10)
        }
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
