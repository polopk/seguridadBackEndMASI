const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');
const { ValidarJWT } = require('../../middleware/validar-jwt.js');
const { TieneModulo, PermisoVer, PermisoEliminar, PermisoInsertar, PermisoActualizar } = require('../../middleware/validar-roles.js');
const { validarCampos } = require('../../middleware/validarcampos.js');
const { check } = require('express-validator');

// Obtener todos los Agregados 
router.get('/',  (req, res) => {
  mysqlConnection.query('SELECT Componentes, DATE_FORMAT(fecha,"%Y/%m/%d") as Fecha, CantidadRecibida, Tipo, NoFactura, OrdenCompra, Descripcion, ValorU, Total, Proyecto_idProyecto  FROM Agregados', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

// Obtener un Agregados 
router.get('/:Proyecto_idProyecto', [
ValidarJWT,
], (req, res) => {
  const { Proyecto_idProyecto } = req.params; 
  //mysqlConnection.query('SELECT * FROM Agregados WHERE idAgregados = ? and Fecha = DATE_FORMAT(CURDATE(), "%d/%m/%Y)"', [idAgregados], (err, rows, fields) => {
  mysqlConnection.query('SELECT a.idAgregados, a.Componentes, DATE_FORMAT(a.Fecha,"%Y-%m-%d") as Fecha, a.CantidadRecibida, a.Tipo, a.NoFactura, a.OrdenCompra, a.Descripcion, a.ValorU, a.Total, a.Proyecto_idProyecto, p.NombreProyecto FROM Agregados a INNER JOIN Proyecto p ON a.Proyecto_idProyecto = p.idProyecto WHERE a.Proyecto_idProyecto = ?', [Proyecto_idProyecto], (err, rows, fields) => {  
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

// Eliminar un Agregados 
router.delete('/:idAgregados', [
  ValidarJWT,
  TieneModulo(30),
  PermisoEliminar(1)
], (req, res) => {
  const { idAgregados } = req.params;
  mysqlConnection.query('DELETE FROM Agregados WHERE idAgregados = ?', [idAgregados], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Agregados Borrado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

// Insertar un Agregados 
router.post('/', [
  ValidarJWT,
  TieneModulo(30),
  PermisoInsertar(1),
  check('Componentes', 'Componentes está vacío').not().isEmpty(),
  check('Fecha', 'Fecha está vacía').not().isEmpty(),
  check('CantidadRecibida', 'Cantidad Recibida está vacía').not().isEmpty(),
  check('Tipo', 'Tipo está vacío').not().isEmpty(),
  check('NoFactura', 'No. de factura está vacío').not().isEmpty(),
  check('OrdenCompra', 'Orden de Compra está vacía').not().isEmpty(),
  check('Descripcion', 'Descripción está vacía').not().isEmpty(),
  check('ValorU', 'Valor Unitario está vacío').not().isEmpty(),
  validarCampos,
], (req, res) => {
  const {Componentes, Fecha, CantidadRecibida, Tipo, NoFactura, OrdenCompra, Descripcion, ValorU, Total, Proyecto_idProyecto} = req.body;
  const total = CantidadRecibida * ValorU;
  const query = `INSERT INTO Agregados (Componentes, Fecha, CantidadRecibida, Tipo, NoFactura, OrdenCompra, Descripcion, ValorU, Total, Proyecto_idProyecto) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
  mysqlConnection.query(query, [Componentes, Fecha, CantidadRecibida, Tipo, NoFactura, OrdenCompra, Descripcion, ValorU, total, Proyecto_idProyecto], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Agregados Insertado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

router.put('/:idAgregados', [
  ValidarJWT,
  TieneModulo(30),
  PermisoActualizar(1)
],
async (req, res) => {
  const {Componentes, Fecha, CantidadRecibida, Tipo, NoFactura, OrdenCompra, Descripcion, ValorU, Total, Proyecto_idProyecto} = req.body;
  const total = CantidadRecibida * ValorU;
  const agregado = {Componentes, Fecha, CantidadRecibida, Tipo, NoFactura, OrdenCompra, Descripcion, ValorU, total, Proyecto_idProyecto};
  const { idAgregados } = req.params;
  
  await mysqlConnection.query(
    "UPDATE Agregados SET ? WHERE idAgregados = ?",
     [agregado, idAgregados],
     (error, resultado) => {
      if (error) throw error;
      res.status(201).json({
        msg: "Actualizado Exitosamente"
      });
     }
  );
   
  });


module.exports = router;