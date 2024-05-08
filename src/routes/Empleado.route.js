import { Router } from "express";
import {  listarEmpleado, RegistrarE,Empleado } from "../controllers/Empleado.controller.js";
import { validarRR } from "../../validate/Empleadovalidate.js";

import {validarToken} from "../controllers/autenticacion.js";


const rutaDeEmpleado = Router()

//localhost:3000/empleado
 rutaDeEmpleado.get("/EmpleadoMood/Listar/:identificacion",validarToken, listarEmpleado); 
rutaDeEmpleado.put("/EmpleadoMood/Registrar/:id",validarToken,validarRR, RegistrarE);
rutaDeEmpleado.put("/EmpleadoMood/actividad/:id", validarToken , Empleado);


export  {rutaDeEmpleado} ;