const { Model, DataTypes } = require("@sequelize/core");
const sequelize = require("../src/db");
const bcrypt = require("bcrypt");

class User extends Model {}
User.init(
  {
    id: {
      //  integer = nombre et primarykey = unicité de l'ID .
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING,
      unique: "email",
    },
    password: {
      type: DataTypes.STRING,
      set(value) {
        const hashedPassword = bcrypt.hashSync(value, 10);
        this.setDataValue("password", hashedPassword);
      },
    },
    question: {
      type: DataTypes.STRING,
    },
    response: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
      unique: "username",
    },
    firstname: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    createdAt: true,
    updatedAt: true,
  }
);
User.sync();

module.exports = User; // appel du module .
