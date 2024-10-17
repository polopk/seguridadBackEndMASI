const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');
const { ValidarJWT } = require('../../middleware/validar-jwt.js');
const { TieneModulo, PermisoVer, PermisoEliminar, PermisoInsertar, PermisoActualizar } = require('../../middleware/validar-roles.js');
const { validarCampos } = require('../../middleware/validarcampos.js');
const { check } = require('express-validator');

// Obtener todos los PagoHrsExtra 
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM PagoHrsExtra', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

// Obtener un PagoHrsExtra 
router.get('/:Proyecto_idProyecto', [
ValidarJWT
], (req, res) => {
  const {Proyecto_idProyecto } = req.params; 
  mysqlConnection.query('SELECT p.idPagosHrs, p.Cargo, DATE_FORMAT(p.FechaInicio,"%Y-%m-%d") as FechaInicio, DATE_FORMAT(p.FechaFin,"%Y-%m-%d") as FechaFin, p.HrsRegistradas, p.PrecioHora, p.Total, p.Proyecto_idProyecto, p.Empleado_idEmpleado, r.NombreProyecto, CONCAT(e.Nombre," ", e.Apellido) AS Nombre FROM PagoHrsExtra p INNER JOIN Proyecto r ON p.Proyecto_idProyecto = r.idProyecto INNER JOIN Empleado e ON p.Empleado_idEmpleado = e.idEmpleado WHERE Proyecto_idProyecto= ?', [Proyecto_idProyecto], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

// Eliminar un PagoHrsExtra 
router.delete('/:idPagosHrs', [
  ValidarJWT,
  TieneModulo(32),
  PermisoEliminar(1)
  ], (req, res) => {
  const { idPagosHrs } = req.params;
  mysqlConnection.query('DELETE FROM PagoHrsExtra WHERE idPagosHrs = ?', [idPagosHrs], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Pago de Horas Extra Borrado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

// Insertar un PagoHrsExtra 
router.post('/', [
  ValidarJWT,
  TieneModulo(32),
  PermisoInsertar(1),
  check('Cargo', 'Cargo está vacío').not().isEmpty(),
  check('FechaInicio', 'Fecha Inicio está vacía').not().isEmpty(),
  check('FechaFin', 'Fech aFin está vacía').not().isEmpty(),
  check('HrsRegistradas', 'Horas Registradas está vacío').not().isEmpty(),
  check('PrecioHora', 'Precio por hora está vacío').not().isEmpty(),
  validarCampos
  ],
  (req, res) => {
  const {idPagosHrs, Cargo, FechaInicio, FechaFin, HrsRegistradas, PrecioHora, Total, Proyecto_idProyecto, Empleado_idEmpleado} = req.body;
  const total = HrsRegistradas * PrecioHora;
  const query = `INSERT INTO PagoHrsExtra ( Cargo, FechaInicio, FechaFin, HrsRegistradas, PrecioHora, Total, Proyecto_idProyecto, Empleado_idEmpleado) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
  mysqlConnection.query(query, [ Cargo, FechaInicio, FechaFin, HrsRegistradas, PrecioHora, total, Proyecto_idProyecto, Empleado_idEmpleado], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Pago de Horas Extra Insertado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

router.put('/:idPagosHrs',[
  ValidarJWT,
  TieneModulo(32),
  PermisoActualizar(1)
  ], async (req, res) => {
  const {Cargo, FechaInicio, FechaFin, HrsRegistradas, PrecioHora, Total, Proyecto_idProyecto, Empleado_idEmpleado} = req.body;
  const total = HrsRegistradas * PrecioHora;
  const PagoHrsExtras = {Cargo, FechaInicio, FechaFin, HrsRegistradas, PrecioHora, total, Proyecto_idProyecto, Empleado_idEmpleado};
  const { idPagosHrs } = req.params;
  
  await mysqlConnection.query(
    "UPDATE PagoHrsExtra SET ? WHERE idPagosHrs = ?",
     [PagoHrsExtras, idPagosHrs],
     (error, resultado) => {
      if (error) throw error;
      res.status(201).json({
        msg: "Actualizado Exitosamente"
      });
     }
  );
   
  });


module.exports = router;