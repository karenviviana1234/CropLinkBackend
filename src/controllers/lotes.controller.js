import { pool } from "../database/conexion.js"
import {validationResult} from 'express-validator'
//nn

export const listarlotes = async (req, res) => {
    try {
      let sql = `SELECT lo.id_lote, lo.nombre, lo.longitud, lo.latitud, 
      fin.nombre_finca AS nombre_finca,
          fin.longitud, 
          fin.latitud,
          lo.estado
   FROM lotes AS lo
   JOIN finca AS fin ON lo.fk_id_finca = fin.id_finca`;
      const [resultado] = await pool.query(sql);
  
      if (resultado.length > 0) {
        res.status(200).json(resultado);
      } else {
        res.status(404).json({
          mensaje: "no se pudo mostar hay algun error",
        });
      }
    } catch (error) {
      res.status(500).json({
        mensaje: error,
      });
    }
  };
  export const Registrarlotes = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors });
        }
        const { nombre, longitud, latitud, fk_id_finca  } = req.body;
        const estado = 'activo'; // Definir el estado como activo
        const [resultado] = await pool.query("INSERT INTO lotes (nombre, longitud, latitud, fk_id_finca, estado) VALUES (?, ?, ?, ?, ?)", [nombre, longitud, latitud, fk_id_finca, estado]);

        if (resultado.affectedRows > 0) {
            return res.status(200).json({ mensaje: "Lote registrado con éxito" });
        } else {
            return res.status(400).json({ mensaje: "Hay un error, no se pudo guardar" });
        }
    } catch (error) {
        return res.status(500).json({ mensaje:+ error });
    }
};


export const Actualizarlote = async (req, res) => {
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }
      
      const { id_lote } = req.params;
      const { nombre, longitud, latitud, fk_id_finca } = req.body;
      
      // Verifica si al menos uno de los campos está presente en la solicitud
      if (!nombre && !longitud && !latitud && !fk_id_finca) {
          return res.status(400).json({ message: 'Al menos uno de los campos (nombre, longitud, latitud, fk_id_finca) debe estar presente en la solicitud para realizar la actualización.' });
      }
      
      const [oldUser] = await pool.query("SELECT * FROM lotes WHERE id_lote=?", [id_lote]);
      
      const updateValues = {
          nombre: nombre ? nombre : oldUser[0].nombre,
          longitud: longitud ? longitud : oldUser[0].longitud,
          latitud: latitud ? latitud : oldUser[0].latitud,
          fk_id_finca: fk_id_finca ? fk_id_finca : oldUser[0].fk_id_finca,
      };
      
      const updateQuery = `UPDATE lotes SET nombre=?, longitud=?, latitud=?, fk_id_finca=? WHERE id_lote=?`;
      
      const [resultado] = await pool.query(updateQuery, [updateValues.nombre, updateValues.longitud, updateValues.latitud, updateValues.fk_id_finca, parseInt(id_lote)]);
      
      if (resultado.affectedRows > 0) { 
          res.status(200).json({ "mensaje": "El lote ha sido actualizado" });
      } else {
          res.status(404).json({ "mensaje": "No se pudo actualizar el lote" }); 
      }
  } catch (error) {
      res.status(500).json({ "mensaje": error.message });
  }
}



export const Buscarlote = async (req, res) => {
    try {
        const { id_lote } = req.params;
        const [ resultado ] = await pool.query("select * from lotes where id_lote=?", [id_lote])

        if (resultado.length > 0) {
            res.status(200).json(resultado)
        } else {
            res.status(400).json({
                "mensaje": "No se encontró nada con ese ID"
            })
        }

    }  catch (error) {
        res.status(500).json({
            "mensaje": error
        })     
    }
}

export const eliminarlote = async (req, res) => {
    try{
        const { id_lote } = req.params;
        const [ resultado ] = await pool.query("delete from lotes where id_lote=?", [id_lote])

        if (resultado.affectedRows > 0) {
            res.status(200).json({
                "mensaje": "desactivado con exito"
            })
        } else {
            res.status(404).json({
                "mensaje": "No se pudo desactivar"
            })
        }
    } catch (error) {
        res.status(500).json({
            "mensaje": error
        })
    }
}


export const desactivarlote = async (req, res) => {
  try {
      const { id_lote } = req.params;

      // Consultar el estado actual del lote
      const [lote] = await pool.query(
          "SELECT estado, fk_id_finca FROM lotes WHERE id_lote = ?",
          [id_lote]
      );

      if (lote.length === 0) {
          return res.status(404).json({
              status: 404,
              message: "El lote con el ID " + id_lote + " no existe.",
          });
      }

      // Consultar el estado de la finca relacionada
      const [finca] = await pool.query(
          "SELECT estado FROM finca WHERE id_finca = ?",
          [lote[0].fk_id_finca]
      );

      // Verificar si la finca está activa
      if (finca.length === 0 || finca[0].estado !== 'activo') {
          return res.status(403).json({
              status: 403,
              message: "No se puede cambiar el estado del lote porque la finca correspondiente no está activa.",
          });
      }

      // Cambiar el estado del lote
      const nuevoEstado = lote[0].estado === 'activo' ? 'inactivo' : 'activo';
      const [result] = await pool.query(
          "UPDATE lotes SET estado = ? WHERE id_lote = ?",
          [nuevoEstado, id_lote]
      );

      if (result.affectedRows > 0) {
          res.status(200).json({
              status: 200,
              mensaje: "El estado del lote con el ID " + id_lote + " ha sido cambiado a " + nuevoEstado + ".",
          });
      } else {
          res.status(500).json({
              status: 500,
              message: "No se pudo cambiar el estado del lote",
          });
      }
  } catch (error) {
      res.status(500).json({
          status: 500,
          message: "Error en el sistema: " + error,
      });
  }
};
