const express = require('express');
const router = express.Router();

// CRUD :

router.get("/");
router.post("/");
router.get("/:id");
router.put("/:id");
router.delete("/:id");

module.exports = router;