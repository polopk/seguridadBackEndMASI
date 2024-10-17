const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');
const { ValidarJWT } = require('../../middleware/validar-jwt.js');
const { TieneModulo, PermisoVer, PermisoEliminar, PermisoInsertar, PermisoActualizar } = require('../../middleware/validar-roles.js');
const { check } = require('express-validator');
const { validarCampos } = require('../../middleware/validarcampos.js');

// Obtener todos los ManoObra 
router.get('/', [
  ValidarJWT,
  TieneModulo(27),
  PermisoVer(1),
], 
(req, res) => {
  mysqlConnection.query('SELECT idManodeObra, DATE_FORMAT(Fecha,"%Y-%m-%d") as Fecha, Precio, Cantidad, Descripcion, NoInforme, Factura, TipoManoObra, Medidas, Total, Proyecto_idProyecto, NombreProyecto FROM ManoObra INNER JOIN Proyecto ON Proyecto_idProyecto = idProyecto;', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

// Obtener un ManoObra 
router.get('/:Proyecto_idProyecto', [
  ValidarJWT,
], 
 (req, res) => {
  const { Proyecto_idProyecto } = req.params; 
  mysqlConnection.query('SELECT m.idManodeObra, DATE_FORMAT(m.Fecha,"%Y-%m-%d") as Fecha, m.Precio, m.Cantidad, m.Descripcion, m.NoInforme, m.Factura, m.TipoManoObra, m.Medidas, m.Total, m.Proyecto_idProyecto, p.NombreProyecto FROM ManoObra m INNER JOIN Proyecto p ON m.Proyecto_idProyecto = p.idProyecto WHERE m.Proyecto_idProyecto = ?', [Proyecto_idProyecto], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

// Eliminar un ManoObra 
router.delete('/:idManodeObra',
[
  ValidarJWT,
  TieneModulo(27),
  PermisoEliminar(1),
],  (req, res) => {
  const { idManodeObra } = req.params;
  mysqlConnection.query('DELETE FROM ManoObra WHERE idManodeObra = ?', [idManodeObra], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Mano de Obra Borrado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

// Insertar un ManoObra 
router.post('/', 
[
  ValidarJWT,
  TieneModulo(27),
  PermisoInsertar(1),
  check('Precio', 'El Precio está vacío').not().isEmpty(),
  check('Fecha', 'La Fecha está vacía').not().isEmpty(),
  check('Cantidad', 'La Cantidad está vacía').not().isEmpty(),
  check('Descripcion', 'La Descripcion está vacía').not().isEmpty(),
  check('NoInforme', 'El Número de Informe estpa vacío').not().isEmpty(),
  check('Factura', 'La Factura está vacía').not().isEmpty(),
  check('TipoManoObra', 'El Tipo de Mano de Obra está vacía').not().isEmpty(),
  check('Medidas', 'Medidas está vacía').not().isEmpty(),
  validarCampos,
], (req, res) => {
  const { Fecha, Precio, Cantidad, Descripcion, NoInforme, Factura, TipoManoObra, Medidas, Total, Proyecto_idProyecto} = req.body;
  const total = Precio * Cantidad;
  const query = `INSERT INTO ManoObra ( Fecha, Precio, Cantidad, Descripcion, NoInforme, Factura, TipoManoObra, Medidas, Total, Proyecto_idProyecto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
  mysqlConnection.query(query, [ Fecha, Precio, Cantidad, Descripcion, NoInforme, Factura, TipoManoObra, Medidas, total, Proyecto_idProyecto], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Mano de Obra Insertado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

router.put('/:idManodeObra', [
  ValidarJWT,
  TieneModulo(27),
  PermisoActualizar(1),
],async (req, res) => {
  
  const {Precio, Fecha, Cantidad, Descripcion, NoInforme, Factura, TipoManoObra, Medidas, Proyecto_idProyecto} = req.body;
  const total = Precio * Cantidad;
  const obras = {Precio, Fecha, Cantidad, Descripcion, NoInforme, Factura, TipoManoObra, Medidas, total, Proyecto_idProyecto};
  const { idManodeObra } = req.params;
  
  await mysqlConnection.query(
    "UPDATE ManoObra SET ? WHERE idManodeObra = ?",
     [obras, idManodeObra],
     (error, resultado) => {
      if (error) throw error;
      res.status(201).json({
        msg: "Actualizado Exitosamente"
      });
     }
  );
   
  });


module.exports = router;