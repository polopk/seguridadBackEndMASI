const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');

const { ValidarJWT } = require('../../middleware/validar-jwt.js');
const { TieneModulo, PermisoVer, PermisoEliminar, PermisoInsertar, PermisoActualizar } = require('../../middleware/validar-roles.js');
const { validarCampos } = require('../../middleware/validarcampos.js');
const { check } = require('express-validator');

// Obtener todos los Ingresos 
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM Ingresos', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

// Obtener un Ingresos 
router.get('/:Proyecto_idProyecto', [
  ValidarJWT
], (req, res) => {
  const { Proyecto_idProyecto } = req.params; 
  mysqlConnection.query('SELECT i.idIngresos, DATE_FORMAT(i.Fecha,"%Y-%m-%d") as Fecha, i.NoFactura, i.Retenciones, i.Porcentaje, i.Descripcion, i.Proyecto_idProyecto, p.NombreProyecto FROM Ingresos i INNER JOIN Proyecto p ON i.Proyecto_idProyecto = p.idProyecto WHERE i.Proyecto_idProyecto = ?', [Proyecto_idProyecto], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

// Eliminar un Ingresos 
router.delete('/:idIngresos', [
  ValidarJWT,
  TieneModulo(31),
  PermisoEliminar(1),
],(req, res) => {
  const { idIngresos } = req.params;
  mysqlConnection.query('DELETE FROM Ingresos WHERE idIngresos = ?', [idIngresos], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Ingreso Borrado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

// Insertar un Ingresos 
router.post('/',[
  ValidarJWT,
  TieneModulo(31),
  PermisoInsertar(1),
  check('Fecha', 'Fecha está vacía').not().isEmpty(),
  check('NoFactura', 'No. deFactura está vacío').not().isEmpty(),
  check('Retenciones', 'Retenciones está vacía').not().isEmpty(),
  check('Porcentaje', 'Porcentaje está vacío').not().isEmpty(),
  check('Descripcion', 'Descripción está vacía').not().isEmpty(),
  validarCampos
], (req, res) => {
  const {idIngresos, Fecha, NoFactura, Retenciones, Porcentaje,  Descripcion, Proyecto_idProyecto} = req.body;
  const query = `INSERT INTO Ingresos (Fecha, NoFactura, Retenciones, Porcentaje, Descripcion, Proyecto_idProyecto) VALUES (?, ?, ?, ?, ?, ?);`;
  mysqlConnection.query(query, [Fecha, NoFactura, Retenciones, Porcentaje, Descripcion, Proyecto_idProyecto], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Ingreso Insertado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

router.put('/:idIngresos', [
  ValidarJWT,
  TieneModulo(31),
  PermisoActualizar(1),
], async (req, res) => {
  const { Fecha, NoFactura, Retenciones, Porcentaje, Descripcion, Proyecto_idProyecto} = req.body;
  const ingreso = { Fecha, NoFactura, Retenciones, Porcentaje, Descripcion, Proyecto_idProyecto}; 
  const { idIngresos } = req.params;
 
  await mysqlConnection.query(
    "UPDATE Ingresos SET ? WHERE idIngresos = ?",
     [ingreso, idIngresos],
     (error, resultado) => {
      if (error) throw error;
      res.status(201).json({
        msg: "Actualizado Exitosamente"
      });
     }
  );
});

module.exports = router;