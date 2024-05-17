import { pool } from "../database/conexion.js";
import { validationResult } from "express-validator";

//listar raa
export const listarA = async (req, res) => {
  try {
    // Obtener el ID del administrador que realiza la solicitud desde el token
    const admin_id = req.usuario;

    let sql = `
      SELECT ac.id_actividad, 
             ac.nombre_actividad, 
             ac.tiempo, 
             ac.observaciones,
             ac.valor_actividad,  
             v.nombre_variedad,
             ac.observacion,
             ac.estado
      FROM Actividad AS ac 
      JOIN variedad AS v ON ac.fk_id_variedad = v.id_variedad
      WHERE ac.admin_id = ?`; // Agregar la condición para filtrar por admin_id

    const [result] = await pool.query(sql, [admin_id]); // Pasar admin_id como parámetro

    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(400).json({
        Mensaje: "No hay actividades que listar",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      Mensaje: "Error en el sistema",
    });
  }
};

/* export const RegistrarA = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    
    const {
      nombre_actividad,
      tiempo,
      observaciones,
      fk_id_variedad,
      valor_actividad,
      estado // Agregar estado al destructuring
    } = req.body;

    // Verificar si el campo estado está presente en el cuerpo de la solicitud
    if (!estado) {
      return res.status(400).json({
        status: 400,
        message: "El campo 'estado' es obligatorio"
      });
    }

    // Obtener el ID del administrador que realiza la solicitud desde el token
    const admin_id = req.usuario;

    const [variedadExist] = await pool.query(
      "SELECT * FROM variedad WHERE id_variedad = ?",
      [fk_id_variedad]
    );

    if (variedadExist.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "La variedad no existe. Registre primero una variedad.",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO actividad (nombre_actividad, tiempo, observaciones, fk_id_variedad, valor_actividad, estado, admin_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        nombre_actividad,
        tiempo,
        observaciones,
        fk_id_variedad,
        valor_actividad,
        estado,
        admin_id, // Agregar el admin_id al array de valores para la inserción
      ]
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: 200,
        message: "Se registró la actividad con éxito",
        result: result, // Mostrar el objeto result completo
      });
    } else {
      return res.status(403).json({
        status: 403,
        message: "No se registró la actividad",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message || "Error en el sistema",
    });
  }
}; */

export const RegistrarA = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    
    const {
      nombre_actividad,
      tiempo,
      observaciones,
      fk_id_variedad,
      valor_actividad,
      estado,
      fk_id_tipo_recursos // Añadido fk_id_tipo_recursos al destructuring
    } = req.body;

    // Verificar si el campo estado está presente en el cuerpo de la solicitud
    if (!estado) {
      return res.status(400).json({
        status: 400,
        message: "El campo 'estado' es obligatorio"
      });
    }

    // Obtener el ID del administrador que realiza la solicitud desde el token
    const admin_id = req.usuario;

    // Verificar si la variedad existe
    const [variedadExist] = await pool.query(
      "SELECT * FROM variedad WHERE id_variedad = ?",
      [fk_id_variedad]
    );

    if (variedadExist.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "La variedad no existe. Registre primero una variedad.",
      });
    }

    // Verificar si el tipo de recurso existe
    const [tipoRecursoExist] = await pool.query(
      "SELECT * FROM tipo_recursos WHERE id_tipo_recursos = ?",
      [fk_id_tipo_recursos]
    );

    if (tipoRecursoExist.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "El tipo de recurso no existe.",
      });
    }

    // Inserción de la nueva actividad con la clave foránea fk_id_tipo_recursos
    const [result] = await pool.query(
      "INSERT INTO actividad (nombre_actividad, tiempo, observaciones, fk_id_variedad, valor_actividad, estado, admin_id, fk_id_tipo_recursos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nombre_actividad,
        tiempo,
        observaciones,
        fk_id_variedad,
        valor_actividad,
        estado,
        admin_id,
        fk_id_tipo_recursos // Añadido fk_id_tipo_recursos al array de valores para la inserción
      ]
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: 200,
        message: "Se registró la actividad con éxito",
        result: result, // Mostrar el objeto result completo
      });
    } else {
      return res.status(403).json({
        status: 403,
        message: "No se registró la actividad",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message || "Error en el sistema",
    });
  }
};


