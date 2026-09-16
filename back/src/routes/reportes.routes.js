const express = require("express");
const router = express.Router();

const {
  recaudacionPorCancha
} = require("../controllers/reportes.controller");

router.get("/recaudacion-por-cancha", recaudacionPorCancha);

module.exports = router;