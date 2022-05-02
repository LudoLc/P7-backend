const { Model, DataTypes } = require('@sequelize/core');
const sequelize = require('../src/db');

class Comments extends Model {
}
Comments.init({
  id: {  
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.STRING
  },
  userId: {
    type: DataTypes.INTEGER
  },
  postId: {
    type: DataTypes.INTEGER
  },
  media: {
    type: DataTypes.STRING
  }
}, {
  sequelize,
  createdAt: true,
  updatedAt: true,
})
Comments.sync();

module.exports = Comments; // appel du module .

