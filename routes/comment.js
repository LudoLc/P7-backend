const express = require("express");
const router = express.Router();
const commentController = require("../controllers/Comments");
const connectionGuard = require("../middlewares/guards/connectionGuard");
const authorisationGuard = require("../middlewares/guards/authorisationGuard");

router.get("/", commentController.getAllComments);
router.post("/", connectionGuard, commentController.createComment);
router.get("/:id", commentController.getComment);
router.put(
  "/:id",
  connectionGuard,
  authorisationGuard,
  commentController.updateComment
);
router.delete(
  "/:id",
  connectionGuard,
  authorisationGuard,
  commentController.deleteComment
);

module.exports = router;
