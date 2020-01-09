// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;
// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  Vencimiento del token
// ============================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ============================
//  SEED de autenticacion
//60 seg, 60 m., 24 h., 30d.
// ============================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


// ============================
//  Base de datos
// ============================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    //urlDB = 'mongodb+srv://user1:user123@cluster0-iz59z.mongodb.net/test?retryWrites=true&w=majority';
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;


// ============================
//  Google client ID
// ============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '224734637439-i68vfcppepgo6h41vain1na2g0jv6ibc.apps.googleusercontent.com';