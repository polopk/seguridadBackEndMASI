const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// Obtener todos los Estado 
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM Estado', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

// Obtener un Estado 
router.get('/:idEstado', (req, res) => {
  const { idEstado } = req.params; 
  mysqlConnection.query('SELECT * FROM Estado WHERE idEstado = ?', [idEstado], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      console.log(err);
    }
  });
});

// Eliminar un Estado 
router.delete('/:idEstado', (req, res) => {
  const { idEstado } = req.params;
  mysqlConnection.query('DELETE FROM Estado WHERE idEstado = ?', [idEstado], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Estado Borrado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

// Insertar un Estado 
router.post('/', (req, res) => {
  const {idEstado, Estado} = req.body;
  const query = `INSERT INTO Estado (idEstado, Estado) VALUES (?, ?);`;
  mysqlConnection.query(query, [idEstado, Estado], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Estado Insertado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

router.put('/:idEstado', async (req, res) => {
  const { Estado} = req.body;
  const Estadoes = {Estado}; 
  const { idEstado } = req.params;

    await mysqlConnection.query(
    "UPDATE Estado SET ? WHERE idEstado = ?",
     [Estadoes, idEstado],
     (error, resultado) => {
      if (error) throw error;
      res.status(201).json({
        msg: "Actualizado Exitosamente"
      });
     }
  );
});

module.exports = router;
