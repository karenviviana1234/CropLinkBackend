import { pool } from "../database/conexion.js";
import { validationResult } from 'express-validator';

//git crud
//crud listar
export const listarTipoRecurso = async (req, res) => {
    try {
        const [result] = await pool.query("SELECT * FROM tipo_recursos")

        if (result.length > 0 ) {
            res.status(200).json(result)
        } else {
            res.status(400).json({
                "Mensaje":"No hay recursos"
            })
        }
    } catch (error) {
        res.status(500).json({
            "Mensaje": "error en el sistema"
        })
    }
}
//crud Registrar
//crud
export const RegistroTipoRecurso = async (req, res) => {
    try {
            const errors= validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json(errors);
            }
           
        const { nombre_recursos, cantidad_medida, unidades_medida,extras } = req.body;


        const [result] = await pool.query("INSERT INTO tipo_recursos (nombre_recursos, cantidad_medida, unidades_medida,extras) VALUES (?, ?, ?, ?)", [nombre_recursos, cantidad_medida, unidades_medida,extras]);
        
        if (result.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                message: 'Se registró el recurso con éxito.',
                result: result
            });
        } else {
            res.status(403).json({
                status: 403,
                message: 'No se registró el recurso.',
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message || 'error en el sistema.'
        });
    }
}

//actualizar
export const ActualizarTipoRecurso = async (req, res) => {
    try {
            const errors= validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json(errors);
            }
        const { id } = req.params;
        const { nombre_recursos, cantidad_medida, unidades_medida,extras  } = req.body;
        if (!nombre_recursos && !cantidad_medida && !unidades_medida && !extras ) {
            return res.status(400).json({ message: 'Al menos uno de los campos ( nombre_recursos, cantidad_medida, unidades_medida,extras) debe estar presente en la solicitud para realizar la actualización.' });
        }
        console.log("Consulta SQL:", `SELECT * FROM tipo_recursos WHERE id_tipo_recursos=${id}`);

        const [oldRecurso] = await pool.query("SELECT * FROM tipo_recursos WHERE id_tipo_recursos=?", [id]);

        

        const [result] = await pool.query(
            `UPDATE tipo_recursos SET nombre_recursos = ${nombre_recursos ? `'${nombre_recursos}'` : `'${oldRecurso[0].nombre_recursos}'`}, cantidad_medida = ${cantidad_medida ? `'${cantidad_medida}'` : `'${oldRecurso[0].cantidad_medida}'`}, unidades_medida= ${unidades_medida ? `'${unidades_medida}'` : `'${oldRecurso[0].unidades_medida}'`}, extras = ${extras ? `'${extras}'` : `'${oldRecurso[0].extras}'`} WHERE id_tipo_recursos = ?`,
            [id]
        );
        

        if (result.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                message: 'Se actualizó con éxito',
                result: result
            });
        } else {
            res.status(404).json({
                status: 404,
                message: 'No se encontró el registro para actualizar'
            });
        }
    } catch (error) {
        console.error("Error en la función Actualizar:", error);  // Agrega este log
        res.status(500).json({
            status: 500,
            message: error.message || "error en el sistema"
        });
    }
};
//CRUD - Desactivar
export const DesactivarTipoRecurso = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const [oldRecurso] = await pool.query("SELECT * FROM tipo_recursos WHERE id_tipo_recursos = ?", [id]); 
        
        const [result] = await pool.query(
            `UPDATE tipo_recursos SET estado = ${estado ? `'${estado}'` : `'${oldRecurso[0].estado}'`} WHERE id_tipo_recursos = ?`,[id]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                message: 'Se desactivo con éxito',
                result: result
            });
        } else {
            res.status(404).json({
                status: 404,
                message: 'No se encontró el registro para desactivar'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error
        });
    }
}

// CRUD - Buscar
export const BuscarTipoRecurso = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query("SELECT * FROM tipo_recursos WHERE id_tipo_recursos =?", [id]);
                    
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                status: 404,
                message: 'No se encontraron resultados para la búsqueda'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "error en el sistema"
        });
    }
};