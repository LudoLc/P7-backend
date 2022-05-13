const Comment = require("./Comment");
const Post = require("./Post");
const Role = require("./Role");
const User = require("./User");
const sequelize = require("../src/db");

/* Déclaration des relations entre les modèles */

User.hasMany(Post);
Post.belongsTo(User);

Role.hasMany(User);
User.belongsTo(Role);

User.hasMany(Comment);
Comment.belongsTo(User);

Post.hasMany(Comment);
Comment.belongsTo(Post);

sequelize
  .sync()
  .then(() => console.log("syncrhonisation effectuée"));
//.catch(()=> console.error("Une erreur est survenue lors de la synchronisation"))

module.exports = { Comment, Post, Role, User };
