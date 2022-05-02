const { Model, DataTypes } = require("@sequelize/core");
const sequelize = require("../src/db");

class Role extends Model {}
Role.init(
  {
    id: {
      //  integer = nombre et primarykey = unicité de l'ID .
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    admin: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    createdAt: true,
    updatedAt: true,
  }
);
Role.sync();

module.exports = Role; // appel du module .
