const express = require("express");
const router = express.Router();
const postController = require("../controllers/Post");
const connectionGuard = require("../middlewares/guards/connectionGuard");
//const authorisationGuard = require("../middlewares/guards/authorisationGuard");
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer')

router.get("/", auth,postController.getAllPosts);
router.post("/",auth, multer,connectionGuard, postController.createPost);
router.get("/:id",auth,postController.getPost);
router.put("/:id",auth, multer,connectionGuard,postController.updatePost);
router.delete("/:id",auth,connectionGuard,postController.deletePost);

module.exports = router;
