const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');
const { ValidarJWT } = require('../../middleware/validar-jwt.js');
const { TieneModulo, PermisoVer, PermisoEliminar, PermisoInsertar, PermisoActualizar } = require('../../middleware/validar-roles.js');
const { validarCampos } = require('../../middleware/validarcampos.js');
const { check } = require('express-validator');

// Obtener todos los Rol 
router.get('/', [
ValidarJWT
],
(req, res) => {
  mysqlConnection.query('SELECT idRol, Rol, Estado_idEstado, Estado FROM Rol INNER JOIN Estado ON Estado_idEstado = idEstado', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

// Obtener un Rol 
router.get('/:idRol', [
  ValidarJWT,
  ],(req, res) => {
  const { idRol } = req.params; 
  mysqlConnection.query('SELECT * FROM Rol WHERE idRol = ?', [idRol], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      console.log(err);
    }
  });
});

// Eliminar un Rol 
router.delete('/:idRol', [
  ValidarJWT,
  TieneModulo(33),
  PermisoEliminar(1)
  ],(req, res) => {
  const { idRol } = req.params;
  mysqlConnection.query('UPDATE Rol SET Estado_idEstado = ? WHERE idRol = ?', [2, idRol], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Rol Borrado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

// Insertar un Rol 
router.post('/',[
  ValidarJWT,
  TieneModulo(33),
  PermisoEliminar(1),
  check('Rol', 'Rol está vacío').not().isEmpty(),
  validarCampos
  ], (req, res) => {
  const {idRol, Rol, Estado_idEstado} = req.body;
  const query = `INSERT INTO Rol (Rol, Estado_idEstado) VALUES (?, ?);`;
  mysqlConnection.query(query, [ Rol, Estado_idEstado], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Rol Insertado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

router.put('/:idRol',[
  ValidarJWT,
  TieneModulo(33),
  PermisoActualizar(1)
  ], async (req, res) => {
  const { Rol} = req.body;
  const Roles = {Rol}; 
  const { idRol } = req.params;

    await mysqlConnection.query(
    "UPDATE Rol SET ? WHERE idRol = ?",
     [Roles, idRol],
     (error, resultado) => {
      if (error) throw error;
      res.status(201).json({
        msg: "Actualizado Exitosamente"
      });
     }
  );
});

module.exports = router;
