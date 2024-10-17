const express = require('express');
const { check } = require('express-validator');
const { ValidarJWT } = require('../../middleware/validar-jwt.js');
const { TieneModulo, PermisoVer, PermisoEliminar, PermisoInsertar, PermisoActualizar } = require('../../middleware/validar-roles.js');
const { validarCampos } = require('../../middleware/validarcampos.js');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// Obtener todos los Vehiculos_Maquinaria 
router.get('/', 
[
  ValidarJWT,
  TieneModulo(21),
  PermisoVer(1)
],(req, res) => {

  mysqlConnection.query('SELECT * FROM Vehiculos_Maquinaria', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

// Obtener un Vehiculos_Maquinaria 
router.get('/:idVehiculo', 
[
  ValidarJWT,
  TieneModulo(21),
  PermisoVer(1)
],
(req, res) => {
  const { idVehiculo } = req.params; 
  mysqlConnection.query('SELECT * FROM Vehiculos_Maquinaria WHERE idVehiculo = ?', [idVehiculo], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      console.log(err);
    }
  });
});

// Eliminar un Vehiculos_Maquinaria 
router.delete('/:idVehiculo',
[
  ValidarJWT,
  TieneModulo(21),
  PermisoEliminar(1)
], (req, res) => {
  const { idVehiculo } = req.params;
  mysqlConnection.query('DELETE FROM Vehiculos_Maquinaria WHERE idVehiculo = ?', [idVehiculo], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Vehiculo Borrado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

// Insertar un Vehiculos_Maquinaria 
router.post('/', 
[
  ValidarJWT,
  TieneModulo(21),
  PermisoInsertar(1),
  check('Tipo', 'El Tipo está vacío').not().isEmpty(),
  check('Marca', 'La Marca está vacía').not().isEmpty(),
  check('Placa', 'La Placa está vacía').not().isEmpty(),
  check('Modelo', 'El Modelo está vacío').not().isEmpty(),
  check('NoSerie', 'El Número de Serie está vacío').not().isEmpty(),
  check('Aseguradora', 'La Seguridad está vacía').not().isEmpty(),
  validarCampos,
],(req, res) => {
  const {idVehiculo, Tipo, Marca, Placa, Modelo,  NoSerie, Aseguradora} = req.body;
  const query = `INSERT INTO Vehiculos_Maquinaria (Tipo, Marca, Placa, Modelo, NoSerie, Aseguradora) VALUES (?, ?, ?, ?, ?, ?);`;
  mysqlConnection.query(query, [Tipo, Marca, Placa, Modelo, NoSerie, Aseguradora], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Vehiculo Insertado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});


router.put('/:idVehiculo', [
  ValidarJWT,
  TieneModulo(21),
  PermisoActualizar(1),
],async (req, res) => {
  const {Tipo, Marca, Placa, Modelo, NoSerie, Aseguradora} = req.body;
  const vehiculos = {Tipo, Marca, Placa, Modelo, NoSerie, Aseguradora};
  const { idVehiculo } = req.params;
  await mysqlConnection.query(
    "UPDATE Vehiculos_Maquinaria SET ? WHERE idVehiculo = ?",
     [vehiculos, idVehiculo],
     (error, resultado) => {
      if (error) throw error;
      res.status(201).json({
        msg: "Actualizado Exitosamente"
      });
     }
  );
});

module.exports = router;