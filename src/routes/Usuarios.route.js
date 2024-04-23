import { Router } from "express"
import  {actualizarUsuario, listarUsuarios, buscarUsuario, desactivarUsuario, registrarUsuarios} from '../controllers/Usuarios.controller.js';
import {validarUsuario, validarUsu} from '../../validate/Usuariosvalidate.js'
import { validarToken } from '../controllers/autenticacion.js'

const rutaUsuario = Router();

rutaUsuario.get('/listarUsuario', validarToken,listarUsuarios);  
rutaUsuario.post('/registrarUsuario',registrarUsuarios);
rutaUsuario.put('/desactivarUsuario/:identificacion',validarToken, desactivarUsuario);
rutaUsuario.put('/actualizarUsuario/:identificacion',validarToken,actualizarUsuario);
rutaUsuario.get('/buscarUsuarios/:identificacion',validarToken, buscarUsuario);


export default rutaUsuario;
