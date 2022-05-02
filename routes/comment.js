const express = require("express");
const router = express.Router();
const commentController = require('../controllers/Comments');
const connexionGuard = require("../middlewares/guards/connexionGuard");
const sameUserGuard = require("../middlewares/guards/sameUserGuard");

router.get("/", commentController.getAllComments);
router.post("/", connexionGuard, commentController.createComment);
router.get("/:id", commentController.getComment);
router.put("/:id", connexionGuard, sameUserGuard(false),commentController.updateComment);
router.delete("/:id", connexionGuard, sameUserGuard(false),commentController.deleteComment);

module.exports = router;
