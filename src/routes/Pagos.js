const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');
const { ValidarJWT } = require('../../middleware/validar-jwt.js');
const { TieneModulo, PermisoVer, PermisoEliminar, PermisoInsertar, PermisoActualizar } = require('../../middleware/validar-roles.js');
const { validarCampos } = require('../../middleware/validarcampos.js');
const { check } = require('express-validator');

// Obtener todos los Pagos 
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM Pagos', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

// Obtener un Pagos 
router.get('/:Empleado_idEmpleado', [
  ValidarJWT
], (req, res) => {
  const { Empleado_idEmpleado } = req.params; 
  mysqlConnection.query('SELECT p.idPagos, p.Monto, p.TipoDocumento, p.NoDocumento, DATE_FORMAT(p.Fecha,"%Y-%m-%d") as Fecha, p.TipoPago_idTipoPago, p.Empleado_idEmpleado, t.TipoDePago, CONCAT(e.Nombre, " ",  e.Apellido) AS Nombre FROM Pagos p  INNER JOIN TipoPago t ON p.TipoPago_idTipoPago = t.idTipoPago  INNER JOIN Empleado e ON p.Empleado_idEmpleado = e.idEmpleado  WHERE Empleado_idEmpleado = ?', [Empleado_idEmpleado], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

// Eliminar un Pagos 
router.delete('/:idPagos',[
  ValidarJWT,
  TieneModulo(34),
  PermisoEliminar(1)
], (req, res) => {
  const { idPagos } = req.params;
  mysqlConnection.query('DELETE FROM Pagos WHERE idPagos = ?', [idPagos], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Pago de planilla Borrado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

// Insertar un Pagos 
router.post('/',[
  ValidarJWT,
  TieneModulo(34),
  PermisoInsertar(1),
  check('Monto', 'Monto está vacío').not().isEmpty(),
  check('TipoDocumento', 'Tipo de Documento está vacío').not().isEmpty(),
  check('NoDocumento', 'No. de Documento está vacío').not().isEmpty(),
  check('Fecha', 'Fecha está vacía').not().isEmpty(),
  validarCampos
], (req, res) => {
  const {idPagos, Monto, TipoDocumento, NoDocumento, Fecha, TipoPago_idTipoPago, Empleado_idEmpleado} = req.body;
  const query = `INSERT INTO Pagos ( Monto, TipoDocumento, NoDocumento, Fecha, TipoPago_idTipoPago, Empleado_idEmpleado) VALUES ( ?, ?, ?, ?, ?, ?);`;
  mysqlConnection.query(query, [Monto, TipoDocumento, NoDocumento, Fecha, TipoPago_idTipoPago, Empleado_idEmpleado], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Pago de Planilla Insertado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

router.put('/:idPagos',[
  ValidarJWT,
  TieneModulo(34),
  PermisoActualizar(1)
], async (req, res) => {
  const { Monto, TipoDocumento, NoDocumento, Fecha, TipoPago_idTipoPago, Empleado_idEmpleado} = req.body;
  const pagosp = {Monto, TipoDocumento, NoDocumento, Fecha, TipoPago_idTipoPago, Empleado_idEmpleado};
  const { idPagos } = req.params;
  await mysqlConnection.query(
    "UPDATE Pagos SET ? WHERE idPagos = ?",
     [pagosp, idPagos],
     (error, resultado) => {
      if (error) throw error;
      res.status(201).json({
        msg: "Actualizado Exitosamente"
      });
     }
  );
});

module.exports = router;