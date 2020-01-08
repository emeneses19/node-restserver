const jwt = require('jsonwebtoken')

// ============================
//  Verificar token
// ============================

let VerificarToken = (req, res, next) => {
    let token = req.get('token');
    console.log(token);

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();

    });
};

// ============================
//  Verificar token
// ============================

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

}

module.exports = {
    VerificarToken,
    verificaAdminRole
}