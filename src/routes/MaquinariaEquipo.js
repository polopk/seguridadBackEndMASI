const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');
const { ValidarJWT } = require('../../middleware/validar-jwt.js');
const { TieneModulo, PermisoVer, PermisoEliminar, PermisoInsertar, PermisoActualizar } = require('../../middleware/validar-roles.js');
const { validarCampos } = require('../../middleware/validarcampos.js');
const { check } = require('express-validator');

// Obtener todos los MaquinariaEquipo 
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM MaquinariaEquipo', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

// Obtener un MaquinariaEquipo 
router.get('/:Vehiculos_Maquinaria_idVehiculo', [
  ValidarJWT,
],(req, res) => {
  const { Vehiculos_Maquinaria_idVehiculo } = req.params; 
  mysqlConnection.query('SELECT idMaquinaria, DATE_FORMAT(FechaIngreso,"%Y-%m-%d") as FechaIngreso, CantidadCombustible, Inicia, Termina, CantidadHoras, DATE_FORMAT(FechaFin,"%Y-%m-%d") as FechaFin, Vehiculos_Maquinaria_idVehiculo, Tipo FROM MaquinariaEquipo INNER JOIN Vehiculos_Maquinaria ON Vehiculos_Maquinaria_idVehiculo = idVehiculo WHERE Vehiculos_Maquinaria_idVehiculo = ?', [Vehiculos_Maquinaria_idVehiculo], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

// Eliminar un MaquinariaEquipo 
router.delete('/:idMaquinaria', [
  ValidarJWT,
  TieneModulo(22),
  PermisoEliminar(1)
],(req, res) => {
  const { idMaquinaria } = req.params;
  mysqlConnection.query('DELETE FROM MaquinariaEquipo WHERE idMaquinaria = ?', [idMaquinaria], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Maquinaria Borrada Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

// Insertar un MaquinariaEquipo 
router.post('/',[
  ValidarJWT,
  TieneModulo(22),
  PermisoInsertar(1),
  check('FechaIngreso', 'Fecha Ingreso está vacía').not().isEmpty(),
  check('CantidadCombustible', 'Cantidad de Combustible está vacío').not().isEmpty(),
  check('Inicia', 'Inicia está vacío').not().isEmpty(),
  check('Termina', 'Termina está vacío').not().isEmpty(),
  check('FechaFin', 'Fecha Fin está vacío').not().isEmpty(),
  validarCampos
], (req, res) => {
  const {idMaquinaria, FechaIngreso, CantidadCombustible, Inicia, Termina,  CantidadHoras, FechaFin, Vehiculos_Maquinaria_idVehiculo} = req.body;
  const cantidadhoras = Termina - Inicia;
  const query = `INSERT INTO MaquinariaEquipo ( FechaIngreso, CantidadCombustible, Inicia, Termina, CantidadHoras, FechaFin, Vehiculos_Maquinaria_idVehiculo) VALUES (?, ?, ?, ?, ?, ?, ?);`;
  mysqlConnection.query(query, [FechaIngreso, CantidadCombustible, Inicia, Termina, cantidadhoras, FechaFin, Vehiculos_Maquinaria_idVehiculo], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Maquinaria Insertada Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

router.put('/:idMaquinaria', [
  ValidarJWT,
  TieneModulo(22),
  PermisoActualizar(1)
],
async (req, res) => {
  const { FechaIngreso, CantidadCombustible, Inicia, Termina, CantidadHoras, FechaFin, Vehiculos_Maquinaria_idVehiculo} = req.body;
  const cantidadhoras = Termina - Inicia;
  const maquinarias = {FechaIngreso, CantidadCombustible, Inicia, Termina, cantidadhoras, FechaFin, Vehiculos_Maquinaria_idVehiculo};
  const { idMaquinaria } = req.params;
  await mysqlConnection.query(
    "UPDATE MaquinariaEquipo SET ? WHERE idMaquinaria = ?",
     [maquinarias, idMaquinaria],
     (error, resultado) => {
      if (error) throw error;
      res.status(201).json({
        msg: "Actualizado exitosamente"
      });
     }
  );
});

module.exports = router;