const { Model, DataTypes } = require("@sequelize/core");
const sequelize = require("../src/db");

class User extends Model {}
User.init(
  {
    email: {
      type: DataTypes.STRING,
      unique: "email",
    },
    password: {
      type: DataTypes.STRING,
    },
    question: {
      type: DataTypes.STRING,
    },
    response: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
    firstname: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING
    }
  },
  {
    sequelize,
    createdAt: true,
    updatedAt: true,
  }
);

module.exports = User; // appel du module .
