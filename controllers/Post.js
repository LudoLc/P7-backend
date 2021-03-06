const { Post, User, Comment, Reaction } = require("../models");
const { ValidationError } = require("yup");
const { postSchema } = require("../schemas/post");
const { yupErrorToJson } = require("../src/helpers");
const fs = require("fs/promises");

class PostController {
  constructor() {
    // on force le this a avoir la valeur du post controller .
    this.getAllPosts = this.getAllPosts.bind(this);
    this.createPost = this.createPost.bind(this);
    this.getPost = this.getPost.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    // le .bind permet d'associer le bon .this a l'element que l'on souhaite qui sera apres appelé dans la fonction.
  }

  getPostID(id = null) {
    if (id === null)
      return Post.findAll({
        include: [User, { model: Comment, include: [User] }, Reaction],
        order: [["id", "DESC"]],
      });
    return Post.findOne({
      where: {
        id: id,
      },
      order: [["id", "DESC"]],
      include: [User, Comment, Reaction],
    });
  }

  // implémentation de la classe Postcontroller + récuperation du Model
  async getAllPosts(req, res) {
    try {
      const posts = await this.getPostID();
      res.status(200).send(JSON.stringify(posts, null, 2));
    } catch (error) {
      res.status(401).send({ error });
    }
  }
  async createPost(req, res) {
    try {
      const decodedToken = req.state.get("TOKEN");
      // on apelle le schema pour les posts
      await postSchema.validate(req.body, { abortEarly: false, strict: false }); // on fait le validate et on req le body
      const post = Object.assign(req.body, { UserId: decodedToken.id });
      if (req.file) {
        post.media = `${req.protocol}://${req.get("host")}/public/images/${
          req.file.filename
        }`;
      }
      await Post.create(post); // a partir du Post , si les infos sont bonnes alors on retourne une 200 : post crée
      res.status(200).send({
        message: "Post crée",
        ...post, // on recuperer le contenu dans la BDD
      });
    } catch (error) {
      if (error instanceof ValidationError)
        return res.status(400).send({
          // renvoie un status 400 en cas de non remplissage de conditions
          errors: yupErrorToJson(error),
        });
      res.status(500).send({ error: `Internal server error ${error}` });
    }
  }
  async getPost(req, res) {
    try {
      const post = await this.getPostID(req.params.id);
      // let .get() va permettre de récuperer le contenu du poste (qui se trouve dans la BDD)
      if (post instanceof Post) return res.status(200).send(post.get());
      res.status(404).send({ error: "Unauthorized" });
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  }
  async updatePost(req, res) {
    try {
      const post = await this.getPostID(req.params.id);
      if (post === null) return res.status(404).send({ error: "Not found" });
      if (
        post.UserId !== req.state.get("TOKEN").id &&
        !req.state.get("TOKEN").Role.admin
      )
        return res
          .status(401)
          .send({ error: "Vous n'avez pas les droits pour faire ceci!" });
      // on verifie si le poste est dans le Post
      const postToModify = req.body;
      if (req.file) {
        postToModify.media = `${req.protocol}://${req.get(
          "host"
        )}/public/images/${req.file.filename}`;
      }
      post.update(postToModify);
      res.status(200).send(post.get());
    } catch (error) {
      res.status(500).send({ error: "Internal server error" + error });
    }
  }
  async deletePost(req, res) {
    try {
      const post = await this.getPostID(req.params.id);
      if (post === null)
        return res.status(404).send({ error: "Post introuvable!" });
      if (
        post.UserId !== req.state.get("TOKEN").id &&
        !req.state.get("TOKEN").Role.admin
      )
        return res
          .status(401)
          .send({ error: "Vous n'avez pas les droits pour faire ceci!" });
      // grace a multerPost on va supprimer l'image source dans le images/filename
      if (post.media) {
        const filename = post.media.split("/images/")[1];
        await fs.unlink(`public/images/${filename}`);
      }
      await post.destroy();
      res.status(200).json({ message: "Post supprimé!" });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

module.exports = new PostController();
