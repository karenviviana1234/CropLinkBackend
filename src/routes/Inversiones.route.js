import { Router } from "express";
import { Validateinversiones, actualizar } from "../../validate/Inversiones.validate.js";
import { BuscarInversiones, actualizarInversiones, listarInversiones, registrarInversiones } from "../controllers/Inversiones.controller.js";
import { validarToken } from "../controllers/autenticacion.js";

const Rutainversiones = Router()


Rutainversiones.get('/listarinversion', validarToken, listarInversiones)
Rutainversiones.post('/RegistrarInversion', validarToken, Validateinversiones, registrarInversiones)
Rutainversiones.get('/BuscarInversion/:id_inversiones', validarToken, BuscarInversiones)
Rutainversiones.put('/ActualizarInversion/:id_inversiones', validarToken, actualizar, actualizarInversiones)


export default Rutainversiones
//nn