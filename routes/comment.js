const express = require("express");
const router = express.Router();
const commentController = require("../controllers/Comments");
const connectionGuard = require("../middlewares/guards/connectionGuard");
const auth = require('../middlewares/auth')
const multerPost = require('../middlewares/multerPost')

router.get("/", commentController.getAllComments);
router.post("/", auth, multerPost,connectionGuard, commentController.createComment);
router.get("/:id",auth, commentController.getComment);
router.put("/:id",auth, multerPost,connectionGuard,commentController.updateComment);
router.delete("/:id",auth ,connectionGuard,commentController.deleteComment);

module.exports = router;
