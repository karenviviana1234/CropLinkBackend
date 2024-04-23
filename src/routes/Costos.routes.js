import { Router } from "express";
import {registrar,  actualizar,  buscar, listar, desactivarcosto } from '../controllers/Costos.controller.js';
import { validacionCostosA, validacionCostosR } from "../../validate/CostosValidate.js";
import { validarToken } from "../controllers/autenticacion.js"; 


const rutaCostos = Router();

rutaCostos.get('/listarCostos', /* validarToken, */ listar);
rutaCostos.post('/registrarCostos', /* validarToken, */ validacionCostosR, registrar);
rutaCostos.get('/buscarCostos/:id_costos', /* validarToken, */ buscar); 
rutaCostos.put('/actualizarCostos/:id_costos',/* validarToken, */ validacionCostosA, actualizar);
rutaCostos.put('/desactivarCostos/:id_costos',/* validarToken, */  desactivarcosto);

export default rutaCostos;