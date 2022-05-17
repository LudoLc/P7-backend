const { User, Post } = require("../models");
const Reaction = require("../models/Reaction");
const { ValidationError } = require("yup");
const { yupErrorToJson } = require("yup");
const { reactionSchema } = require("../schemas/reaction");

class ReactionsController {
  constructor() {
    this.getAllReactions = this.getAllReactions.bind(this);
    this.createReaction = this.createReaction.bind(this);
    this.getReaction = this.getReaction.bind(this);
    this.updateReaction = this.updateReaction.bind(this);
    this.deleteReaction = this.deleteReaction.bind(this);
  }

  getReactionId(id) {
    if (id === undefined) return Reaction.findAll({ include: [User, Post] });
    return Reaction.findOne({
      where: {
        id: id,
      },
      include: [User, Post],
    });
  }

  async getAllReactions(req, res) {
    try {
      const reactions = await this.getReactionId();
      res.status(200).send(JSON.stringify(reactions));
    } catch (error) {
      res.status(401).send(error);
    }
  }

  async createReaction(req, res) {
    try {
      await reactionSchema.validate(req.body, {
        abortEarly: false,
        strict: true,
      });

      const reaction = await Reaction.create(
        Object.assign(req.body, { UserId: req.state.get("TOKEN").id })
      );
      res.status(200).send({
        message: "Reaction créer!",
        ...reaction.get(),
      });
    } catch (error) {
      console.log(error);
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
      if (reaction)
        return res.status(200).send({ reaction });
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
      console.log(error);
      res.status(500).send({ error: "Internal server error" });
    }
  }

  async deleteReaction(req, res) {
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
          .send({
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
