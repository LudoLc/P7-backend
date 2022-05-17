const express = require("express");
const router = express.Router();
const reactionController = require("../controllers/Reactions");
const connectionGuard = require("../middlewares/guards/connectionGuard");
//const authorisationGuard = require("../middlewares/guards/authorisationGuard");
const auth = require('../middlewares/auth')

router.get("/", auth, reactionController.getAllReactions);
router.post("/", auth, connectionGuard,reactionController.createReaction);
router.get("/:ReactionId",auth, reactionController.getReaction);
router.put("/:ReactionId",auth, connectionGuard,reactionController.updateReaction);
router.delete("/:ReactionId", auth, connectionGuard,reactionController.deleteReaction);

module.exports = router;