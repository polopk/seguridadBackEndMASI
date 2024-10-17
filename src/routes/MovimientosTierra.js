const express = require('express');
const { ValidarJWT } = require('../../middleware/validar-jwt.js');
const { PermisoInsertar, TieneModulo, PermisoEliminar, PermisoActualizar } = require('../../middleware/validar-roles.js');
const { validarCampos } = require('../../middleware/validarcampos.js');
const { check } = require('express-validator');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// Obtener todos los MovimientosTierra 
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM MovimientosTierra', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

// Obtener un MovimientosTierra 
router.get('/:Proyecto_idProyecto', [
  ValidarJWT,
  TieneModulo(28),
],(req, res) => {
  const { Proyecto_idProyecto } = req.params; 
  mysqlConnection.query('SELECT t.idMovimiento, t.MetrosCubicos, t.Trabajo, t.Descripcion, t.Area, t.BaseCompactada, t.Proyecto_idProyecto, p.NombreProyecto FROM MovimientosTierra t INNER JOIN Proyecto p ON t.Proyecto_idProyecto = p.idProyecto WHERE t.Proyecto_idProyecto = ?', [Proyecto_idProyecto], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

// Eliminar un MovimientosTierra 
router.delete('/:idMovimiento', [
  ValidarJWT,
  TieneModulo(28),
  PermisoEliminar(1)
],
(req, res) => {
  const { idMovimiento } = req.params;
  mysqlConnection.query('DELETE FROM MovimientosTierra WHERE idMovimiento = ?', [idMovimiento], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Movimiento de Tierra Borrado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

// Insertar un MovimientosTierra 
router.post('/', [
  ValidarJWT,
  TieneModulo(28),
  PermisoInsertar(1),
  check('NoFactura', 'Número de Factura está vacío').not().isEmpty(),
  check('MetrosCubicos', 'Metros Cúbicos está vacío').not().isEmpty(),
  check('Trabajo', 'Trabajo está vacío').not().isEmpty(),
  check('Descripcion', 'Descripción está vacía').not().isEmpty(),
  check('Area', 'Area está vacía').not().isEmpty(),
  check('BaseCompactada', 'Base Compactada está vacía').not().isEmpty(),
  validarCampos,
], (req, res) => {
  const {idMovimiento, NoFactura, MetrosCubicos, Trabajo, Descripcion, Area, BaseCompactada, Proyecto_idProyecto} = req.body;
  const query = `INSERT INTO MovimientosTierra ( NoFactura, MetrosCubicos, Trabajo, Descripcion, Area, BaseCompactada, Proyecto_idProyecto) VALUES ( ?, ?, ?, ?, ?, ?, ?);`;
  mysqlConnection.query(query, [NoFactura, MetrosCubicos, Trabajo, Descripcion, Area, BaseCompactada, Proyecto_idProyecto], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Movimiento de Tierra Insertado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

router.put('/:idMovimiento', [
  ValidarJWT,
  TieneModulo(28),
  PermisoActualizar(1)
], async (req, res) => {
  const {NoFactura, MetrosCubicos, Trabajo, Descripcion, Area, BaseCompactada, Proyecto_idProyecto} = req.body;
  const movimientos = {NoFactura, MetrosCubicos, Trabajo, Descripcion, Area, BaseCompactada, Proyecto_idProyecto};
  const { idMovimiento } = req.params;
  
  await mysqlConnection.query(
    "UPDATE MovimientosTierra SET ? WHERE idMovimiento = ?",
     [movimientos, idMovimiento],
     (error, resultado) => {
      if (error) throw error;
      res.status(201).json({
        msg: "Actualizado Exitosamente"
      });
     }
  );
   
  });


module.exports = router;