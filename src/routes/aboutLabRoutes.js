const express = require("express");
const router = express.Router();
const aboutLabController = require("../controllers/aboutLabController");
router.get("/", aboutLabController.getAll);
router.put("/", aboutLabController.createOrUpdate);

module.exports = router;
