const Comment = require("./Comment");
const Post = require("./Post");
const Role = require("./Role");
const User = require("./User");
const Reaction = require("./Reaction");
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

User.hasMany(Reaction);
Reaction.belongsTo(User);

Post.hasMany(Reaction);
Reaction.belongsTo(Post);

sequelize.sync().then(() => console.log("syncrhonisation effectuée"));
//.catch(()=> console.error("Une erreur est survenue lors de la synchronisation"))
// Role.create({
//   id: 1,
//   name:"Membre",
//   admin: false
// })
// Role.create({
//   id: 2,
//   name:"Admin",
//   admin: true
// })

module.exports = { Comment, Post, Role, User, Reaction };
