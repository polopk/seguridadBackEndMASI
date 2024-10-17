const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');
const { ValidarJWT } = require('../../middleware/validar-jwt.js');
const { TieneModulo, PermisoVer, PermisoEliminar, PermisoInsertar, PermisoActualizar } = require('../../middleware/validar-roles.js');
const { validarCampos } = require('../../middleware/validarcampos.js');
const { check } = require('express-validator');
// Obtener todos los Combustible 
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM Combustible', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

// Obtener un Combustible 
router.get('/:Proyecto_idProyecto', 
[
ValidarJWT
], (req, res) => {
  const { Proyecto_idProyecto } = req.params; 
  mysqlConnection.query('SELECT c.idCombustible, DATE_FORMAT(c.Fecha,"%Y-%m-%d") as Fecha, c.Cantidad, c.Proveedor, c.Valor, c.NoFactura, c.Total, c.Vehiculos_Maquinaria_idVehiculo, c.Proyecto_idProyecto, c.TipoCombustible_idTipoCombustible, v.Tipo, p.NombreProyecto, t.TipoCombustible FROM Combustible c INNER JOIN Vehiculos_Maquinaria v ON c.Vehiculos_Maquinaria_idVehiculo = v.idVehiculo INNER JOIN Proyecto p ON c.Proyecto_idProyecto = p.idProyecto INNER JOIN TipoCombustible t ON c.TipoCombustible_idTIpoCombustible = t.idTipoCombustible  WHERE Proyecto_idPRoyecto = ?', [Proyecto_idProyecto], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

// Eliminar un Combustible 
router.delete('/:idCombustible',[
  ValidarJWT,
  TieneModulo(23),
  PermisoEliminar(1),
  ],  (req, res) => {
  const { idCombustible } = req.params;
  mysqlConnection.query('DELETE FROM Combustible WHERE idCombustible = ?', [idCombustible], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Combustible Borrado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

// Insertar un Combustible 
router.post('/', [
  ValidarJWT,
  TieneModulo(23),
  PermisoInsertar(1),
  check('Fecha', 'Fecha está vacía').not().isEmpty(),
  check('Cantidad', 'Cantidad está vacía').not().isEmpty(),
  check('Proveedor', 'Proveedor está vacío').not().isEmpty(),
  check('Valor', 'Valor está vacío').not().isEmpty(),
  check('NoFactura', 'No. de Factura está vacía').not().isEmpty(),
  validarCampos
  ],(req, res) => {
  const {idCombustible, Fecha, Cantidad,  Proveedor, Valor, NoFactura, Total, Vehiculos_Maquinaria_idVehiculo, Proyecto_idProyecto, TipoCombustible_idTipoCombustible} = req.body;
  const total = Cantidad * Valor;
  const query = `INSERT INTO Combustible (Fecha, Cantidad,  Proveedor, Valor, NoFactura, Total, Vehiculos_Maquinaria_idVehiculo, Proyecto_idProyecto, TipoCombustible_idTipoCombustible) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
  mysqlConnection.query(query, [Fecha, Cantidad,  Proveedor, Valor, NoFactura, total, Vehiculos_Maquinaria_idVehiculo, Proyecto_idProyecto, TipoCombustible_idTipoCombustible], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Combustible Insertado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

router.put('/:idCombustible', [
  ValidarJWT,
  TieneModulo(23),
  PermisoActualizar(1),
  ],async (req, res) => {
  const {Fecha, Cantidad,  Proveedor, Valor, NoFactura, Total, Vehiculos_Maquinaria_idVehiculo, Proyecto_idProyecto, TipoCombustible_idTipoCombustible} = req.body;
  const total = Cantidad * Valor;
  const Combustibles = {Fecha, Cantidad,  Proveedor, Valor, NoFactura, total, Vehiculos_Maquinaria_idVehiculo, Proyecto_idProyecto, TipoCombustible_idTipoCombustible};
  const { idCombustible } = req.params;
  
  await mysqlConnection.query(
    "UPDATE Combustible SET ? WHERE idCombustible = ?",
     [Combustibles, idCombustible],
     (error, resultado) => {
      if (error) throw error;
      res.status(201).json({
        msg: "Actualizado exitosamente"
      });
     }
  );
   
  });


module.exports = router;