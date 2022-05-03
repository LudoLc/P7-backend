const express = require("express");
const router = express.Router();
const postController = require("../controllers/Post");
const connectionGuard = require("../middlewares/guards/connectionGuard");
//const authorisationGuard = require("../middlewares/guards/authorisationGuard");

router.get("/", postController.getAllPosts);
router.post("/", connectionGuard, postController.createPost);
router.get("/:id", postController.getPost);
router.put("/:id",connectionGuard,postController.updatePost);
router.delete("/:id",connectionGuard,postController.deletePost);

module.exports = router;
