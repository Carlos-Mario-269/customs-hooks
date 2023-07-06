const { response } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { triggerJWT } = require('../helpers/jwt');


const creatUser = async(req, res = response) => {

    const { email, password } = req.body;


    try {
        let user = await User.findOne({ email });
        
        if(user){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            });
        }

        user = new User(req.body);

        //*Encriptar password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        //*Generar JWT
        const token = await triggerJWT(user.id, user.name);

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

const loginUser = async(req, res = response) => {

    const {email, password} = req.body;

    try {

        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        //*Confirmar passwords
        const validPassword = bcrypt.compareSync(password, user.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        //*Generar JWT
        const token = await triggerJWT(user.id, user.name);

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

const revalidateToken = async(req, res = response) => {
    const { uid, name } = req;

    //*Generar nuevo JWT y retornarlo
    const token =  await triggerJWT(uid, name);

    res.json({
        ok: true,
        uid,
        name,
        token
    });
};

module.exports = {
    creatUser,
    loginUser,
    revalidateToken
}