var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var habitacionSchema = new Schema({
    numero: { type: String, required: [true, 'El número es necesario'] },
    precioUni: { type: Number, required: [true, 'El precio por noche es necesario'] },
    descripcion: { type: String, required: false },
    img: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});


module.exports = mongoose.model('Habitacion', habitacionSchema);