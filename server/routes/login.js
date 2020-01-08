const express = require('express');
//Declarando bcrypt
//const bcrypt = require('bcrypt');

//Declarando jsonwebtoken
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario')
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "(Usuario) o contraseña incorrecto"
                }
            });
        }
        //validdando la contraseña con Bycript

        // if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
        //     return res.status(400).json({
        //         ok: false,
        //         err: {
        //             message: "Usuario o (contraseña) incorrecta"
        //         }
        //     });
        // }

        if (body.password === usuarioDB.password) {

            let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

            res.json({
                ok: true,
                usuario: usuarioDB,
                token
            });

        } else {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o (contraseña) incorrecta"
                }
            });
        }

    });
});

module.exports = app;