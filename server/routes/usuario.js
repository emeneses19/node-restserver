const express = require('express');
//Declarando bcrypt
//const bcrypt = require('bcrypt');

//***underscorejs para validar */
const _ = require('underscore');

const Usuario = require('../models/usuario')
const { VerificarToken, verificaAdminRole } = require('../middlewares/autenticacion');
const app = express();

app.get('/usuario', VerificarToken, (req, res) => {

    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // });

    //Para filtrar desde donde quiere 
    let desde = req.query.desde || 0;
    desde = Number(desde);
    // Condicionar el limite
    let limite = req.query.limite || 5;
    limite = Number(limite);

    //Entre comillas simples se esta especificando que camos queremos que nos liste
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde) ///salta en 5 en 5
        .limit(limite) //cuanto te va mostrar
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });


        });

});

app.post('/usuario', [VerificarToken, verificaAdminRole], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        //password: bcrypt.hashSync(body.password, 10) ,
        password: body.password,
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

    // if (body.nombre === undefined) {

    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario'
    //     });

    // } else {
    //     res.json({
    //         persona: body
    //     });
    // }

});

app.put('/usuario/:id', [VerificarToken, verificaAdminRole], (req, res) => {

    //Obteniendo el id
    let id = req.params.id;
    //Validando para actulizar datos los cuales van a permitir actualizar
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //Para no  permitir actualizar los datos validando 
    // delete body.password;
    // delete body.google;

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.delete('/usuario/:id', [VerificarToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };


    //Es para borrar totalmente de base de datos
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });
    // });

    //esto es una eliminacion pero solo activar o desactivar el estado
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

});

module.exports = app;