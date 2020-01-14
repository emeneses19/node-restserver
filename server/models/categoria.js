const mongoose = require('mongoose');

//Para validar un dato unico
const uniqueValidator = require('mongoose-unique-validator');



//Declarando el esquema
let Schema = mongoose.Schema;
//Definir el esquema  --> con los datos que va a tener la coleccion
let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es obligatoria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});


//categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Categoria', categoriaSchema);