import { pool } from "../database/conexion.js";
import { validationResult } from "express-validator";


export const registrarProgramacion = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }

    const {
      fecha_inicio,fecha_fin,fk_identificacion,fk_id_actividad,fk_id_cultivo} = req.body;

    // Asignar el valor "activo" directamente al campo estado
    const estado = 'activo';

    // Verificar si el usuario existe
    const [usuarioExist] = await pool.query("SELECT * FROM usuarios WHERE identificacion = ?",[fk_identificacion]);
    if (usuarioExist.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "El usuario no existe. Registre primero un usuario."
      });
    }

    // Verificar si la actividad existe
    const [actividadExist] = await pool.query(
      "SELECT * FROM actividad WHERE id_actividad = ?",
      [fk_id_actividad]
    );
    if (actividadExist.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "La actividad no existe. Registre primero una actividad."
      });
    }

    // Verificar si el cultivo existe
    const [cultivoExist] = await pool.query(
      "SELECT * FROM cultivo WHERE id_cultivo = ?",
      [fk_id_cultivo]
    );
    if (cultivoExist.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "El cultivo no existe. Registre primero un cultivo."
      });
    }

    // Insertar la programación
    const [result] = await pool.query(
      "INSERT INTO programacion (fecha_inicio, fecha_fin, estado, fk_identificacion, fk_id_actividad, fk_id_cultivo) VALUES (?,?,?,?,?,?)",
      [fecha_inicio, fecha_fin, estado, fk_identificacion, fk_id_actividad, fk_id_cultivo ]
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: 200,
        message: "Se registró con éxito",

      });
    } else {
      return res.status(403).json({
        status: 403,
        message: "No se registró ",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message || "Error en el sistema"
    });
  }
};




// CRUD - Listar
export const listarProgramacion = async (req, res) => {
  try {
    let sql = `SELECT 
        p.id_programacion, 
        p.fecha_inicio,
        p.fecha_fin,
        u.nombre AS usuario,
        a.nombre_actividad,
        v.nombre_variedad,
        l.nombre AS lote,
        p.estado
    FROM 
        programacion AS p
    JOIN 
        usuarios AS u ON p.fk_identificacion = u.identificacion
    JOIN 
        actividad AS a ON p.fk_id_actividad = a.id_actividad
    JOIN 
        variedad AS v ON a.fk_id_variedad = v.id_variedad
    JOIN 
        lotes AS l ON p.fk_id_cultivo = l.id_lote;
    `;

    const [result] = await pool.query(sql);

    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({
        status: 404,
        message: "No hay ninguna asignación",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error interno del servidor",
    });
  }
};


//actualizar
export const actualizarProgramacion = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }

    const { id } = req.params;
    const {
      fecha_inicio,
      fecha_fin,
      fk_identificacion,
      fk_id_actividad,
      fk_id_cultivo,
      estado
    } = req.body;

    // Verificar si el usuario existe
    const [usuarioExist] = await pool.query(
      "SELECT * FROM usuarios WHERE identificacion = ?",
      [fk_identificacion]
    );
    if (usuarioExist.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "El usuario no existe, registre un usuario",
      });
    }

    // Verificar si la actividad existe
    const [actividadExist] = await pool.query(
      "SELECT * FROM actividad WHERE id_actividad = ?",
      [fk_id_actividad]
    );
    if (actividadExist.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "La actividad no existe, registre una actividad",
      });
    }

    // Verificar si el cultivo existe
    const [cultivoExist] = await pool.query(
      "SELECT * FROM cultivo WHERE id_cultivo = ?",
      [fk_id_cultivo]
    );
    if (cultivoExist.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "El cultivo no existe, registre un cultivo",
      });
    }

    // Actualizar la programación
    const [result] = await pool.query(
      `UPDATE programacion 
            SET fecha_inicio = ?, fecha_fin = ?, fk_identificacion = ?, fk_id_actividad = ?, fk_id_cultivo = ?, estado = ? 
            WHERE id_programacion = ?`,
      [
        fecha_inicio,
        fecha_fin,
        fk_identificacion,
        fk_id_actividad,
        fk_id_cultivo,
        estado,
        id,
      ]
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: 200,
        message: "Se actualizó con éxito",
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "No se encontró la programación para actualizar",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message || "Error interno del servidor",
    });
  }
};



// CRUD - Estado
export const estadoProgramacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const [oldTipoRecurso] = await pool.query(
      "SELECT * FROM programacion WHERE id_programacion=?",
      [id]
    );

    const nuevoEstado = estado || (oldTipoRecurso[0].estado === 'activo' ? 'inactivo' : 'activo');

    const [result] = await pool.query(
      `UPDATE programacion SET estado = ? WHERE id_programacion=?`,
      [nuevoEstado, id]
    );
    
    if (result.affectedRows > 0) {
      res.status(200).json({
        status: 200,
        message: `El estado se realizó correctamente y ahora es ${nuevoEstado}`,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "El estado no se realizó correctamente",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message || "Error interno del servidor",
    });
  }
};


// CRUD -buscar
export const buscarProgramacion = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(`
    SELECT 
    p.id_programacion, 
    p.fecha_inicio,
    p.fecha_fin,
    u.nombre AS usuario,
    a.nombre_actividad,
    v.nombre_variedad,
    l.nombre AS lote,
    p.estado
FROM 
    programacion AS p
JOIN 
    usuarios AS u ON p.fk_identificacion = u.identificacion
JOIN 
    actividad AS a ON p.fk_id_actividad = a.id_actividad
JOIN 
    variedad AS v ON a.fk_id_variedad = v.id_variedad
JOIN 
    lotes AS l ON p.fk_id_cultivo = l.id_lote
      WHERE 
        p.id_programacion = ?;
    `, [id]);

    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({
        status: 404,
        message: "No se encontraron resultados para la búsqueda",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message || "Error interno del servidor",
    });
  }
};
