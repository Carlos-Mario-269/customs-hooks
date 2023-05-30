/**
 * Rutas de Usuarios / Auth
 * host + /api/auth
 */

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router(); 
const { creatUser, loginUser, revalidateToken } = require('../controllers/auth');
const { fieldsValidators } = require('../middlewares/fieldsValidator');
const { jwtValidator } = require('../middlewares/jwtValidator');


router.post(
    '/new', 
    [//middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        fieldsValidators
    ], 
    creatUser
);

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de 6 caracyeres').isLength({ min: 6 }),
        fieldsValidators
    ], 
    loginUser
);

router.get('/renew', jwtValidator, revalidateToken);

module.exports = router;