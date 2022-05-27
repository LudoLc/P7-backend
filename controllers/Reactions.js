const { User, Post } = require("../models");
const Reaction = require("../models/Reaction");
const { ValidationError } = require("yup");
const { yupErrorToJson } = require("../src/helpers");
const { reactionSchema } = require("../schemas/reaction");

class ReactionsController {
  constructor() {
    this.getAllReactions = this.getAllReactions.bind(this);
    this.createReaction = this.createReaction.bind(this);
    this.getReaction = this.getReaction.bind(this);
    this.updateReaction = this.updateReaction.bind(this);
    this.deleteReaction = this.deleteReaction.bind(this);
  }
  // on souhaite recueprer l'ID d'une reaction, pour cela , si l'id vaut undifinied = qui n'existe pas
  // alors on execute un findAll qui nous retourne les valeurs de l'Id pour un User et pour un Post
  getReactionId(id) {
    if (id === undefined) return Reaction.findAll({ include: [User, Post] });
    return Reaction.findOne({
      where: {
        id: id,
      },
      include: [User, Post],
    });
  }
  // utilisation d'une methode async await, permettant de recuperer toutes les reactions .
  async getAllReactions(req, res) {
    try {
      const reactions = await this.getReactionId();
      res.status(200).send(JSON.stringify(reactions));
      // si on a bien recuperé toutes les reactions alors on envoie une 200 = ok
    } catch (error) {
      res.status(401).send(error);
      // sinon si on ne recupere pas les reactions alors on envoie une 401
    }
  }

  async createReaction(req, res) {
    try {
      // on valide les conditons du schemas qu'on lui à défini
      await reactionSchema.validate(req.body, {
        abortEarly: false,
        strict: false,
      });

      const oldReaction = await Reaction.findOne({
        where: {
          PostId: req.body.PostId,
          UserId: req.state.get("TOKEN").id,
        },
      });

      const likeTypes = {
        LIKE: 1,
        DISLIKE: 0,
      };
      const newType = req.body.type;
      let shouldCreateReaction = true;
      let customMessage = null;
      let isWarning = false;

      if (oldReaction) {
        // si déjà liké ou disliké
        const oldType = oldReaction.type;
        oldReaction.destroy();
        shouldCreateReaction = false;

        if (oldType == likeTypes.DISLIKE && newType == likeTypes.DISLIKE) {
          customMessage = "vous avez déjà disliké ce post";
          isWarning = true;
        }

        if (oldType == likeTypes.LIKE && newType == likeTypes.LIKE) {
          customMessage = "vous avez déjà liké ce post";
          isWarning = true;
        }
      }

      if (!shouldCreateReaction) {
        return res.status(200).send({
          message: customMessage || "Réaction crée!",
          isWarning,
        });
      }

      const reaction = await Reaction.create(
        Object.assign(req.body, { UserId: req.state.get("TOKEN").id })
      );

      res.status(200).send({
        message: customMessage || "Reaction créer!",
        isWarning,
        ...reaction.get(),
      });
    } catch (error) {
      if (error instanceof ValidationError)
        return res.status(400).send({
          errors: yupErrorToJson(error),
        });

      res.status(500).send({ error: "Internal server error" });
    }
  }

  async getReaction(req, res) {
    try {
      const reaction = await this.getReactionId(req.params.ReactionId);
      if (reaction) return res.status(200).send({ reaction });
      return res.status(404).send({ error: "Unauthorized" });
    } catch (error) {
      if (error instanceof ValidationError)
        return res.status(500).send({
          message: "Internal server error",
        });
    }
  }

  async updateReaction(req, res) {
    try {
      const reaction = await this.getReactionId(req.params.ReactionId);
      if (reaction === undefined)
        return res.status(404).send({ error: "Commentaire introuvable!" });
      if (
        reaction.UserId !== req.state.get("TOKEN").id &&
        !req.state.get("TOKEN").Role.admin
      )
        return res
          .status(401)
          .send({ error: "Vous n'avez pes les droits pour faire cela!" });
      reaction.update(req.body);
      res.status(200).send(reaction.get());
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  }

  async deleteReaction(req, res) {
    try {
      const reaction = await this.getReactionId(req.params.ReactionId);
      if (reaction === undefined)
        return res.status(404).send({ error: "Like introuvable!" });
      if (
        reaction.UserId !== req.state.get("TOKEN").id &&
        !req.state.get("TOKEN").Role.admin
      )
        return res.status(401).send({
          error: "Vous n'avez pas les droits suffisants pour faire ceci!",
        });
      await reaction.destroy();
      res.status(200).json({ message: "Reaction supprimé!" });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

module.exports = new ReactionsController();
