const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');


// Obtener un permiso 
router.get('/:Rol_idRol', (req, res) => {
  const { Rol_idRol } = req.params; 
  mysqlConnection.query('SELECT r.idRol_Modulo, r.Ver, r.Insertar, r.Eliminar, r.Actualizar, r.Rol_idRol, r.Modulo_idModulo, o.Rol, m.Modulo FROM Rol_Modulo r INNER JOIN Modulo m ON r.Modulo_idModulo = m.idModulo INNER JOIN Rol o ON r.Rol_idRol = o.idRol WHERE Rol_idRol = ?', [Rol_idRol], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.post('/RolPermiso', (req, res) => {
  const { rol, modulo}=req.body
    mysqlConnection.query('select * from Rol_Modulo where Rol_idRol = ? and Modulo_idModulo=?;', [rol, modulo], (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    });
  });


router.put('/', async (req, res) => {
  const {idRol_Modulo, Ver, Insertar, Eliminar, Actualizar} = req.body;
  const permiso = {Ver, Insertar, Eliminar, Actualizar};

  console.log(req.body);
  await mysqlConnection.query(
     "UPDATE Rol_Modulo SET ? WHERE idRol_Modulo = ?",
     [permiso, idRol_Modulo],
     (error, resul) => {
      if (error) throw error;
      res.status(201).json({
        msg: "Actualizado Exitosamente"
      });
      }
   );
  });

module.exports = router;
