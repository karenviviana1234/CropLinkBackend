import { pool } from "../database/conexion.js";
import { validationResult } from "express-validator";

export const listarProduccion = async (req, res) => {
    try {
        // Obtener el admin_id del usuario autenticado
        const adminId = req.usuario;

        let sql = `
            SELECT 
                produ.id_producccion,
                produ.cantidad_produccion, 
                produ.fk_id_programacion AS id_programacion,  
                pro.fecha_inicio, 
                pro.fecha_fin
            FROM 
                produccion AS produ
            JOIN 
                programacion AS pro ON produ.fk_id_programacion = pro.id_programacion
            WHERE
                pro.admin_id = ?;
        `;

        const [listar] = await pool.query(sql, [adminId]);

        if (listar.length > 0) {
            res.status(200).json(listar);
        } else {
            res.status(400).json({
                status: 400,
                message: 'No hay ninguna producción asociada al administrador actual'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error en el servidor',
        });
        console.log(error);
    }
};

export const registrarProduccion = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const { cantidad_produccion, precio, fk_id_programacion } = req.body;

        // Obtener el admin_id del usuario autenticado
        const adminId = req.usuario;

        // Verificar si la programación existe y pertenece al administrador actual
        const [programacionExist] = await pool.query('SELECT * FROM programacion WHERE id_programacion = ? AND admin_id = ?', [fk_id_programacion, adminId]);

        if (programacionExist.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'Esta programación no existe o no está autorizada para este administrador. Registre primero la programación.'
            });
        }

        if (!cantidad_produccion || !precio || !fk_id_programacion) {
            return res.status(400).json({
                message: 'Se requieren todos los campos para registrar la producción.'
            });
        }

        const [Registrar] = await pool.query('INSERT INTO produccion (cantidad_produccion, precio, fk_id_programacion,admin_id) VALUES (?, ?, ?, ?)',
            [cantidad_produccion, precio, fk_id_programacion, admin_id]);

        if (Registrar.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                message: 'Se registró correctamente la producción.'
            });
        } else {
            res.status(400).json({
                status: 400,
                message: 'No se ha podido registrar la producción.'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error en el servidor'
        });
        console.log(error);
    }
};


export const BuscarProduccion = async (req, res) => {
    try {
        let sql = `SELECT produ.id_producccion,produ.cantidad_produccion, 
        produ.fk_id_programacion AS id_programacion,  
        pro.fecha_inicio, 
        pro.fecha_fin
FROM produccion AS produ
JOIN programacion AS pro ON produ.fk_id_programacion  = pro.id_programacion`;

        const { id } = req.params;
        const consultar = 'SELECT * FROM produccion WHERE id_producccion  LIKE ?';
        const [resultado] = await pool.query(consultar, [id]);

        if (resultado.length > 0) {
            return res.status(200).json({ resultado });
        } else {
            res.status(404).json({
                status: 404,
                message: "No se encontraron resultados con el id ",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "error en el servidor ",
        });
        console.log(error)
    }
};


export const actualizarProduccion = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id_producccion } = req.params;
        const { cantidad_produccion, precio, fk_id_programacion } = req.body;

        if (!cantidad_produccion && !precio && !fk_id_programacion) {
            return res.status(400).json({
                message: "Se requiere al menos uno de los campos para actualizar (cantidad_produccion, precio, fk_id_programacion)",
            });
        }

        // Obtener el admin_id del usuario autenticado
        const adminId = req.usuario;

        // Verificar si la producción a actualizar existe y pertenece al administrador actual
        const [produccionExistente] = await pool.query('SELECT * FROM produccion AS p INNER JOIN programacion AS pro ON p.fk_id_programacion = pro.id_programacion WHERE p.id_producccion = ? AND pro.admin_id = ?', [id_producccion, adminId]);

        if (produccionExistente.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'La producción no existe o no está autorizada para actualizar por este administrador. Verifique el ID proporcionado.'
            });
        }

        // Construir y ejecutar la consulta de actualización
        const updateValues = {
            cantidad_produccion: cantidad_produccion || produccionExistente[0].cantidad_produccion,
            precio: precio || produccionExistente[0].precio,
            fk_id_programacion: fk_id_programacion || produccionExistente[0].fk_id_programacion,
        };

        const updateQuery = 'UPDATE produccion SET cantidad_produccion=?, precio=?, fk_id_programacion=? WHERE id_producccion=?';

        const [updatedProduccion] = await pool.query(updateQuery, [
            updateValues.cantidad_produccion,
            updateValues.precio,
            updateValues.fk_id_programacion,
            id_producccion
        ]);

        if (updatedProduccion.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                message: updatedProduccion.changedRows > 0 ? 'La producción se actualizó correctamente' : 'No se realizaron cambios',
            });
        } else {
            res.status(404).json({
                status: 404,
                message: 'No se encontraron resultados para actualizar',
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error en el servidor',
            error: error.message
        });
        console.log(error)
    }
};


export const desactivarProduccion = async (req, res) => {
    try {
        const { id_producccion } = req.params;

        const [currentUser] = await pool.query("SELECT estado FROM produccion WHERE id_producccion=?", [id_producccion]);
        if (currentUser.length === 0) {
            return res.status(404).json({
                'status': 404,
                'message': 'No se encontró la proggramacion  con el id proporcionado'
            });
        }
        const estadoActual = currentUser[0].estado;
        let nuevoEstado = '';
        if (estadoActual === 'activo') {
            nuevoEstado = 'inactivo';
        } else {
            nuevoEstado = 'activo';
        }

        const [result] = await pool.query("UPDATE produccion SET estado=? WHERE id_producccion=?", [nuevoEstado, id_producccion]);

        if (nuevoEstado === 'inactivo') {
            await pool.query("UPDATE programacion SET estado='inactivo' WHERE fk_id_producccion=?", [id_producccion]);
        } else {
            await pool.query("UPDATE programacion SET estado='activo' WHERE fk_id_producccion=?", [id_producccion]);
        }

        if (result.affectedRows > 0) {
            return res.status(200).json({
                'status': 200,
                'message': `Se actualizó con éxito el estado a ${nuevoEstado}`
            });
        } else {
            return res.status(404).json({
                'status': 404,
                'message': 'No se pudo actualizar el estado del usuario'
            });
        }
    } catch (error) {
        res.status(500).json({
            'status': 500,
            'message': 'Error en el sistema: ' + error
        });
    }
};

// export const eliminarProduccion = async (req, res) => {
//     try {
//         // Obtiene el ID de la producción desde el header
//         const id_produccion = req.headers['id_produccion'];

//         // Verifica si se proporcionó el ID
//         if (!id_produccion) {
//             return res.status(400).json({
//                 status: 400,
//                 message: 'Se requiere proporcionar el ID de la producción en el header'
//             });
//         }

//         // Realiza la consulta para eliminar la producción con el ID proporcionado
//         const [result] = await pool.query('DELETE FROM produccion WHERE id_produccion = ?', [id_produccion]);

//         // Verifica si se eliminó correctamente
//         if (result.affectedRows > 0) {
//             res.status(200).json({
//                 status: 200,
//                 message: 'Se eliminó la producción con éxito'
//             });
//         } else {
//             res.status(404).json({
//                 status: 404,
//                 message: 'No se encontró ninguna producción con el ID proporcionado'
//             });
//         }
//     } catch (error) {
//         res.status(500).json({
//             status: 500,
//             message: 'Error en el servidor'
//         });
//     }
// };