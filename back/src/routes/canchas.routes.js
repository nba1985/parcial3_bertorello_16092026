const express = require("express");
const router = express.Router();

const {
  listarCanchas
} = require("../controllers/canchas.controller");

router.get("/", listarCanchas);

module.exports = router;