const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');
const { ValidarJWT } = require('../../middleware/validar-jwt.js');
const { TieneModulo, PermisoVer, PermisoEliminar, PermisoInsertar, PermisoActualizar } = require('../../middleware/validar-roles.js');
const { validarCampos } = require('../../middleware/validarcampos.js');
const { check } = require('express-validator');

// Obtener todos los TipoCombustible 
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM TipoCombustible', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

// Obtener un TipoCombustible 
router.get('/:idTipoCombustible',
[
  ValidarJWT,
 
  ], (req, res) => {
  const { idTipoCombustible } = req.params; 
  mysqlConnection.query('SELECT * FROM TipoCombustible WHERE idTipoCombustible = ?', [idTipoCombustible], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      console.log(err);
    }
  });
});

// Eliminar un TipoCombustible 
router.delete('/:idTipoCombustible', [
  ValidarJWT,
  TieneModulo(24),
  PermisoEliminar(1)
  ],(req, res) => {
  const { idTipoCombustible } = req.params;
  mysqlConnection.query('DELETE FROM TipoCombustible WHERE idTipoCombustible = ?', [idTipoCombustible], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'TipoCombustible Borrado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

// Insertar un TipoCombustible 
router.post('/', [
  ValidarJWT,
  TieneModulo(24),
  PermisoInsertar(1),
  check('TipoCombustible', 'Tipo de Combustible está vacío').not().isEmpty(),
  validarCampos
  ],(req, res) => {
  const {idTipoCombustible, TipoCombustible} = req.body;
  const query = `INSERT INTO TipoCombustible ( TipoCombustible) VALUES (?);`;
  mysqlConnection.query(query, [TipoCombustible], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'TipoCombustible Insertado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

router.put('/:idTipoCombustible', [
  ValidarJWT,
  TieneModulo(24),
  PermisoActualizar(1)
  ],async (req, res) => {
  const { TipoCombustible} = req.body;
  const TipoCombustiblees = {TipoCombustible}; 
  const { idTipoCombustible } = req.params;

    await mysqlConnection.query(
    "UPDATE TipoCombustible SET ? WHERE idTipoCombustible = ?",
     [TipoCombustiblees, idTipoCombustible],
     (error, resultado) => {
      if (error) throw error;
      res.status(201).json({
        msg: "Actualizado Exitosamente"
      });
     }
  );
});

module.exports = router;
