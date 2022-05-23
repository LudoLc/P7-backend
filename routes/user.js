const express = require("express");
const router = express.Router();
const userController = require("../controllers/User");
const connectionGuard = require("../middlewares/guards/connectionGuard");
const auth = require('../middlewares/auth')
//const authorisationGuard = require("../middlewares/guards/authorisationGuard");

const multerAvatar = require("../middlewares/multerAvatar");

router.get("/", auth, userController.getAllUsers);
router.post("/", auth, connectionGuard, userController.createUser);
router.get("/:id", auth, userController.getUser);
router.put("/:id",auth, multerAvatar ,connectionGuard,userController.updateUser);
router.put("/avatar/:id",auth, multerAvatar, connectionGuard,userController.updateAvatar);
router.delete("/:id",auth, connectionGuard,userController.deleteUser);

module.exports = router;
