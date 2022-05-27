const { Model, DataTypes } = require("@sequelize/core");
const sequelize = require("../src/db");

class Post extends Model {}
Post.init(
  {
    title: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.STRING,
    },
    media: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    createdAt: true,
    updatedAt: true,
  }
);

module.exports = Post; // appel du module .
