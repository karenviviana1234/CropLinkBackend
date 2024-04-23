import { pool } from "../database/conexion.js";
import { validationResult } from "express-validator";

export const listarProduccion = async (req, res) => {
    try {
        let sql = `SELECT produ.id_producccion,produ.cantidad_produccion, 
        produ.fk_id_programacion  AS id_programacion,  
        pro.fecha_inicio, 
        pro.fecha_fin
FROM produccion AS produ
JOIN programacion AS pro ON produ.fk_id_programacion  = pro.id_programacion`;

        const [listar] = await pool.query(sql);

        if (listar.length > 0) {
            res.status(200).json(listar);
        } else {
            res.status(400).json({
                status: 400,
                message: 'no hay ningun produccion'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'error en el servidor',
        });
        console.log(error);
    }
};

export const registrarProduccion = async (req, res) => {
    try {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({
                errors: error.array()
            });
        }

        const { cantidad_produccion, precio, fk_id_programacion } = req.body;

        const [variedadExiste] = await pool.query('SELECT * FROM programacion WHERE id_programacion = ?', [fk_id_programacion]);

        if (variedadExiste.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'Este ID no existe. Por favor, registre la programacion primero.'
            });
        }

        if (!cantidad_produccion || !precio || !fk_id_programacion) {
            return res.status(400).json({
                message: 'Se requieren todos los campos para registrar la producción.'
            });
        }

        const [Registrar] = await pool.query('INSERT INTO produccion (cantidad_produccion, precio, fk_id_programacion) VALUES (?, ?, ?)',
            [cantidad_produccion, precio, fk_id_programacion]);

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

        const { id_producccion  } = req.params;
        const { cantidad_produccion, precio, fk_id_programacion } = req.body;

        if (!cantidad_produccion && !precio && !fk_id_programacion ) {
            return res.status(400).json({
              message:
                "se requiere uno de los campos para actualizar (cantidad_produccion, precio, fk_id_programacion)",
            });
        }
        const [variedadExiste] = await pool.query('SELECT * FROM programacion WHERE id_programacion = ?', [fk_id_programacion]);

        if (variedadExiste.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'Este ID no existe. Por favor, registre la variedad primero.'
            });
        }

        // Verificar si la producción a actualizar existe
        const [produccionExistente] = await pool.query('SELECT * FROM produccion WHERE id_producccion =?', [id_producccion ]);

        if (produccionExistente.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'Producción no encontrada. El ID proporcionado no existe.'
            });
        }

        // Verificar si los valores son diferentes para evitar realizar la misma actualización
        if (
            produccionExistente[0].cantidad_produccion === cantidad_produccion &&
            produccionExistente[0].precio === precio &&
            produccionExistente[0].fk_id_programacion === fk_id_programacion
        ) {
            return res.status(404).json({
                status: 404,
                message: 'No se ha realizado ningún cambio. Los datos son iguales a los existentes.'
            });
        }

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
                message: updatedProduccion.changedRows > 0 ? 'Se actualizó con éxito' : 'Sin cambios realizados',
            });
        } else {
            res.status(400).json({
                status: 400,
                message: 'No se encontraron resultados para la actualización',
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


export const eliminarProduccion = async (req, res) => {
    try {
        // Obtiene el ID de la producción desde el header
        const id_produccion = req.headers['id_produccion'];

        // Verifica si se proporcionó el ID
        if (!id_produccion) {
            return res.status(400).json({
                status: 400,
                message: 'Se requiere proporcionar el ID de la producción en el header'
            });
        }

        // Realiza la consulta para eliminar la producción con el ID proporcionado
        const [result] = await pool.query('DELETE FROM produccion WHERE id_produccion = ?', [id_produccion]);

        // Verifica si se eliminó correctamente
        if (result.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                message: 'Se eliminó la producción con éxito'
            });
        } else {
            res.status(404).json({
                status: 404,
                message: 'No se encontró ninguna producción con el ID proporcionado'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error en el servidor'
        });
    }
};