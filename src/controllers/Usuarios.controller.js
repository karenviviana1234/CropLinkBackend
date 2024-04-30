import {pool} from '../database/conexion.js'
import { validationResult } from "express-validator"
// import bcrypt from 'bcrypt';

export const registrarUsuarios = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors);
      }
  
      const { identificacion, nombre, apellido, correo, password, rol } = req.body;
  
      // Encriptar la contraseña
    //   const bcryptPassword = bcrypt.hashSync(password, 12);
  
      // Asignar el valor "activo" directamente al campo estado
      const estado = 'activo';
  
      const [rows] = await pool.query(
        `INSERT INTO usuarios (identificacion, nombre, apellido, correo, password, rol, estado) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [identificacion, nombre, apellido, correo, password, rol, estado]
      );
  
      if (rows.affectedRows > 0) {
        res.status(200).json({
          status: 'Se registró con éxito el usuario ' + nombre
        });
      } else {
        res.status(403).json({
          status: 403,
          message: 'No se registró el usuario'
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: 'Error del servidor' + error
      });
    }
  };
  export const listarUsuarios = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM usuarios');
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                status: 404,
                message: 'No se encontraron usuarios registrados'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error en el sistema',
            error: error.message // Se agrega el mensaje de error separado
        });
    }
};


export const buscarUsuario = async (req, res) => {
    try {
    const { identificacion } = req.params;

    const [result] = await pool.query("SELECT * FROM usuarios WHERE identificacion=?", [identificacion]);

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                status: 404,
                mensaje: "No se encontró un asuario con esa identificacion"
            });
        }
    } catch (error) {
        res.status(500).json({ 
            status: 500, 
            message: 'Error en el sistema: ' + error 
        });
    }
};
export const actualizarUsuario = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { identificacion } = req.params;
        const { nombre, apellido, correo, password, rol } = req.body;

        if (!nombre && !apellido && !correo && !password && !rol) {
            return res.status(400).json({ message: 'Al menos uno de los campos (nombre, apellido, correo, password, rol) debe estar presente en la solicitud para realizar la actualización.' });
        }

        const [oldUsuario] = await pool.query("SELECT * FROM usuarios WHERE identificacion = ?", [identificacion]);

        if (oldUsuario.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'Usuario no encontrado',
            });
        }

        const updatedUsuario = {
            identificacion: identificacion || oldUsuario[0].identificacion,
            nombre: nombre || oldUsuario[0].nombre,
            apellido: apellido || oldUsuario[0].apellido,
            correo: correo || oldUsuario[0].correo,
            password: password || oldUsuario[0].password,
            rol: rol || oldUsuario[0].rol,
        };

        const [result] = await pool.query(
            `UPDATE usuarios SET identificacion=?, nombre=?, apellido=?, correo=?, password=?, rol=? WHERE identificacion = ?`,
            [updatedUsuario.identificacion, updatedUsuario.nombre, updatedUsuario.apellido, updatedUsuario.correo, updatedUsuario.password, updatedUsuario.rol, identificacion]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                mensaje: "El usuario ha sido actualizado.",
            });
        } else {
            res.status(404).json({
                status: 404,
                mensaje: "No se pudo actualizar el usuario, inténtalo de nuevo.",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};

export const desactivarUsuario = async (req, res) => {
    try {
        const { identificacion } = req.params;

        // Obtener el estado actual del usuario
        const [currentUser] = await pool.query("SELECT estado FROM usuarios WHERE identificacion=?", [identificacion]);
        if (currentUser.length === 0) {
            return res.status(404).json({
                'status': 404,
                'message': 'No se encontró el usuario con la identificación proporcionada'
            });
        }

        const estadoActual = currentUser[0].estado;
        let nuevoEstado = '';

        // Determinar el nuevo estado
        if (estadoActual === 'activo') {
            nuevoEstado = 'inactivo';
        } else {
            nuevoEstado = 'activo';
        }

        // Actualizar el estado del usuario en la base de datos
        const [result] = await pool.query("UPDATE usuarios SET estado=? WHERE identificacion=?", [nuevoEstado, identificacion]);

        if (result.affectedRows > 0) {
            return res.status(200).json({
                'status': 200,
                'message': `Se actualizó con éxito el estado del usuario ${identificacion} a ${nuevoEstado}`
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