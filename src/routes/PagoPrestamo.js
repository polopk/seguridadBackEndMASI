const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');
const { ValidarJWT } = require('../../middleware/validar-jwt.js');
const { TieneModulo, PermisoVer, PermisoEliminar, PermisoInsertar, PermisoActualizar } = require('../../middleware/validar-roles.js');
const { validarCampos } = require('../../middleware/validarcampos.js');
const { check } = require('express-validator');

// Obtener todos los PagoPrestamo 
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT idPagoPrestamo, Monto, DATE_FORMAT(fecha,"%Y/%m/%d") as Fecha, Prestamo_idPrestamo FROM PagoPrestamo', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

// Obtener un PagoPrestamo 
router.get('/:Prestamo_idPrestamo',[
  ValidarJWT
], (req, res) => {
  const { Prestamo_idPrestamo } = req.params; 
  mysqlConnection.query('SELECT p.idPagoPrestamo, p.Monto, DATE_FORMAT(p.Fecha,"%Y-%m-%d") as Fecha, p.Prestamo_idPrestamo, r.Restante FROM PagoPrestamo p INNER JOIN Prestamo r ON p.Prestamo_idPrestamo = r.idPrestamo WHERE p.Prestamo_idPrestamo = ?', [Prestamo_idPrestamo], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

// Eliminar un PagoPrestamo 
router.delete('/:idPagoPrestamo',[
  ValidarJWT,
  TieneModulo(37),
  PermisoEliminar(1)
], (req, res) => {
  const { idPagoPrestamo } = req.params;
  mysqlConnection.query('DELETE FROM PagoPrestamo WHERE idPagoPrestamo = ?', [idPagoPrestamo], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Pago de prestamo Borrado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

// Insertar un PagoPrestamo 
router.post('/', [
  ValidarJWT,
  TieneModulo(37),
  PermisoInsertar(1),
  check('Monto', 'Monto está vacío').not().isEmpty(),
  check('Fecha', 'Fecha está vacía').not().isEmpty(),
  validarCampos
],(req, res) => {
  const {idPagoPrestamo, Monto, Fecha, Prestamo_idPrestamo} = req.body;
  const query = `INSERT INTO PagoPrestamo ( Monto, Fecha, Prestamo_idPrestamo) VALUES (?, ?, ?);`;
  mysqlConnection.query(query, [ Monto, Fecha, Prestamo_idPrestamo], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Pago de Prestamo Insertado Exitosamente'});
    } else {
      res.json({status: err.sqlMessage});
    }
  });
});

router.put('/:idPagoPrestamo',[
  ValidarJWT,
  TieneModulo(37),
  PermisoActualizar(1)
], async (req, res) => {
  const { Monto, Fecha, Prestamo_idPrestamo} = req.body;
  const pagosprestamos = {Monto, Fecha, Prestamo_idPrestamo};
  const { idPagoPrestamo } = req.params;
  await mysqlConnection.query(
    "UPDATE PagoPrestamo SET ? WHERE idPagoPrestamo = ?",
     [pagosprestamos, idPagoPrestamo],
     (error, resultado) => {
      if (error) throw error;
      res.status(201).json({
        msg: "Actualizado Exitosamente"
      });
     }
  );
});

module.exports = router;