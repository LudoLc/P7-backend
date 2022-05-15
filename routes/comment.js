const express = require("express");
const router = express.Router();
const commentController = require("../controllers/Comments");
const connectionGuard = require("../middlewares/guards/connectionGuard");
//const authorisationGuard = require("../middlewares/guards/authorisationGuard");
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer')

router.get("/", commentController.getAllComments);
router.post("/", auth, multer,connectionGuard, commentController.createComment);
router.get("/:id",auth, commentController.getComment);
router.put("/:id",auth, multer,connectionGuard,commentController.updateComment);
router.delete("/:id",auth ,connectionGuard,commentController.deleteComment);

module.exports = router;
