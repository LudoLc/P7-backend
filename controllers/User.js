const { User, Role, Post, Reaction, Comment } = require("../models");
const { ValidationError } = require("yup");
const { yupErrorToJson } = require("../src/helpers");
const { signupSchema } = require("../schemas/auth");
const fs = require("fs");
const bcrypt = require("bcrypt");

class UserController {
  constructor() {
    // on force le this a avoir la valeur du post controller .
    this.getAllUsers = this.getAllUsers.bind(this);
    this.createUser = this.createUser.bind(this);
    this.getUser = this.getUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.updateAvatar = this.updateAvatar.bind(this);
  }

  getUserID(id = null) {
    if (id === null)
      return User.findAll({ include: [Role, Post, Reaction, Comment] });
    return User.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: ["password"],
      },
      include: [Role, Post, Reaction, Comment],
    });
  }

  // implémentation de la classe usercontroller + récuperation du Model
  async getAllUsers(req, res) {
    try {
      const users = await this.getUserID();
      res.status(200).send(users.map((user) => user.get()));
    } catch (error) {
      res.status(401).send(error);
    }
  }
  async createUser(req, res) {
    try {
      // on apelle le schema pour les users
      await signupSchema.validate(req.body, {
        abortEarly: false,
        strict: false,
      }); // on fait le validate et on req le body

      // Object.assign on deplace la requete dans le roleId (si = 1 = admin sinon  = non admin)
      const user = await User.create(
        Object.assign(req.body, {
          RoleId: 1,
          password: bcrypt.hashSync(req.body.password, 10),
        })
      ); // a partir du User , si les infos sont bonnes alors on retourne une 200 : user crée
      res.status(200).send({
        message: "user crée",
        ...user.get(), // on recuperer le contenu dans la BDD
      });
    } catch (error) {
      if (error instanceof ValidationError)
        return res.status(400).send({
          // renvoie un status 400 en cas de non remplissage de conditions
          errors: yupErrorToJson(errors),
        });
      res.status(500).send({ error: "Internal server error" });
    }
  }
  async getUser(req, res) {
    try {
      const user = await this.getUserID(req.params.id);
      // le .get() va permettre de récuperer le contenu du user (qui se trouve dans la BDD)
      if (user === null) return res.status(404).send({ error: "Unauthorized" });
      res.status(200).send(user.get());
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  }
  async updateUser(req, res) {
    try {
      const user = await this.getUserID(req.params.id);
      if (!user) return res.status(404).send({ error: "Not found" });
      const userToModify = req.body;
      if (req.file) {
        userToModify.avatar = `${req.protocol}://${req.get(
          "host"
        )}/public/images/${req.file.filename}`;
      }
      if (req.body.password) {
        userToModify.password = bcrypt.hashSync(userToModify.password, 10);
      }
      user.update(userToModify);
      res.status(200).send(user.get());
      // on verifie si le user est dans le User
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  }
  async updateAvatar(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .send({ message: "Veuillez choisir une image! " });
      }
      const user = await this.getUserID(req.params.id);
      if (
        user.avatar !== "http://localhost:3000/public/images/profile_white.png"
      ) {
        const filename = user.avatar.split("/images/")[1];
        fs.unlink(`public/images/${filename}`, () => {});
      }
      await user.update({
        avatar: `${req.protocol}://${req.get("host")}/public/images/${
          req.file.filename
        }`,
      });
      res.status(200).send({ message: "Avatar modifié!", user: user.get() });
    } catch (error) {
      res.status(500).send({ error: "Internal server error" + error });
    }
  }
  async deleteUser(req, res) {
    try {
      const user = await this.getUserID(req.params.id);
      if (user === null) return res.status(401).json({ error });
      await user.destroy();
      res.status(200).json({ message: "user supprimé!" });
    } catch (error) {
      // res.status(404).send({ error: "user introuvable!" });
      res.status(500).json({ error });
    }
  }
}

module.exports = new UserController();
