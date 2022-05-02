const CommentModel = require("../models/Comments");
const { commentSchema } = require("../schemas/comment");
const { yupErrorToJson } = require("../src/helpers");
const fs = require("fs");

class CommentsController {
  // implémentation de la classe Postcontroller + récuperation du Model
  getAllComments(req, res) {
    CommentModel.findAll()
    .then((comments) => res.status(200).send(comments.map((comment) => comment.get())))
    .catch((error) => res.status(401).send(error));
  }
  async createComment (req, res){
    commentSchema
    .validate(req.body, { abortEarly: false, strict: true })
    .then(() => {
      CommentModel.create(req.body)
      .then((comment) => {
        res.status(200).send({
          message: "Commentaire crée",
          ...comment.get(),
        });
      })
      .catch(
        (
          error
        ) => res.status(500).send({error: "Internal server error"})
      );
    })
    .catch((errors) => {
      res.status(400).send({
        errors: yupErrorToJson(errors)
      });
    });
  }

  getComment(req, res) {
    CommentModel.findOne({
      where: {
        id: req.params.id,
      },
    })
    .then((comment) => {
      if(comment instanceof CommentModel) return res.status(200).send(post.get());
      res.status(404).send({error: "Unauthorized"});
    })
    .catch(() => 
    res.status(500).send({error: "Unternal server error"})
    );
  }
  updateComment(req, res) {
    CommentModel.findOne({
      where: {
        id: req.params.id,
      },
    })
    .then((comment) => {
      if (comment instanceof CommentModel) {
        // on verifie si le poste est dans le PostModel
        const commentToModify = req.body;
        comment.update(commentToModify);
        return res.status(200).send(comment.get());
      }
      res.status(404).send({ error: "Not found" });
    });
  }
  deleteComment(req, res) {
    CommentModel.findOne({
      // on utilise le findOne pour recuperer un element
      where: {
        id: req.params.id, // recuperation de l'iD dans le req.params
      },
    })
      .then((comment) => {
        if (comment instanceof CommentModel) {
          // grace a multer on va supprimer l'image source dans le images/filename
          const filename = comment.media.split("/images/")[1];
          return fs.unlink(`images/${filename}`, () => {
            comment
              .destroy()
              .then(() => res.status(200).json({ message: "Commentaire supprimé!" }))
              .catch((error) => res.status(401).json({ error }));
          });
        }
        res.status(404).send({ error: "Commentaire introuvable!" });
      })
      .catch((error) => res.status(500).json({ error }));
  }
  }

module.exports = new CommentsController();