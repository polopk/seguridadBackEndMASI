const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');
const { ValidarJWT } = require('../../middleware/validar-jwt.js');
const { TieneModulo, PermisoVer, PermisoEliminar, PermisoInsertar, PermisoActualizar } = require('../../middleware/validar-roles.js');
const { validarCampos } = require('../../middleware/validarcampos.js');
const { check } = require('express-validator');

// Obtener todos los GastosVarios 
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM GastosVarios', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

// Obtener un GastosVarios 
router.get('/:Proyecto_idProyecto', [
ValidarJWT,
],(req, res) => {
  const { Proyecto_idProyecto } = req.params; 
  mysqlConnection.query('SELECT g.idGastos, DATE_FORMAT(g.Fecha,"%Y-%m-%d") as Fecha, g.Factura, g.Proveedor, g.Material, g.Cantidad, g.CostoU, g.Ubicacion, g.Total, g.Proyecto_idProyecto, p.NombreProyecto FROM GastosVarios g INNER JOIN Proyecto p ON g.Proyecto_idProyecto = p.idProyecto WHERE Proyecto_idProyecto = ?', [Proyecto_idProyecto], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

// Eliminar un GastosVarios 
router.delete('/:idGastos', [
  ValidarJWT,
  TieneModulo(29),
  PermisoEliminar(1),
], (req, res) => {
  const { idGastos } = req.params;
  mysqlConnection.query('DELETE FROM GastosVarios WHERE idGastos = ?', [idGastos], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Gastos Varios Borrado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

// Insertar un GastosVarios 
router.post('/', [
  ValidarJWT,
  TieneModulo(29),
  PermisoInsertar(1),
  check('Fecha', 'Fecha está vacía').not().isEmpty(),
  check('Factura', 'Factura está vacía').not().isEmpty(),
  check('Proveedor', 'Proveedor está vacío').not().isEmpty(),
  check('Material', 'Material está vacío').not().isEmpty(),
  check('Cantidad', 'Cantidad está vacía').not().isEmpty(),
  check('CostoU', 'Costo Unitario está vacío').not().isEmpty(),
  check('Ubicacion', 'Ubicación está vacía').not().isEmpty(),
  validarCampos
], (req, res) => {
  const {idGastos, Fecha, Factura, Proveedor, Material, Cantidad, CostoU, Ubicacion, Total, Proyecto_idProyecto} = req.body;
  const total = Cantidad * CostoU;
  const query = `INSERT INTO GastosVarios (Fecha, Factura, Proveedor, Material, Cantidad, CostoU, Ubicacion, Total, Proyecto_idProyecto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
  mysqlConnection.query(query, [Fecha, Factura, Proveedor, Material, Cantidad, CostoU, Ubicacion, total, Proyecto_idProyecto], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Gastos Varios Insertado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

router.put('/:idGastos', [
  ValidarJWT,
  TieneModulo(29),
  PermisoActualizar(1),
],async (req, res) => {
  const {Fecha, Factura, Proveedor, Material, Cantidad, CostoU, Ubicacion, Total, Proyecto_idProyecto} = req.body;
  const total = Cantidad * CostoU;
  const gastos = {Fecha, Factura, Proveedor, Material, Cantidad, CostoU, Ubicacion, total, Proyecto_idProyecto};
  const { idGastos } = req.params;
  
  await mysqlConnection.query(
    "UPDATE GastosVarios SET ? WHERE idGastos = ?",
     [gastos, idGastos],
     (error, resultado) => {
      if (error) throw error;
      res.status(201).json({
        msg: "Actualizado Exitosamente"
      });
     }
  );
   
  });


module.exports = router;