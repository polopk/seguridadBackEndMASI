const express = require('express');
const { check } = require('express-validator');
const { TipoPagoExiste, DpiExiste, NoAfiliacionExiste, NITExiste } = require('../../helpers/db_validaciones.js');
const { ValidarJWT } = require('../../middleware/validar-jwt.js');
const { TieneModulo, PermisoVer, PermisoEliminar, PermisoInsertar, PermisoActualizar } = require('../../middleware/validar-roles.js');
const { validarCampos } = require('../../middleware/validarcampos.js');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// Obtener todos los Empleado 
router.get('/', [
  ValidarJWT,
  TieneModulo(2),
  PermisoVer(1),
], (req, res) => {
  mysqlConnection.query('Select idEmpleado, Nombre, Apellido, DATE_FORMAT(FechaNacimiento,"%Y-%m-%d") as FechaNacimiento, EstadoCivil, Direccion, Profesion, DPI, Telefono, NoAfiliacion, NIT, DATE_FORMAT(FechaInicio,"%Y-%m-%d")  as FechaInicio, DATE_FORMAT(FechaFin,"%Y-%m-%d")as FechaFin , Estado, Estado_idEstado , Puesto, TipoPago_idTipoPago, TipoDePago FROM Empleado INNER JOIN TipoPago ON TipoPago_idTipoPago = idTipoPago INNER JOIN Estado on Estado_idEstado = idEstado WHERE Estado_idEstado = 1', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

router.get('/EmpleadosI', [
  ValidarJWT,
  TieneModulo(2),
  PermisoVer(1),
], (req, res) => {
  mysqlConnection.query('Select idEmpleado, Nombre, Apellido, DATE_FORMAT(FechaNacimiento,"%Y-%m-%d") as FechaNacimiento, EstadoCivil, Direccion, Profesion, DPI, Telefono, NoAfiliacion, NIT, DATE_FORMAT(FechaInicio,"%Y-%m-%d")  as FechaInicio, DATE_FORMAT(FechaFin,"%Y-%m-%d")as FechaFin , Estado, Estado_idEstado , Puesto, TipoPago_idTipoPago, TipoDePago FROM Empleado INNER JOIN TipoPago ON TipoPago_idTipoPago = idTipoPago INNER JOIN Estado on Estado_idEstado = idEstado WHERE Estado_idEstado = 2', (err, rows, fields) => {
    if(!err) {
      console.log(rows)
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

// Obtener un Empleado 
router.get('/:idEmpleado', [
  ValidarJWT,
  TieneModulo(2),
  PermisoVer(1),
],
(req, res) => {
  const { idEmpleado } = req.params; 
  mysqlConnection.query('SELECT * FROM Empleado WHERE idEmpleado = ?', [idEmpleado], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      console.log(err);
    }
  });
});

// Eliminar un Empleado 
router.delete('/:idEmpleado',[
  ValidarJWT,
  TieneModulo(2),
PermisoEliminar(1)], 
  (req, res) => {
  const { idEmpleado } = req.params;
  mysqlConnection.query('Delete FROM Empleado WHERE idEmpleado = ?', [idEmpleado], (err, rows, fields) => {
    if (!err) {
      res.json({status: 'Empleado Borrado Exitosamente'});
    } else {
      mysqlConnection.query('UPDATE Empleado SET Estado_idEstado = ? WHERE idEmpleado = ?', [2,idEmpleado], (err, rows, fields) => {
        if(!err) {
          mysqlConnection.query('UPDATE Usuario SET Estado_idEstado = ? WHERE Empleado_idEmpleado = ?', [2,idEmpleado], (err, rows, fields) => {
            if(!err) {
              res.json({status: 'Empleado desactivado'});
            } else {
              console.log(err);
            }
          });
        } else {
          console.log(err);
        }
      });
    }
   })
  });

// Insertar un Empleado 
router.post('/', [  
  ValidarJWT,
  TieneModulo(2),
  PermisoInsertar(1),
  check('Nombre', 'El Nombre está vacío').not().isEmpty(),
  check('Apellido', 'El Apellido está vacío').not().isEmpty(),
  check('FechaNacimiento', 'La fecha de nacimiento está vacía').not().isEmpty(),
  check('EstadoCivil', 'El Estado Civil está vacío').not().isEmpty(),
  check('Direccion', 'La Dirección está vacía').not().isEmpty(),
  check('Profesion', 'La profesión está vacía').not().isEmpty(),
  check('DPI', 'El DPI está vacío').not().isEmpty(),
  check('DPI').custom( DpiExiste),
  check('Telefono', 'El teléfono está vacío').not().isEmpty(),
  check('NoAfiliacion', 'El número de afiliación está vacío').not().isEmpty(),
  check('NoAfiliacion').custom(NoAfiliacionExiste),
  check('NIT', 'El NIT está vacío').not().isEmpty(),
  check('NIT').custom( NITExiste),
  check('FechaInicio', 'La Fecha de Inicio está vacía').not().isEmpty(),
  check('Puesto', 'El puesto está vacío').not().isEmpty(),
  check('Telefono', 'El Numero no puede contener más de 8 digitos').isLength({max:8}),
  check('TipoPago_idTipoPago').custom(TipoPagoExiste),
  check('DPI', 'El Numero de DPI debe contener 13 digitos').isLength({min:13, max:13}),
  validarCampos], (req, res) => {
  const {idEmpleado, Nombre, Apellido, FechaNacimiento, EstadoCivil, Direccion, Profesion, DPI, Telefono, NoAfiliacion, NIT, FechaInicio, FechaFin, Puesto, TipoPago_idTipoPago} = req.body;
  // const query = `INSERT INTO Empleado (Nombre, Apellido, FechaNacimiento, EstadoCivil, Direccion, Profesion, DPI, Telefono, NoAfiliacion, NIT, FechaInicio, FechaFin, Puesto, TipoPago_idTipoPago, Estado_idEstado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);`;
  //  mysqlConnection.query(query, [ Nombre, Apellido, FechaNacimiento, EstadoCivil, Direccion, Profesion, DPI, Telefono, NoAfiliacion, NIT, FechaInicio, FechaFin, Puesto, TipoPago_idTipoPago, 1], (err, rows, fields) => {
  
  const query = `INSERT INTO Empleado (Nombre, Apellido, FechaNacimiento, EstadoCivil, Direccion, Profesion, DPI, Telefono, NoAfiliacion, NIT, FechaInicio, FechaFin, Puesto, TipoPago_idTipoPago) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
  mysqlConnection.query(query, [ Nombre, Apellido, FechaNacimiento, EstadoCivil, Direccion, Profesion, DPI, Telefono, NoAfiliacion, NIT, FechaInicio, FechaFin, Puesto, TipoPago_idTipoPago], (err, rows, fields) => {
  if(!err) {
      res.json({status: 'Empleado Insertado'});
    } else {
      console.log(err);
    }
  });
});

router.put('/:idEmpleado',[
  ValidarJWT,
  TieneModulo(2),
  PermisoActualizar(1),
], async (req, res) => {
  
  const {Nombre, Apellido, FechaNacimiento, EstadoCivil, Direccion, Profesion, DPI, Telefono, NoAfiliacion, NIT, FechaInicio, FechaFin, Puesto, TipoPago_idTipoPago} = req.body;
  const Empleados = {Nombre, Apellido, FechaNacimiento, EstadoCivil, Direccion, Profesion, DPI, Telefono, NoAfiliacion, NIT, FechaInicio, FechaFin, Puesto, TipoPago_idTipoPago};
  const { idEmpleado } = req.params;
  
  await mysqlConnection.query(
    "UPDATE Empleado SET ? WHERE idEmpleado = ?",
     [Empleados, idEmpleado],
     (error, resultado) => {
      if (error) throw error;
      res.status(201).json({
        msg: "Actualizado exitosamente"
      });
     }
  );
   
  });


module.exports = router;