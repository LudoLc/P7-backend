const express = require("express");
const router = express.Router();
const postController = require('../controllers/Post');
const connexionGuard = require("../middlewares/guards/connexionGuard");
const sameUserGuard = require("../middlewares/guards/sameUserGuard");

router.get("/", postController.getAllPosts);
router.post("/", connexionGuard, postController.createPost);
router.get("/:id", postController.getPost);
router.put("/:id", connexionGuard, sameUserGuard(false),postController.updatePost);
router.delete("/:id", connexionGuard, sameUserGuard(false),postController.deletePost);

module.exports = router;
