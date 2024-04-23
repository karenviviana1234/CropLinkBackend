/* import { Router } from "express";
import { listarFinca, RegistroFinca, ActualizarFinca, BuscarFinca } from "../controllers/Finca.controller.js";
import { validarFincaA } from "../../validate/Finca_validate.js";
import { validarFincaR } from "../../validate/Finca_validate.js";
import { validarToken } from "../controllers/autenticacion.js";

const router = Router();

router.get("/listarFinca", validarToken, listarFinca);
router.post("/RegistroFinca", validarToken, validarFincaR, RegistroFinca);
router.put("/actualizarFinca/:id", validarToken, validarFincaA, ActualizarFinca);
router.get("/buscarFinca/:id", validarToken, BuscarFinca);

export default router;
 */

import { Router } from "express";
import { listarFinca, RegistroFinca, ActualizarFinca, BuscarFinca, desactivarF } from "../controllers/Finca.controller.js";
/* import { validarFincaA } from "../../validate/Finca_validate.js";
import { validarFincaR } from "../../validate/Finca_validate.js"; */
import { validarToken } from "../controllers/autenticacion.js";

const router = Router();

router.get("/listarFinca", validarToken, listarFinca);
router.post("/RegistroFinca", validarToken, /* validarFincaR, */ RegistroFinca);
router.put("/actualizarFinca/:id", validarToken, /* validarFincaA */ ActualizarFinca);
router.get("/buscarFinca/:id",  BuscarFinca);
router.put("/desactivarFinca/:id", validarToken, /* validarFincaA */ desactivarF);

export default router;
//nn