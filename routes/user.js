const express = require("express");
const router = express.Router();
const userController = require("../controllers/User");
const connectionGuard = require("../middlewares/guards/connectionGuard");
//const authorisationGuard = require("../middlewares/guards/authorisationGuard");

router.get("/", userController.getAllUsers);
router.post("/", connectionGuard, userController.createUser);
router.get("/:id", userController.getUser);
router.put("/:id",connectionGuard,userController.updateUser);
router.delete("/:id",connectionGuard,userController.deleteUser);

module.exports = router;
