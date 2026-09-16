const { sql, pool, poolConnect } = require("../config/db");

const listarReservas = async (req, res) => {
  try {
    await poolConnect;

    const result = await pool
      .request()
      .execute("usp_ListarReservas");

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error interno del servidor"
    });
  }
};

const crearReserva = async (req, res) => {
  try {
    const { IdCancha, Cliente, Fecha, Hora } = req.body;

    await poolConnect;

    const result = await pool
      .request()
      .input("IdCancha", sql.Int, IdCancha)
      .input("Cliente", sql.NVarChar(100), Cliente)
      .input("Fecha", sql.Date, Fecha)
      .input("Hora", sql.NVarChar(5), Hora)
      .execute("usp_CrearReserva");

    res.status(201).json({
      mensaje: "Reserva creada correctamente",
      IdReserva: result.recordset[0].IdReserva
    });
  } catch (error) {
    if (error.number === 50002) {
      return res.status(404).json({
        mensaje: error.message
      });
    }

    if (
      error.number === 50003 ||
      error.number === 50011
    ) {
      return res.status(400).json({
        mensaje: error.message
      });
    }

    res.status(500).json({
      mensaje: "Error interno del servidor"
    });
  }
};

const registrarPago = async (req, res) => {
  try {
    const { id } = req.params;

    await poolConnect;

    await pool
      .request()
      .input("IdReserva", sql.Int, id)
      .execute("usp_RegistrarPago");

    res.status(200).json({
      mensaje: "Pago registrado correctamente"
    });
  } catch (error) {
    if (error.number === 50002) {
      return res.status(404).json({
        mensaje: error.message
      });
    }

    if (error.number === 50008) {
      return res.status(400).json({
        mensaje: error.message
      });
    }

    res.status(500).json({
      mensaje: "Error interno del servidor"
    });
  }
};

module.exports = {
  listarReservas,
  crearReserva,
  registrarPago
};