export const ActualizarA = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
      nombre_actividad,
      tiempo,
      observaciones,
      fk_id_variedad,
      valor_actividad,
      estado,
      fk_id_tipo_recursos, // Agregar fk_id_tipo_recursos al destructuring
    } = req.body;

    // Verifica si al menos uno de los campos está presente en la solicitud
    if (
      !nombre_actividad &&
      !tiempo &&
      !observaciones &&
      !fk_id_variedad &&
      !valor_actividad &&
      !estado &&
      !fk_id_tipo_recursos // Agregar fk_id_tipo_recursos a la condición
    ) {
      return res.status(400).json({
        message:
          "Al menos uno de los campos (nombre_actividad, tiempo, observaciones, fk_id_variedad, valor_actividad, estado, fk_id_tipo_recursos) debe estar presente en la solicitud para realizar la actualización.",
      });
    }

    // Obtener el ID del administrador que realiza la solicitud desde el token
    const admin_id = req.usuario;

    // Verificar si la actividad a actualizar pertenece al administrador que está realizando la solicitud
    const [oldActividad] = await pool.query(
      "SELECT * FROM actividad WHERE id_actividad=? AND admin_id=?",
      [id, admin_id]
    );

    if (oldActividad.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Actividad no encontrada o no autorizada para actualizar",
      });
    }

    // Realizar la actualización en la base de datos
    const [result] = await pool.query(
      `UPDATE actividad
      SET 
      nombre_actividad = ${nombre_actividad ? `'${nombre_actividad}'` : "nombre_actividad"},
      tiempo = ${tiempo !== undefined ? `'${tiempo}'` : "tiempo"},
      observaciones = ${observaciones ? `'${observaciones}'` : "observaciones"},
      fk_id_variedad = ${fk_id_variedad ? `'${fk_id_variedad}'` : "fk_id_variedad"},
      valor_actividad = ${valor_actividad ? `'${valor_actividad}'` : "valor_actividad"},
      estado = ${estado ? `'${estado}'` : "estado"},
      fk_id_tipo_recursos = ${fk_id_tipo_recursos ? `'${fk_id_tipo_recursos}'` : "fk_id_tipo_recursos"}
      WHERE id_actividad = ${id}`
    );
    

    if (result.affectedRows > 0) {
      res.status(200).json({
        status: 200,
        message: "Actividad actualizada con éxito",
      });
    } else {
      res.status(403).json({
        status: 403,
        message: "No se pudo actualizar la actividad",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message || "Error en el sistema",
    });
  }
};





// crud desactivar/* 

export const DesactivarA = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params; // Cambiado de id_actividad a id
    const admin_id = req.usuario; // Obtener el admin_id del usuario autenticado

    // Consultar el estado actual de la actividad
    const [oldActividad] = await pool.query(
      "SELECT estado FROM actividad WHERE id_actividad = ? AND admin_id = ?",
      [id, admin_id] // Agregar verificación de admin_id
    );

    // Verificar si se encontró la actividad
    if (oldActividad.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "La actividad con el ID proporcionado no fue encontrada o no está autorizada para este administrador",
      });
    }

    // Consultar el estado de la variedad asociada a la actividad
    const [variedad] = await pool.query(
      "SELECT estado FROM variedad WHERE id_variedad = (SELECT fk_id_variedad FROM actividad WHERE id_actividad = ?)",
      [id]
    );

    // Verificar si la variedad está activa
    if (variedad.length > 0 && variedad[0].estado === "activo") {
      // Determinar el nuevo estado de la actividad
      let nuevoEstadoActividad;
      if (oldActividad[0].estado === "activo" || oldActividad[0].estado === "proceso") {
        nuevoEstadoActividad = "inactivo";
      } else if (oldActividad[0].estado === "inactivo") {
        nuevoEstadoActividad = "activo";
      } else {
        return res.status(400).json({
          status: 400,
          message: "El estado actual de la actividad no es válido",
        });
      }

      // Actualizar el estado de la actividad
      await pool.query(
        `UPDATE actividad SET estado = ? WHERE id_actividad = ?`,
        [nuevoEstadoActividad, id]
      );

      // Si se está desactivando la actividad, desactivar también la programación asociada
      if (nuevoEstadoActividad === "inactivo") {
        await pool.query(
          `UPDATE programacion SET estado = ? WHERE fk_id_actividad = ?`,
          ["inactivo", id]
        );
      }

      res.status(200).json({
        status: 200,
        message: `Estado de la actividad cambiado a ${nuevoEstadoActividad}`,
      });
    } else {
      // Si la variedad está inactiva, no se puede cambiar el estado de la actividad
      return res.status(400).json({
        status: 400,
        message: "La actividad no puede cambiar de estado porque la variedad asociada está inactiva",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error en el sistema: " + error.message,
    });
  }
};


 

// CRUD - Buscar
export const BuscarA = async (req, res) => {
  try {
    const { id } = req.params;
    const consultar = `SELECT ac.id_actividad, 
        ac.nombre_actividad, 
        ac.tiempo, 
        ac.observaciones,
        ac.valor_actividad,  
        v.nombre_variedad,
        ac.estado
FROM Actividad AS ac 
JOIN variedad AS v ON ac.fk_id_variedad = v.id_variedad
                            WHERE ac.id_actividad = ?`;

    const [result] = await pool.query(consultar, [id]);

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
      message: "Error en el sistema",
    });
  }
};
