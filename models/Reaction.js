const { Model, DataTypes } = require("@sequelize/core");
const sequelize = require("../src/db");

class Reaction extends Model {}
Reaction.init(
  {
    type: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
  }
);

module.exports = Reaction; // appel du module .
