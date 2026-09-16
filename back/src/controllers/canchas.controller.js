const { pool, poolConnect } = require("../config/db");

const listarCanchas = async (req, res) => {
  try {
    await poolConnect;

    const result = await pool
      .request()
      .execute("usp_ListarCanchas");

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar las canchas"
    });
  }
};

module.exports = {
  listarCanchas
};