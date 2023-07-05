/**
 * Rutas de Eventos
 * /api/events
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { fieldsValidators } = require('../middlewares/fieldsValidator');

const { jwtValidator } = require('../middlewares/jwtValidator');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const router = Router(); 

//*Pasar todas por la validación del JWT
router.use(jwtValidator);

//*Obtener eventos
router.get('/', getEvents);

//*Crear evento
router.post(
    '/', 
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatorio').custom(isDate),
        check('end', 'La fecha de finalización es obligatorio').custom(isDate),
        fieldsValidators
    ],
    createEvent
);

//*Actualizar evento
router.put(
    '/:id', 
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatorio').custom(isDate),
        check('end', 'La fecha de finalización es obligatorio').custom(isDate),
        fieldsValidators
    ],
    updateEvent
);

//*Borrar evento
router.delete('/:id', deleteEvent);

module.exports = router;