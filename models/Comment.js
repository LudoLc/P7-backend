const { Model, DataTypes } = require('@sequelize/core');
const sequelize = require('../src/db');

class Comment extends Model {
}
Comment.init({
  content: {
    type: DataTypes.STRING
  },
}, {
  sequelize,
  createdAt: true,
  updatedAt: true,
})

module.exports = Comment; // appel du module .

