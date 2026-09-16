const express = require("express");
const router = express.Router();

const {
  listarReservas,
  crearReserva,
  registrarPago
} = require("../controllers/reservas.controller");

router.get("/", listarReservas);
router.post("/", crearReserva);
router.put("/:id/pago", registrarPago);

module.exports = router;