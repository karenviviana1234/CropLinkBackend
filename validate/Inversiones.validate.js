import { check } from "express-validator";


export const Validateinversiones=[
    check('fk_id_programacion','campos obligatorios ys solo recibe numeros').not().isEmpty().isInt().isNumeric(),
    check('fk_id_costos','campos obligatorios y deben ser numeros').not().isEmpty().isInt().isNumeric(),

]

export const actualizar =[
    check('fk_id_programacion','ingrese el id de algun recurso y solo recibe numeros').optional().isInt().isNumeric(),
    check('fk_id_costos', 'solo recibe numeros').optional().not().isEmpty().isInt().isNumeric(),
]

//nn

