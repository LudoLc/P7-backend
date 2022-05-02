const UserModel = require("../models/User");
const { yupErrorToJson } = require("../src/helpers");
const fs = require("fs");
const { signupSchema } = require("../schemas/auth");

class UserController {
  // implémentation de la classe usercontroller + récuperation du Model
  getAllUsers(req, res) {
    UserModel.findAll()
      .then((users) => res.status(200).send(users.map((user) => user.get())))
      .catch((error) => res.status(401).send(error));
  }
  async createUser(req, res) {
    signupSchema // on apelle le schema pour les users
      .validate(req.body, { abortEarly: false, strict: true }) // on fait le validate et on req le body
      .then(() => {
        // Object.assign on deplace la requete dans le roleId (si = 1 = admin sinon  = non admin)
        UserModel.create(Object.assign({ roleId: 1 }, req.body)) // a partir du userModel , si les infos sont bonnes alors on retourne une 200 : user crée
          .then((user) => {
            res.status(200).send({
              message: "user crée",
              ...user.get(), // on recuperer le contenu dans la BDD
            });
          })
          .catch(
            (
              error // si il y'a une erreur , on renvoie une 500
            ) => res.status(500).send({ error: "Internal server error" })
          );
      })
      .catch((errors) => {
        res.status(400).send({
          // renvoie un status 400 en cas de non remplissage de conditions
          errors: yupErrorToJson(errors),
        });
      });
  }
  getUser(req, res) {
    UserModel.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((user) => {
        // let .get() va permettre de récuperer le contenu du usere (qui se trouve dans la BDD)
        if (user instanceof UserModel) return res.status(200).send(user.get());
        res.status(404).send({ error: "Unauthorized" });
      })
      .catch((error) =>
        res.status(500).send({ error: "Internal server error" })
      );
  }
  updateUser(req, res) {
    UserModel.findOne({
      // on recupere l'id du user a modifier
      where: {
        id: req.params.id, // récupération dans le req.params.id
      },
    }).then((user) => {
      if (user instanceof UserModel) {
        // on verifie si le usere est dans le userModel
        const userToModify = req.body;
        user.update(userToModify);
        return res.status(200).send(user.get());
      }
      res.status(404).send({ error: "Not found" });
    });
  }
  deleteUser(req, res) {
    UserModel.findOne({
      // on utilise le findOne pour recuperer un element
      where: {
        id: req.params.id, // recuperation de l'iD dans le req.params
      },
    })
      .then((user) => {
        if (user instanceof UserModel) {
          // grace a multer on va supprimer l'image source dans le images/filename
          //const filename = user.media.split("/images/")[1];
          //return fs.unlink(`images/${filename}`, () => {
          return user
            .destroy()
            .then(() => res.status(200).json({ message: "user supprimé!" }))
            .catch((error) => res.status(401).json({ error }));
          //});
        }
        res.status(404).send({ error: "user introuvable!" });
      })
      .catch((error) => res.status(500).json({ error }));
  }
}

module.exports = new UserController();
