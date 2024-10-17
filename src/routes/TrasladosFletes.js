const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');
const { ValidarJWT } = require('../../middleware/validar-jwt.js');
const { TieneModulo, PermisoVer, PermisoEliminar, PermisoInsertar, PermisoActualizar } = require('../../middleware/validar-roles.js');
const { validarCampos } = require('../../middleware/validarcampos.js');
const { check } = require('express-validator');

// Obtener todos los TrasladosFletes 
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT idTraslado, DATE_FORMAT(Fecha,"%Y-%m-%d") as Fecha, Cantidad, TipoTraslado, ValorU, Factura, Nombre, LugarProcedencia, Medida, Total, Proyecto_idProyecto FROM TrasladosFletes', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

// Obtener un TrasladosFletes 
router.get('/:Proyecto_idProyecto', [
  ValidarJWT
], (req, res) => {
  const { Proyecto_idProyecto } = req.params; 
  mysqlConnection.query('SELECT t.idTraslado, DATE_FORMAT(t.Fecha,"%Y-%m-%d") as Fecha, t.Cantidad, t.TipoTraslado, t.ValorU, t.Factura, t.Nombre, t.LugarProcedencia, t.Medida, t.Total, t.Proyecto_idProyecto, p.NombreProyecto FROM TrasladosFletes t INNER JOIN Proyecto p ON t.Proyecto_idProyecto = p.idProyecto WHERE t.Proyecto_idProyecto = ?', [Proyecto_idProyecto], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

// Eliminar un TrasladosFletes 
router.delete('/:idTraslado', [
ValidarJWT,
TieneModulo(39),
PermisoEliminar(1)
], (req, res) => {
  const { idTraslado } = req.params;
  mysqlConnection.query('DELETE FROM TrasladosFletes WHERE idTraslado = ?', [idTraslado], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Traslados y Fletes Borrado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

// Insertar un TrasladosFletes 
router.post('/', [
  ValidarJWT,
  TieneModulo(39),
  PermisoInsertar(1),
  check('Fecha', 'La Fecha está vacía').not().isEmpty(),
  check('Cantidad', 'La Cantidad está vacía').not().isEmpty(),
  check('TipoTraslado', 'El Tipo de Traslado está vacío').not().isEmpty(),
  check('ValorU', 'El Valor U está vacío').not().isEmpty(),
  check('TipoTraslado', 'El Tipo de Traslado está vacío').not().isEmpty(),
  check('Factura', 'La Factura está vacía').not().isEmpty(),
  check('Nombre', 'El Nombre está vacío').not().isEmpty(),
  check('LugarProcedencia', 'El Lugar de Procedencia está vacío').not().isEmpty(),
  check('Medida', 'La Medida está vacía').not().isEmpty(),
  validarCampos,
], (req, res) => {
  const {Fecha, Cantidad, TipoTraslado, ValorU, Factura, Nombre, LugarProcedencia, Medida, Total, Proyecto_idProyecto} = req.body;
  const total = ValorU * Cantidad;
  const query = `INSERT INTO TrasladosFletes (Fecha, Cantidad, TipoTraslado, ValorU, Factura, Nombre, LugarProcedencia, Medida, Total, Proyecto_idProyecto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
  mysqlConnection.query(query, [ Fecha, Cantidad, TipoTraslado, ValorU, Factura, Nombre, LugarProcedencia, Medida, total, Proyecto_idProyecto], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Traslados y Fletes Insertado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

router.put('/:idTraslado', [
  ValidarJWT,
  TieneModulo(39),
  PermisoActualizar(1),
], async (req, res) => {
  const {Fecha, Cantidad, TipoTraslado, ValorU, Factura, Nombre, LugarProcedencia, Medida, Total, Proyecto_idProyecto} = req.body;
  const total = ValorU * Cantidad;
  const TrasladosFletess = {Fecha, Cantidad, TipoTraslado, ValorU, Factura, Nombre, LugarProcedencia, Medida, total, Proyecto_idProyecto};
  const { idTraslado } = req.params;
  
  await mysqlConnection.query(
    "UPDATE TrasladosFletes SET ? WHERE idTraslado = ?",
     [TrasladosFletess, idTraslado],
     (error, resultado) => {
      if (error) throw error;
      res.status(201).json({
        msg: "Actualizado Exitosamente"
      });
     }
  );
   
  });


module.exports = router;