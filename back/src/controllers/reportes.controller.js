const { pool, poolConnect } = require("../config/db");

const recaudacionPorCancha = async (req, res) => {
  try {
    await poolConnect;

    const result = await pool
      .request()
      .execute("usp_RecaudacionPorCancha");

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error interno del servidor"
    });
  }
};

module.exports = {
  recaudacionPorCancha
};