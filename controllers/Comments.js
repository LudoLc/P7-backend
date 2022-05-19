const { Comment, User, Post } = require("../models");
const { commentSchema } = require("../schemas/comment");
const { yupErrorToJson } = require("../src/helpers");
const fs = require("fs/promises");
const { ValidationError } = require("yup");

class CommentsController {
  constructor() {
    // on force le this a avoir la valeur du post controller .
    this.getAllComments = this.getAllComments.bind(this);
    this.createComment = this.createComment.bind(this);
    this.getComment = this.getComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  getCommentID(id = null) {
    if (id === null) return Comment.findAll({ include: [User, Post] });
    return Comment.findOne({
      where: {
        id: id,
      },
      include: [User, Post],
    });
  }

  // implémentation de la classe Postcontroller + récuperation du Model
  async getAllComments(req, res) {
    try {
      const comments = await this.getCommentID();
      res.status(200).send(JSON.stringify(comments, null, 2));
    } catch (error) {
      res.status(401).send(error);
    }
  }
  async createComment(req, res) {
    try {
      await commentSchema.validate(req.body, {
        abortEarly: false,
        strict: false,
      });

      const comment = await Comment.create(
        Object.assign(req.body, { UserId: req.state.get("TOKEN").id })
      );
      res.status(200).send({
        message: "Commentaire crée",
        ...comment.get(),
      });
    } catch (error) {
      if (error instanceof ValidationError)
        return res.status(400).send({
          // renvoie un status 400 en cas de non remplissage de conditions
          errors: yupErrorToJson(error),
        });

      res.status(500).send({ error: "Internal server error" });
    }
  }

  async getComment(req, res) {
    try {
      const comment = await this.getCommentID(req.params.id);

      if (comment === null)
        return res.status(404).send({ error: "Unauthorized" });
      res.status(200).send(post.get());
    } catch (error) {
      res.status(500).send({ error: "Unternal server error" });
    }
  }
  async updateComment(req, res) {
    try {
      const comment = await this.getCommentID(req.params.id);
      if (comment === null) return res.status(404).send({ error: "Not found" });
      if(comment.UserId !== req.state.get("TOKEN").id && !req.state.get("TOKEN").Role.admin)
        return res.status(401).send({error: "Vous n'avez pas les droits pour faire ceci!"})
      // on verifie si le poste est dans le PostModel
      comment.update(req.body);
      res.status(200).send(comment.get());
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  }
  async deleteComment(req, res) {
    try {
      const comment = await this.getCommentID(req.params.id);
      if (comment === null)
        return res.status(404).send({ error: "Commentaire introuvable!" });
        if(comment.UserId !== req.state.get("TOKEN").id && !req.state.get("TOKEN").Role.admin)
        return res.status(401).send({error: "Vous n'avez pas les droits pour faire ceci!"})
      // grace a multer on va supprimer l'image source dans le images/filename
      // if(post.media){
      //   const filename = post.media.split("/images/")[1];
      //   await fs.unlink(`images/${filename}`);
      // }
      await comment.destroy();
      res
        .status(200)
        .json({ message: "Commentaire supprimé!" })
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

module.exports = new CommentsController();
