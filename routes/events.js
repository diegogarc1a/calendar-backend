const express = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');
const router = express.Router();

//Todas las peticiones deben pasar por JWT
router.use(validarJWT);

//Obtener eventos
router.get('/' , getEventos)

router.post('/',
    [
        check('title','El titulo es obligatorio').notEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de finalizacion es obligatoria').custom( isDate ),
        validarCampos
    ],
    crearEvento)

router.put('/:id', 
    [
        check('title','El titulo es obligatorio').notEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de finalizacion es obligatoria').custom( isDate ),
        validarCampos
    ],
    actualizarEvento)

router.delete('/:id', eliminarEvento)

module.exports = router;
