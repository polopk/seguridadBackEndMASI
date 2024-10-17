const jwt = require('jsonwebtoken');

const mysqlConnection  = require('../src/database');

const ValidarJWT = async (req, res, next)=>{
    const token = req.header('Tok');
    if(!token){
        return res.status(401).json({
            msg: "No hay token en la petición",
        })
    }
    try {
        const {uid} = jwt.verify(token, process.env.secretOrPrivateKey);
        await mysqlConnection.query('SELECT * FROM Usuario WHERE idUsuario = ?', uid, (err, respuestas) =>{
            if(!respuestas[0]){
                return res.status(401).json({
                    msg: "Usuario no valido",
                })
            }
            if(respuestas[0].Estado_idEstado === 2 ){
                return res.status(401).json({
                    msg: "Usuario no valido",
                }) 
            }
            req.UsuarioLog = respuestas[0];
            next();
        });
    } catch (error) {
        return res.status(401).json({
            msg: "Token No Valido",
        }) 
    }
}

module.exports={
    ValidarJWT
}