import {query} from 'express';
import { pool } from '../database/conexion.js';
import { validationResult } from 'express-validator';


export const listar = async (req, res) => {
    try {
        // Obtener el admin_id del usuario autenticado
        const adminId = req.usuario;

        let sql = `
        SELECT 
            cul.id_cultivo,
            cul.fecha_inicio,
            fin.nombre_finca,
            lo.nombre AS nombre_lote,
            cul.cantidad_sembrada,
            var.nombre_variedad,
            cul.estado
        FROM cultivo AS cul
        JOIN lotes AS lo ON cul.fk_id_lote = lo.id_lote
        JOIN finca AS fin ON lo.fk_id_finca = fin.id_finca
        JOIN variedad AS var ON cul.fk_id_variedad = var.id_variedad
        JOIN usuarios AS u ON fin.admin_id = u.identificacion
        WHERE u.identificacion = ?;
        `;

        const [result] = await pool.query(sql, [adminId]);

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'No se encontraron cultivos' });
        }
    } catch(error) {
        res.status(500).json({ status: 500, message: 'Error en el sistema: ' + error });
    }
};

export const registrar = async (req, res) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { fecha_inicio, cantidad_sembrada, fk_id_lote, fk_id_variedad } = req.body;

        // Asignar el valor "activo" directamente al campo estado
        const estado = 'activo';

        // Obtener el admin_id del usuario autenticado
        const adminId = req.usuario;

        // Verificar si el lote y la variedad existen
        const [loteResult] = await pool.query("SELECT COUNT(*) AS count FROM lotes WHERE id_lote = ?", [fk_id_lote]);
        const [variedadResult] = await pool.query("SELECT COUNT(*) AS count FROM variedad WHERE id_variedad = ?", [fk_id_variedad]);

        if (loteResult[0].count === 0) {
            return res.status(400).json({ status: 400, message: 'El valor de fk_id_lote no existe en la tabla lotes' });
        }

        if (variedadResult[0].count === 0) {
            return res.status(400).json({ status: 400, message: 'El valor de fk_id_variedad no existe en la tabla variedad' });
        }
  
        const sql = `INSERT INTO cultivo (fecha_inicio, cantidad_sembrada, fk_id_lote, fk_id_variedad, estado, admin_id) VALUES (?, ?, ?, ?, ?, ?)`;
  
        const [rows] = await pool.query(sql, [fecha_inicio, cantidad_sembrada, fk_id_lote, fk_id_variedad, estado, adminId]);
        
        if (rows.affectedRows > 0) {
            res.status(200).json({ status: 200, message: 'Registro exitoso de su cultivo' });
        } else {
            res.status(403).json({ status: 403, message: 'Fallo el registro de su cultivo' });
        }
    } catch(error) {
        res.status(500).json({ status: 500, message: 'Error en el sistema: ' + error });
    }
};

  
export const actualizar = async (req, res) => {
    try {
        const { id_cultivo } = req.params;
        const { fecha_inicio, cantidad_sembrada, fk_id_lote, fk_id_variedad } = req.body;
        
        if (!fecha_inicio && !cantidad_sembrada && !fk_id_lote && !fk_id_variedad) {
            return res.status(400).json({ message: 'Al menos uno de los campos (fecha_inicio, cantidad_sembrada, fk_id_lote, fk_id_variedad) debe estar presente en la solicitud para realizar la actualización.' });
        }
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Verificar si el valor de fk_id_lote existe en la tabla lotes
        const [checkResult1] = await pool.query('SELECT COUNT(*) AS count FROM lotes WHERE id_lote = ?', [fk_id_lote]);
        const [checkResult2] = await pool.query('SELECT COUNT(*) AS count FROM variedad WHERE id_variedad = ?', [fk_id_variedad]);

        if (checkResult1[0].count === 0) {
            return res.status(400).json({ status: 400, message: 'El valor de fk_id_lote no existe en la tabla lotes' });
        }

        if (checkResult2[0].count === 0) {
            return res.status(400).json({ status: 400, message: 'El valor de fk_id_variedad no existe en la tabla variedad' });
        }

        // Verificar si el cultivo existe
        const [cultivoExist] = await pool.query('SELECT * FROM cultivo WHERE id_cultivo = ?', [id_cultivo]);

        if (cultivoExist.length === 0) {
            return res.status(404).json({ status: 404, message: 'El cultivo no existe. Registre primero un cultivo.' });
        }

        // Obtener el admin_id del usuario autenticado
        const adminId = req.usuario;

        let sql = `
            UPDATE cultivo
            SET fecha_inicio = ?,
                cantidad_sembrada = ?,
                fk_id_lote = ?,
                fk_id_variedad = ?,
                admin_id = ?
            WHERE id_cultivo = ?
        `;

        const [rows] = await pool.query(sql, [fecha_inicio, cantidad_sembrada, fk_id_lote, fk_id_variedad, adminId, id_cultivo]);

        if (rows.affectedRows > 0) {
            res.status(200).json({ status: 200, message: 'La información ha sido actualizada' });
        } else {
            res.status(404).json({ status: 404, message: 'No se pudo actualizar la información' });
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error en el sistema: ' + error });
    }
};

  
export const buscar = async (req, res) => {
    try {
        const { id_cultivo } = req.params;
        const consultar = `
            SELECT cul.id_cultivo,
                   cul.fecha_inicio,
                   cul.cantidad_sembrada, 
                   lo.nombre AS nombre_lote, 
                   fin.nombre_finca,
                   var.nombre_variedad, 
                   cul.estado
            FROM cultivo AS cul
            JOIN lotes AS lo ON cul.fk_id_lote = lo.id_lote
            JOIN finca AS fin ON lo.fk_id_finca = fin.id_finca
            JOIN variedad AS var ON cul.fk_id_variedad = var.id_variedad
            WHERE cul.id_cultivo = ?
        `;
        const [resultado] = await pool.query(consultar, [id_cultivo]);

        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(404).json({
                mensaje: "No se encontró un cultivo con ese ID"
            });
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error en el sistema: ' + error });
    }
};export const desactivar = async (req, res) => {
    try {
        const { id_cultivo } = req.params;

        // Consultar el estado actual del cultivo, el ID del lote asociado y el ID de la variedad asociada
        const [cultivo] = await pool.query("SELECT estado, fk_id_lote, fk_id_variedad FROM cultivo WHERE id_cultivo = ?", [id_cultivo]);

        if (cultivo.length > 0) {
            const estadoActual = cultivo[0].estado;
            const fk_id_lote = cultivo[0].fk_id_lote;
            const fk_id_variedad = cultivo[0].fk_id_variedad;

            // Consultar el estado actual del lote asociado
            const [lote] = await pool.query("SELECT estado FROM lotes WHERE id_lote = ?", [fk_id_lote]);

            // Consultar el estado actual de la variedad asociada
            const [variedad] = await pool.query("SELECT estado FROM variedad WHERE id_variedad = ?", [fk_id_variedad]);

            // Verificar si el estado del lote o de la variedad están inactivos para no permitir activar el cultivo
            if ((lote.length > 0 && lote[0].estado === 'inactivo') || (variedad.length > 0 && variedad[0].estado === 'inactivo')) {
                return res.status(403).json({
                    status: 403,
                    message: 'No se puede cambiar el estado del cultivo porque el lote o la variedad asociada está inactiva'
                });
            }

            // Determinar el nuevo estado del cultivo
            const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';

            // Actualizar el estado del cultivo en la base de datos
            const [result] = await pool.query(
                "UPDATE cultivo SET estado = ? WHERE id_cultivo = ?", [nuevoEstado, id_cultivo]
            );

            if (result.affectedRows > 0) {
                res.status(200).json({
                    status: 200,
                    message: `Se cambió el estado del cultivo a ${nuevoEstado} con éxito`
                });
            } else {
                res.status(404).json({
                    status: 404,
                    message: 'No se encontró el cultivo para desactivar'
                });
            }
        } else {
            res.status(404).json({
                status: 404,
                message: 'No se encontró el cultivo'
            });
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error en el sistema: ' + error });
    }
};



/* 
export const desactivar = async (req, res) => {
    try {
        const { id_cultivo } = req.params;
        const [oldCultivo] = await pool.query("SELECT * FROM cultivo WHERE id_cultivo = ?", [id_cultivo]); 

        if (oldCultivo.length > 0) {
            // Obtener el estado actual del cultivo
            const estadoActual = oldCultivo[0].estado;

            // Determinar el nuevo estado
            let nuevoEstado = '';
            if (estadoActual === 'activo') {
                nuevoEstado = 'inactivo';
            } else {
                nuevoEstado = 'activo';
            }

            // Actualizar el estado del cultivo en la base de datos
            const [result] = await pool.query(
                `UPDATE cultivo SET estado = ? WHERE id_cultivo = ?`, [nuevoEstado, id_cultivo]
            );

            if (result.affectedRows > 0) {
                res.status(200).json({
                    status: 200,
                    message: `Se cambió el estado del cultivo a ${nuevoEstado} con éxito`
                });
            } else {
                res.status(404).json({
                    status: 404,
                    message: 'No se encontró el cultivo para desactivar'
                });
            }
        } else {
            res.status(404).json({
                status: 404,
                message: 'No se encontró el cultivo'
            });
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error en el sistema: ' + error });
    }
}
 */