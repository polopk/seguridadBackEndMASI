const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const {check} = require('express-validator');

const mysqlConnection  = require('../database.js');
const { validarCampos } = require('../../middleware/validarcampos.js');
const { esRolvalido, esCorreoValido, UsuarioExiste, RolExiste, EstadoExiste, EmpleadoExiste, EmpleadoUsuarioExiste } = require('../../helpers/db_validaciones.js');
const { ValidarJWT } = require('../../middleware/validar-jwt.js');
const { esAdminRol, TieneModulo, PermisoVer, PermisoEliminar, PermisoActualizar, PermisoInsertar } = require('../../middleware/validar-roles.js');

// Obtener todos los Usuario 
router.get('/', [
  ValidarJWT,
  TieneModulo(1),
  PermisoVer(1)
], (req, res) => {
  mysqlConnection.query('SELECT n.idUsuario, n.Correo, n.Contrasenia, n.Rol_idRol,n.Estado_idEstado, n.Empleado_idEmpleado, z.Rol, a.Estado, concat (b.Nombre, " ", b.Apellido) as Nombre FROM Usuario n INNER JOIN Rol z ON z.idRol = n.Rol_idRol inner join Estado a on a.idEstado= n.Estado_idEstado inner join Empleado b on b.idEmpleado = n.Empleado_idEmpleado WHERE n.Estado_idEstado = 1', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

router.get('/Inactivos', 
[
  ValidarJWT,
  TieneModulo(1),
  PermisoVer(1)
],(req, res) => {
  mysqlConnection.query('SELECT n.idUsuario, n.Correo, n.Contrasenia, n.Rol_idRol,n.Estado_idEstado, n.Empleado_idEmpleado, z.Rol, a.Estado, concat (b.Nombre, " ", b.Apellido) as Nombre FROM Usuario n INNER JOIN Rol z ON z.idRol = n.Rol_idRol inner join Estado a on a.idEstado= n.Estado_idEstado inner join Empleado b on b.idEmpleado = n.Empleado_idEmpleado WHERE n.Estado_idEstado = 2', (err, rows, fields) => {
    if(!err) {
      res.json(rows);

      
    } else {
      console.log(err);
    }
  });  
});

// Obtener un Usuario 
router.get('/:idUsuario', [  TieneModulo(1), check('idUsuario').custom(UsuarioExiste),
  validarCampos,
  ValidarJWT,
  TieneModulo(1),
  PermisoVer(1)
], (req, res) => {

  const { idUsuario } = req.params; 
  mysqlConnection.query('SELECT * FROM Usuario WHERE Estado_idEstado = 1 AND idUsuario = ?', [idUsuario], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      res.status(201).json({
        msg: "No existe el usuario"
      });
    }
  });
});

// Eliminar un Usuario 
router.delete('/:idUsuario', [
  ValidarJWT,  
  TieneModulo(1),
  PermisoEliminar(1), 
  check('idUsuario').custom(UsuarioExiste)], (req, res) => {
  const { idUsuario } = req.params;
    mysqlConnection.query('UPDATE Usuario SET Estado_idEstado = ? WHERE idUsuario = ?', [2, idUsuario], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Usuario Borrado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

// Eliminar un Usuario 
router.delete('/Inactivos/:idUsuario', [
  ValidarJWT,  
  TieneModulo(1),
  PermisoEliminar(1), 
  check('idUsuario').custom(UsuarioExiste)], (req, res) => {
  const { idUsuario } = req.params;
    mysqlConnection.query('UPDATE Usuario SET Estado_idEstado = ? WHERE idUsuario = ?', [1, idUsuario], (err, rows, fields) => {
    if(!err) {
      mysqlConnection.query('SELECT * FROM Usuario  WHERE idUsuario = ?', [idUsuario], (err, rows, fields) => {
        if(!err) {
      console.log()

      mysqlConnection.query('UPDATE Empleado SET Estado_idEstado = ? WHERE idEmpleado = ?', [1,rows[0].Empleado_idEmpleado], (err, rows, fields) => {
        if(!err) {
          res.json({status: 'Activado'});
        } else {
          console.log(err);
        }
      });
        } else {
          console.log(err);
        }
      });
    } else {
      console.log(err);
    }
  });
});

// Insertar un Usuario 
router.post('/', [ 
ValidarJWT,
TieneModulo(1),
PermisoInsertar(1),
check('Correo', 'No es un Correo valido').isEmail().custom(esCorreoValido),
check('Contrasenia', 'La Contraseña es obligatoria').not().isEmpty(),
check('Contrasenia', 'La Contraseña debe tener un minimo de 8 digitos').isLength({min:8, max:20}),
check('Contrasenia', 'La Contraseña debe incluir caracteres especiales (- . , # @ $ !)').isAlphanumeric('es-ES', {ignore:'\s - . , # @ $ !'}),
check('Rol_idRol').custom(esRolvalido),
check('Rol_idRol').custom(RolExiste),
check('Empleado_idEmpleado').custom(EmpleadoExiste),
check('Empleado_idEmpleado').custom(EmpleadoUsuarioExiste),
validarCampos
], async (req, res)=>  {
  const {idUsuario, Correo, Contrasenia, Rol_idRol, Estado_idEstado, Empleado_idEmpleado } = req.body;

  const nuevoUsuario = {Correo, Contrasenia, Rol_idRol, Estado_idEstado, Empleado_idEmpleado};
  nuevoUsuario.Estado_idEstado = 1;
  //Encriptar Contrasenia 
  const salt = bcrypt.genSaltSync(10);
        nuevoUsuario.Contrasenia = bcrypt.hashSync(Contrasenia, salt);

    //guardar en base de datos
    await mysqlConnection.query(
         "INSERT INTO Usuario SET ?",
         [nuevoUsuario],
         (error, resultado) => {
           if (error) throw error;
           res.status(201).json({
             msg: "Ingresado Exitosamente"
           });
         }
       );
});

router.put('/:idUsuario', [
ValidarJWT, 
TieneModulo(1),
PermisoActualizar(1),
check('Correo', 'No es un Correo valido').isEmail(),
check('idUsuario').custom(UsuarioExiste),
check('Rol_idRol').custom(RolExiste),
check('Empleado_idEmpleado').custom(EmpleadoExiste),
validarCampos
], async (req, res)=>  {
  const ids = req.params.idUsuario;
  const { Correo, Contrasenia, Rol_idRol, Estado_idEstado, Empleado_idEmpleado } = req.body;
  const newuser = { Correo, Contrasenia, Rol_idRol, Estado_idEstado, Empleado_idEmpleado };
  const pass = { Correo, Rol_idRol, Estado_idEstado, Empleado_idEmpleado };

  await mysqlConnection.query(
    "SELECT * FROM Usuario WHERE Correo = ? AND idUsuario !=?; ",
    [Correo, ids],
    async (err, resu) => {
      if (err) throw error;
      if (resu.length > 0) {
        res.status(401).json({
          msg: "Correo ya registrado",
        });
      } else {
        if (Contrasenia) {
          const salt = bcrypt.genSaltSync(10);
          newuser.Contrasenia = bcrypt.hashSync(Contrasenia, salt);
          await mysqlConnection.query(
            "UPDATE Usuario SET ? WHERE idUsuario=?",
            [newuser, ids],
            (err, resu) => {
              if (err) throw error;
            }
          );
        } else if (Contrasenia== "" || !Contrasenia) {
          await mysqlConnection.query(
            "UPDATE Usuario SET ? WHERE idUsuario=?",
            [pass, ids],
            (err, resu) => {
              if (err) throw error;
            }
          );
        }

        res.status(201).json({
          msg: "Actualizado Exitosamente",
          Usuario: pass,
        });
      }
    }
  );
});



module.exports = router;