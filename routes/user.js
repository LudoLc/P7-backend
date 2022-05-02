const express = require("express");
const router = express.Router();
const userController = require('../controllers/User');
const connexionGuard = require("../middlewares/guards/connexionGuard");
const sameUserGuard = require("../middlewares/guards/sameUserGuard");

router.get("/", userController.getAllUsers);
router.post("/", connexionGuard, userController.createUser);
router.get("/:id", userController.getUser);
router.put("/:id", connexionGuard, sameUserGuard(true), userController.updateUser);
router.delete("/:id", connexionGuard, sameUserGuard(true), userController.deleteUser);

module.exports = router;