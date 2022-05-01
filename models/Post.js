const { Model, DataTypes } = require('@sequelize/core');
const sequelize = require('../src/db');

class Post extends Model {
}
Post.init({
  id: {  //  integer = nombre et primarykey = unicité de l'ID .
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
  },
  title: {
    type: DataTypes.STRING
  },
  content: {
    type: DataTypes.STRING
  },
  media: {
    type: DataTypes.STRING
  }
}, {
  sequelize,
  createdAt: true,
  updatedAt: true,
})
Post.sync();

module.exports = Post; // appel du module .