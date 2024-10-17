const express = require('express');
const { check } = require('express-validator');
const { ValidarJWT } = require('../../middleware/validar-jwt.js');
const { TieneModulo, PermisoVer, PermisoEliminar, PermisoActualizar, PermisoInsertar } = require('../../middleware/validar-roles.js');
const { validarCampos } = require('../../middleware/validarcampos.js');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// Obtener todos los Cliente 
router.get('/', [
  ValidarJWT,
  TieneModulo(25),
  PermisoVer(1),
], (req, res) => {
  mysqlConnection.query('SELECT * FROM Cliente', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

// Obtener un Cliente 
router.get('/:idCliente',
[
  ValidarJWT,
  TieneModulo(25),
  PermisoVer(1)
], (req, res) => {
  const { idCliente } = req.params; 
  mysqlConnection.query('SELECT * FROM Cliente WHERE idCliente = ?', [idCliente], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      console.log(err);
    }
  });
});

// Eliminar un Cliente 
router.delete('/:idCliente',
[
  ValidarJWT,
  TieneModulo(25),
  PermisoEliminar(1)
], (req, res) => {
  const { idCliente } = req.params;
  mysqlConnection.query('DELETE FROM Cliente WHERE idCliente = ?', [idCliente], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Cliente Borrado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

// Insertar un Cliente 
router.post('/', 
[
  ValidarJWT,
  TieneModulo(25),
  PermisoInsertar(1),
  check('Empresa', 'Empresa está vacía').not().isEmpty(),
  check('Encargado', 'Encargado está vacío').not().isEmpty(),
  check('Direccion', 'Dirección está vacía').not().isEmpty(),
  check('NIT', 'NIT está vacío').not().isEmpty(),
  check('NoTelefono', 'No. de Teléfono está vacía').not().isEmpty(),
  validarCampos
],(req, res) => {
  const {idCliente, Empresa, Encargado, Direccion, NIT,  NoTelefono} = req.body;
  const query = `INSERT INTO Cliente (Empresa, Encargado, Direccion, NIT, NoTelefono) VALUES (?, ?, ?, ?, ?);`;
  mysqlConnection.query(query, [Empresa, Encargado, Direccion, NIT, NoTelefono], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Cliente Insertado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

router.put('/:idCliente', 
[
  ValidarJWT,
  TieneModulo(25),
  PermisoActualizar(1)
], async (req, res) => {
  const { Empresa, Encargado, Direccion, NIT, NoTelefono} = req.body;
  const Clientes = { Empresa, Encargado, Direccion, NIT, NoTelefono};
  const { idCliente } = req.params;
  await mysqlConnection.query(
    "UPDATE Cliente SET ? WHERE idCliente = ?",
     [Clientes, idCliente],
     (error, resultado) => {
      if (error) throw error;
      res.status(201).json({
        msg: "Actualizado Exitosamente"
      });
     }
  );
  });


module.exports = router;