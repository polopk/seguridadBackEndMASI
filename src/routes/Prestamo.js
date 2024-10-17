const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');
const { ValidarJWT } = require('../../middleware/validar-jwt.js');
const { TieneModulo, PermisoVer, PermisoEliminar, PermisoInsertar, PermisoActualizar } = require('../../middleware/validar-roles.js');
const { validarCampos } = require('../../middleware/validarcampos.js');
const { check } = require('express-validator');

// Obtener todos los Prestamo 
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM Prestamo', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

// Obtener un Prestamo 
router.get('/:Empleado_idEmpleado', [
  ValidarJWT
], (req, res) => {
  const { Empleado_idEmpleado } = req.params; 
  mysqlConnection.query('SELECT idPrestamo, DATE_FORMAT(Fecha,"%Y-%m-%d") as Fecha, ValorPrestamo, Restante, Empleado_idEmpleado, CONCAT(Nombre, " ",  Apellido) AS Nombre FROM Prestamo  INNER JOIN Empleado ON Empleado_idEmpleado = idEmpleado WHERE Empleado_idEmpleado = ?', [Empleado_idEmpleado], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

// Eliminar un Prestamo 
router.delete('/:idPrestamo',[
  ValidarJWT,
  TieneModulo(36),
  PermisoEliminar(1)
], (req, res) => {
  const { idPrestamo } = req.params;
  mysqlConnection.query('DELETE FROM Prestamo WHERE idPrestamo = ?', [idPrestamo], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Prestamo Borrado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

// Insertar un Prestamo 
router.post('/', [
  ValidarJWT,
  TieneModulo(36),
  PermisoInsertar(1),
  check('Fecha', 'Fecha está vacía').not().isEmpty(),
  check('ValorPrestamo', 'Valo de rPrestamo está vacío').not().isEmpty(),
  validarCampos
], (req, res) => {
  const {idPrestamo, Fecha, ValorPrestamo, Restante, Empleado_idEmpleado} = req.body;
  const Restant = ValorPrestamo;
  const query = `INSERT INTO Prestamo ( Fecha, ValorPrestamo, Restante, Empleado_idEmpleado) VALUES ( ?, ?, ?, ?);`;
  mysqlConnection.query(query, [Fecha, ValorPrestamo, Restant, Empleado_idEmpleado], (err, rows, fields) => {
    
    if(!err) {
      res.json({status: 'Prestamo Insertado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

router.put('/:idPrestamo',
[
  ValidarJWT,
  TieneModulo(36),
  PermisoActualizar(1)
], async (req, res) => {
  const { Fecha, ValorPrestamo, Restante, Empleado_idEmpleado} = req.body;
  const Prestamos = {Fecha, ValorPrestamo, Restante, Empleado_idEmpleado};
  const { idPrestamo } = req.params;
  await mysqlConnection.query(
    "UPDATE Prestamo SET ? WHERE idPrestamo = ?",
     [Prestamos, idPrestamo],
     (error, resultado) => {
      if (error) throw error;
      res.status(201).json({
        msg: "Actualizado Exitosamente"
      });
     }
  );
});

module.exports = router;