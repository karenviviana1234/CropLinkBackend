import { Router } from "express";
import { /* listarE, */RegistrarE,Empleado, listarEmpleado } from "../controllers/Empleado.controller.js";
import { validarRR } from "../../validate/Empleadovalidate.js";

import {validarToken} from "../controllers/autenticacion.js";


const rutaDeEmpleado = Router()

rutaDeEmpleado.get('/listarEmpleado/:identificacion',validarToken,listarEmpleado)
rutaDeEmpleado.put("/EmpleadoMood/Registrar/:id",validarToken,validarRR, RegistrarE);
rutaDeEmpleado.put("/EmpleadoMood/actividad/:id", validarToken , Empleado);


export  {rutaDeEmpleado} ;