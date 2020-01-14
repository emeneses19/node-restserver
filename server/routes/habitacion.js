const express = require('express');

const { VerificarToken } = require('../middlewares/autenticacion');


let app = express();
let Habitacion = require('../models/habitacion');


// ===========================
//  Obtener Habitacions
// ===========================
app.get('/habitacions', VerificarToken, (req, res) => {
    // trae todos los Habitacions
    // populate: usuario categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Habitacion.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, habitacions) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                habitacions
            });


        })

});

// ===========================
//  Obtener un Habitacion por ID
// ===========================
app.get('/habitacions/:id', (req, res) => {
    // populate: usuario categoria
    // paginado
    let id = req.params.id;

    Habitacion.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, habitacionDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!habitacionDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                habitacion: habitacionDB
            });

        });

});

// ===========================
//  Buscar Habitacions
// ===========================
app.get('/habitacions/buscar/:termino', VerificarToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');
    //Habitacion.find({ numero: regex, disponible: true }) para poner mas condiciones
    Habitacion.find({ numero: regex })
        .populate('categoria', 'nombre')
        .exec((err, habitacions) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                habitacions
            })

        })


});



// ===========================
//  Crear un nuevo Habitacion
// ===========================
app.post('/habitaciones', VerificarToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado 

    let body = req.body;

    let habitacion = new Habitacion({
        usuario: req.usuario._id,
        numero: body.numero,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    habitacion.save((err, habitacionDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            habitacion: habitacionDB
        });

    });

});

// ===========================
//  Actualizar un Habitacion
// ===========================
app.put('/habitaciones/:id', VerificarToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado 

    let id = req.params.id;
    let body = req.body;

    Habitacion.findById(id, (err, habitacionDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!habitacionDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        habitacionDB.numero = body.numero;
        habitacionDB.precioUni = body.precioUni;
        habitacionDB.categoria = body.categoria;
        habitacionDB.disponible = body.disponible;
        habitacionDB.descripcion = body.descripcion;

        habitacionDB.save((err, habitacionGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                habitacion: habitacionGuardado
            });

        });

    });


});

// ===========================
//  Borrar un Habitacion
// ===========================
app.delete('/habitacions/:id', VerificarToken, (req, res) => {

    let id = req.params.id;

    Habitacion.findById(id, (err, habitacionDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!habitacionDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        habitacionDB.disponible = false;

        habitacionDB.save((err, habitacionBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                Habitacion: habitacionBorrado,
                mensaje: 'Habitacion borrado'
            });

        })

    })


});


module.exports = app;