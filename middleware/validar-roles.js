const mysqlConnection  = require('../src/database');

const esAdminRol = (req, res, next) =>{
   const {idUsuario, Rol_idRol} = req.UsuarioLog;
    if(Rol_idRol != 1){
        return res.status(401).json({
            msg: `${idUsuario} No es Administrador`
        })
    }
}

const TieneModulo = (...roles)=>{
    return async (req, res, next) =>{
        req.roles = roles;
        if(!req.UsuarioLog){
            return res.status(500).json({
                msg: 'Se requiere verificar el rol sin mandar el token'
            })
        }
        const {Rol_idRol} = req.UsuarioLog;
        await mysqlConnection.query('SELECT idRol_Modulo, Ver, Insertar, Eliminar, Actualizar, Modulo_idModulo, Rol_idRol, Estado_idEstado FROM Rol_Modulo JOIN Rol ON Rol_Modulo.Rol_idRol = Rol.idRol where Rol.Estado_idEstado=1 and Rol_idRol=?;', Rol_idRol, (error, respuesta)=>{
            if(respuesta.length <= 0){
                return res.status(401).json({
                    msg: `No tienes permiso para realizar esta acción`
                })
            }
            const modulos = respuesta.map(function (rol) {
                return rol.Modulo_idModulo;
            });
            const modulo = modulos.toString();
            if(!modulo.includes(roles)){
                return res.status(401).json({
                    msg: `No tienes permiso para realizar esta acción`
                })
            }
            next();
        })
        
    }
}

const PermisoVer = (...ver)=>{
    return async (req, res, next) =>{
        
        if(!req.UsuarioLog){
            return res.status(500).json({
                msg: 'Se requiere verificar el rol sin mandar el token'
            })
        }
        const modulo = req.roles[0];
        const {Rol_idRol} = req.UsuarioLog;
        await mysqlConnection.query('SELECT idRol_Modulo, Ver, Insertar, Eliminar, Actualizar, Modulo_idModulo, Rol_idRol, Estado_idEstado FROM Rol_Modulo JOIN Rol ON Rol_Modulo.Rol_idRol = Rol.idRol where Rol.Estado_idEstado=1 and Rol_idRol=? and Modulo_idModulo=?', [Rol_idRol, modulo], (error, respuesta)=>{
           if(respuesta[0].Ver != ver){
            return res.status(401).json({
                msg: `No tienes permiso para ver este módulo`
            }) 
           }  
            next();
        })
        
    }
}

const PermisoEliminar = (...eliminar)=>{
    return async (req, res, next) =>{
        
        if(!req.UsuarioLog){
            return res.status(500).json({
                msg: 'Se requiere verificar el rol sin mandar el token'
            })
        }
        const modulo = req.roles[0];
        const {Rol_idRol} = req.UsuarioLog;
        await mysqlConnection.query('SELECT idRol_Modulo, Ver, Insertar, Eliminar, Actualizar, Modulo_idModulo, Rol_idRol, Estado_idEstado FROM Rol_Modulo JOIN Rol ON Rol_Modulo.Rol_idRol = Rol.idRol where Rol.Estado_idEstado=1 and Rol_idRol=? and Modulo_idModulo=?;', [Rol_idRol, modulo], (error, respuesta)=>{
           if(respuesta[0].Eliminar != eliminar){
            return res.status(401).json({
                msg: `No tienes permiso para realizar esta acción`
            }) 
           }  
            next();
        })
        
    }
}

const PermisoActualizar = (...actualizar)=>{
    return async (req, res, next) =>{
        
        if(!req.UsuarioLog){
            return res.status(500).json({
                msg: 'Se requiere verificar el rol sin mandar el token'
            })
        }
        const modulo = req.roles[0];
        const {Rol_idRol} = req.UsuarioLog;
        await mysqlConnection.query('SELECT idRol_Modulo, Ver, Insertar, Eliminar, Actualizar, Modulo_idModulo, Rol_idRol, Estado_idEstado FROM Rol_Modulo JOIN Rol ON Rol_Modulo.Rol_idRol = Rol.idRol where Rol.Estado_idEstado=1 and Rol_idRol=? and Modulo_idModulo=?;', [Rol_idRol, modulo], (error, respuesta)=>{
           if(respuesta[0].Actualizar != actualizar){
            return res.status(401).json({
                msg: `No tienes permiso para realizar esta acción`
            }) 
           }  
            next();
        })
        
    }
}

const PermisoInsertar = (...insertar)=>{
    return async (req, res, next) =>{
        
        if(!req.UsuarioLog){
            return res.status(500).json({
                msg: 'Se requiere verificar el rol sin mandar el token'
            })
        }
      
        const modulo = req.roles[0];
     
        const {Rol_idRol} = req.UsuarioLog;
       
        await mysqlConnection.query('SELECT idRol_Modulo, Ver, Insertar, Eliminar, Actualizar, Modulo_idModulo, Rol_idRol, Estado_idEstado FROM Rol_Modulo JOIN Rol ON Rol_Modulo.Rol_idRol = Rol.idRol where Rol.Estado_idEstado=1 and Rol_idRol=? and Modulo_idModulo=?;', [Rol_idRol, modulo], (error, respuesta)=>{
           if(respuesta[0].Insertar != insertar){
            return res.status(401).json({
                msg: `No tienes permiso para realizar esta acción`
            }) 
           }  
            next();
        })
        
    }
}

module.exports ={
    esAdminRol,
    TieneModulo,
    PermisoVer,
    PermisoEliminar,
    PermisoActualizar,
    PermisoInsertar
}