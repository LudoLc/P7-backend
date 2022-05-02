const PostModel = require("../models/Post");
const { postSchema } = require("../schemas/post");
const { yupErrorToJson } = require("../src/helpers");
const fs = require("fs");

class PostController {
  // implémentation de la classe Postcontroller + récuperation du Model
  getAllPosts(req, res) {
    PostModel.findAll()
      .then((posts) => res.status(200).send(posts.map((post) => post.get())))
      .catch((error) => res.status(401).send(error));
  }
  async createPost(req, res) {
    postSchema // on apelle le schema pour les posts
      .validate(req.body, { abortEarly: false, strict: true }) // on fait le validate et on req le body
      .then(() => {
        PostModel.create(req.body) // a partir du PostModel , si les infos sont bonnes alors on retourne une 200 : post crée
          .then((post) => {
            res.status(200).send({
              message: "Post crée",
              ...post.get(), // on recuperer le contenu dans la BDD
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
  getPost(req, res) {
    PostModel.findOne({
      where: {
        id: req.query.id,
      },
    })
      .then((post) => {
        // let .get() va permettre de récuperer le contenu du poste (qui se trouve dans la BDD)
        if (post instanceof PostModel) return res.status(200).send(post.get());
        res.status(404).send({ error: "Unauthorized" });
      })
      .catch((error) =>
        res.status(500).send({ error: "Internal server error" })
      );
  }
  updatePost(req, res) {
    PostModel.findOne({
      // on recupere l'id du post a modifier
      where: {
        id: req.query.id, // récupération dans le req.query.id
      },
    })
    .then((post) => {
      if (post instanceof PostModel) {
        // on verifie si le poste est dans le PostModel
        const postToModify = req.body;
        post.update(postToModify);
        return res.status(200).send(post.get());
      }
      res.status(404).send({ error: "Not found" });
    });
  }
  deletePost(req, res) {
    PostModel.findOne({
      // on utilise le findOne pour recuperer un element
      where: {
        id: req.query.id, // recuperation de l'iD dans le req.query
      },
    })
      .then((post) => {
        if (post instanceof PostModel) {
          // grace a multer on va supprimer l'image source dans le images/filename
          const filename = post.media.split("/images/")[1];
          return fs.unlink(`images/${filename}`, () => {
            post
              .destroy()
              .then(() => res.status(200).json({ message: "Post supprimé!" }))
              .catch((error) => res.status(401).json({ error }));
          });
        }
        res.status(404).send({ error: "Post introuvable!" });
      })
      .catch((error) => res.status(500).json({ error }));
  }
}

module.exports = new PostController();
