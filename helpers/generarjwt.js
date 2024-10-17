const jwt = require('jsonwebtoken');


const Generarjwt = (uid = "")=>{
    return new Promise((resolve, reject) => {
        const payload = {uid};
        jwt.sign(payload, process.env.secretOrPrivateKey, {
            expiresIn: '5h'
        }, (err, token)=>{
            if(err){
                console.log(err)
                reject('No se pudo generar el token')
            }
            else {
                resolve(token)
            }
        })
    })
}


const GenerarJWTPassword = (uid = "")=>{
    return new Promise((resolve, reject) => {
        const payload = {uid};
        jwt.sign(payload, process.env.secretOrPrivateKey, {
            expiresIn: 15*60
        }, (err, token)=>{
            if(err){
                console.log(err)
                reject('No se pudo generar el token')
            }
            else {
                resolve(token)
            }
        })
    })
}

module.exports={
    Generarjwt,
    GenerarJWTPassword
}