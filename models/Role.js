const { Model, DataTypes } = require("@sequelize/core");
const sequelize = require("../src/db");

class Role extends Model {}
Role.init(
  {
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

module.exports = Role; // appel du module .
