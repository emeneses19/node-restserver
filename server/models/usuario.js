const mongoose = require('mongoose');

//Para validar un dato unico
const uniqueValidator = require('mongoose-unique-validator');

//Declarando los roles válidos
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no esun Rol válido'
};

//Declarando el esquema
let Schema = mongoose.Schema;
//Definir el esquema  --> con los datos que va a tener la coleccion
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesario']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//Para no mostrar la contraseña encryptada
// usuarioSchema.methods.toJSON = function () {
//     let user = this;
//     let userObject = user.toObject();
//     delete userObject.password;
//     return userObject;

// }
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);