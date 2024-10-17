const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');
const { ValidarJWT } = require('../../middleware/validar-jwt.js');
const { TieneModulo, PermisoVer, PermisoEliminar, PermisoInsertar, PermisoActualizar } = require('../../middleware/validar-roles.js');
const { validarCampos } = require('../../middleware/validarcampos.js');
const { check } = require('express-validator');

// Obtener todos los Proyecto 
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT DISTINCT Cliente_idCliente, idProyecto, NombreProyecto, Ubicacion, DATE_FORMAT(FechaInicio,"%Y-%m-%d") as FechaInicio, EstadoProyecto, ValorProyecto, Estado_idEstado FROM Proyecto', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

router.get('/Estados', (req, res) => {
  mysqlConnection.query('SELECT EstadoProyecto, count(1) as Total FROM Proyecto GROUP BY EstadoProyecto;', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

// Obtener un Proyecto 
router.get('/:Cliente_idCliente', [
  ValidarJWT,
],(req, res) => {
  const { Cliente_idCliente  } = req.params; 
  mysqlConnection.query('SELECT p.idProyecto, p.NombreProyecto, p.Ubicacion, DATE_FORMAT(p.FechaInicio,"%Y-%m-%d") as FechaInicio, p.EstadoProyecto, p.ValorProyecto, p.Cliente_idCliente, p.Estado_idEstado, e.Empresa, s.Estado FROM Proyecto p  INNER JOIN Cliente e ON p.Cliente_idCliente = e.idCliente  INNER JOIN Estado s ON p.Estado_idEstado = s.idEstado WHERE p.Cliente_idCliente  = ?', [Cliente_idCliente], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

// Eliminar un Proyecto 
router.delete('/:idProyecto',[
  ValidarJWT,
  TieneModulo(26),
  PermisoEliminar(1)
],
 (req, res) => {
  const { idProyecto } = req.params;
  mysqlConnection.query('DELETE FROM Proyecto WHERE idProyecto = ?', [idProyecto], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Proyecto Borrado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

// Insertar un Proyecto 
router.post('/',[
  ValidarJWT,
  TieneModulo(26),
  PermisoInsertar(1),
  check('NombreProyecto', 'Nombre Proyecto está vacío').not().isEmpty(),
  check('Ubicacion', 'Ubicación está vacía').not().isEmpty(),
  check('FechaInicio', 'Fecha de Inicio está vacía').not().isEmpty(),
  check('EstadoProyecto', 'Estado de Proyecto está vacía').not().isEmpty(),
  check('ValorProyecto', 'Valor de Proyecto está vacía').not().isEmpty(), 
  validarCampos,
], (req, res) => {
  const {idProyecto, NombreProyecto, Ubicacion, FechaInicio, EstadoProyecto,  ValorProyecto, Cliente_idCliente} = req.body;
  const query = `INSERT INTO Proyecto ( NombreProyecto, Ubicacion, FechaInicio, EstadoProyecto, ValorProyecto, Cliente_idCliente, Estado_idEstado) VALUES (?, ?, ?, ?, ?, ?, ?);`;
  mysqlConnection.query(query, [ NombreProyecto, Ubicacion, FechaInicio, EstadoProyecto, ValorProyecto, Cliente_idCliente, 1], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Proyecto Insertado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

router.put('/:idProyecto',[
  ValidarJWT,
  TieneModulo(26),
  PermisoActualizar(1)
], async (req, res) => {
  const { NombreProyecto, Ubicacion, FechaInicio, EstadoProyecto, ValorProyecto, Cliente_idCliente} = req.body;
  const Proyectos = {NombreProyecto, Ubicacion, FechaInicio, EstadoProyecto, ValorProyecto, Cliente_idCliente};
  const { idProyecto } = req.params;
  await mysqlConnection.query(
    "UPDATE Proyecto SET ? WHERE idProyecto = ?",
     [Proyectos, idProyecto],
     (error, resultado) => {
      if (error) throw error;
      res.status(201).json({
        msg: "Actualizado exitosamente"
      });
     }
  );
  });


module.exports = router;