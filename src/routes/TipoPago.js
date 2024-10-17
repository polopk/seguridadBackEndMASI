const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// Obtener todos los TipoPago 
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM TipoPago', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

// Obtener un TipoPago 
router.get('/:idTipoPago', (req, res) => {
  const { idTipoPago } = req.params; 
  mysqlConnection.query('SELECT * FROM TipoPago WHERE idTipoPago = ?', [idTipoPago], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      console.log(err);
    }
  });
});

// Eliminar un TipoPago 
router.delete('/:idTipoPago', (req, res) => {
  const { idTipoPago } = req.params;
  mysqlConnection.query('DELETE FROM TipoPago WHERE idTipoPago = ?', [idTipoPago], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Tipo de pago Borrado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

// Insertar un TipoPago 
router.post('/', (req, res) => {
  const {idTipoPago, TipoDePago} = req.body;
  const query = `INSERT INTO TipoPago (TipoDePago) VALUES (?);`;
  mysqlConnection.query(query, [TipoDePago], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Tipo de pago Insertado Exitosamente'});
    } else {
      console.log(err);
    }
  });
});

router.put('/:idTipoPago', async (req, res) => {
  const { TipoDePago} = req.body;
  const tipos = {TipoDePago};
  const { idTipoPago } = req.params;
  await mysqlConnection.query(
    "UPDATE TipoPago SET ? WHERE idTipoPago = ?",
     [tipos, idTipoPago],
     (error, resultado) => {
      if (error) throw error;
      res.status(201).json({
        msg: "Actualizado exitosamente"
      });
     }
  );
});

module.exports = router;
