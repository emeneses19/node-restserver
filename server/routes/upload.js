const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Habitacion = require('../models/habitacion');
const fs = require('fs');
const paht = require('path');

// default options
app.use(fileUpload());
app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha selecionado ningun archivo'
            }
        });
    }



    //Validar tipo:

    let tiposValidos = ['habitaciones', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las tipos permitidas son: ' + tiposValidos.join(', ')
            }
        })
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;

    let nombreArchCortado = archivo.name.split('.');
    //console.log(nombreArchCortado);
    let extensionArchivo = nombreArchCortado[nombreArchCortado.length - 1];
    //console.log(extensionArchivo);

    //Validar extenciones permitidas
    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extencionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extenciones permitidas son: ' + extencionesValidas.join(', '),
                exte: extensionArchivo
            }
        })
    }


    //cambiar nombre al archivo

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`
    console.log(nombreArchivo);


    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${ tipo }/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //Aquí imagen cargada
        // res.json({
        //     ok: true,
        //     message: 'Imagen subida correctamente'
        // });

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenHabitacion(id, res, nombreArchivo);
        }

    });

});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        //Evaluando si existe el archivo
        //let pahtImagen = paht.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);
        //Para mantener el ultimo archivo que se va a cargar
        // if (fs.existsSync(pahtImagen)) {
        //     fs.unlinkSync(pahtImagen);
        // }
        borraArchivo(usuarioDB.img, 'usuarios');


        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })
    });
}

function imagenHabitacion(id, res, nombreArchivo) {
    Habitacion.findById(id, (err, habitacionDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'habitaciones');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!habitacionDB) {
            borraArchivo(nombreArchivo, 'habitaciones');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'habitacion no existe'
                }
            });
        }

        //Evaluando si existe el archivo
        //let pahtImagen = paht.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);
        //Para mantener el ultimo archivo que se va a cargar
        // if (fs.existsSync(pahtImagen)) {
        //     fs.unlinkSync(pahtImagen);
        // }
        borraArchivo(habitacionDB.img, 'habitaciones');


        habitacionDB.img = nombreArchivo;
        habitacionDB.save((err, habitacionGuardado) => {
            res.json({
                ok: true,
                usuahabitacion: habitacionGuardado,
                img: nombreArchivo
            });
        })
    });
}

function borraArchivo(nombreImagen, tipo) {
    //Evaluando si existe el archivo
    let pahtImagen = paht.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    //Para mantener el ultimo archivo que se va a cargar
    if (fs.existsSync(pahtImagen)) {
        fs.unlinkSync(pahtImagen);
    }
}


module.exports = app;