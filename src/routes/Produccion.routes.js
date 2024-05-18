import { Router } from "express";

import { BuscarProduccion, actualizarProduccion, listarProduccion, registrarProduccion,DesactivarProduccion } from "../controllers/Produccion.controller.js";
import { ValidateProduccion, actualizar } from "../../validate/ProduccionValidate.js";
import { validarToken } from "../controllers/autenticacion.js";


const rutaProduccion = Router()

rutaProduccion.get('/listarProduccion',validarToken,listarProduccion);
rutaProduccion.post('/RegistraProduccion',validarToken, ValidateProduccion,registrarProduccion);
rutaProduccion.get('/BuscarProduccion/:id_producccion', validarToken, BuscarProduccion);
rutaProduccion.put('/desactivarProduccion/:id_produccion', validarToken, DesactivarProduccion);
rutaProduccion.put('/ActualizarProduccion/:id_producccion',validarToken,actualizar,actualizarProduccion);
rutaProduccion.put('/DesactivarProduccion/:id',validarToken,DesactivarProduccion);
export default rutaProduccion;


