const { User, Role } = require("../models");
const { ValidationError } = require("yup");
const { yupErrorToJson } = require("../src/helpers");
const { signupSchema } = require("../schemas/auth");

class UserController {
  constructor() {
    // on force le this a avoir la valeur du post controller .
    this.getAllUsers = this.getAllUsers.bind(this);
    this.createUser = this.createUser.bind(this);
    this.getUser = this.getUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  getUserID(id = null) {
    if (id === null) return User.findAll({ include: Role });
    return User.findOne({
      where: {
        id: id,
      },
      include: Role,
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
        strict: true,
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
      // let .get() va permettre de récuperer le contenu du usere (qui se trouve dans la BDD)
      if (user === null) return res.status(404).send({ error: "Unauthorized" });
      res.status(200).send(user.get());
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  }
  async updateUser(req, res) {
    try {
      const updateUser = await this.getUserID(req.params.id);
      if (user === null) return res.status(404).send({ error: "Not found" });
      const userToModify = req.body;
      user.update(userToModify);
      res.status(200).send(user.get());
      // on verifie si le usere est dans le User
    } catch (error) {}
  }
  async deleteUser(req, res) {
    try {
      const user = await this.getUserID(req.params.id);
      if (user === null) return res.status(401).json({ error });
      // grace a multer on va supprimer l'image source dans le images/filename
      //const filename = user.media.split("/images/")[1];
      //return fs.unlink(`images/${filename}`, () => {
      await user.destroy();
      res.status(200).json({ message: "user supprimé!" });
    } catch (error) {
      // res.status(404).send({ error: "user introuvable!" });
      res.status(500).json({ error });
    }
  }
}

module.exports = new UserController();
