const express = require("express");
const router = express.Router();
const mysqlConnection = require("../database.js");

router.get("/TotalA/:Proyecto_idProyecto", (req, res) => {
  const { Proyecto_idProyecto } = req.params;
  mysqlConnection.query(
    "SELECT SUM(Total) AS Total FROM Agregados WhERE Proyecto_idProyecto =?",
    [Proyecto_idProyecto],
    (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    }
  );
});

router.get("/TotalG/:Proyecto_idProyecto", (req, res) => {
  const { Proyecto_idProyecto } = req.params;
  mysqlConnection.query(
    "SELECT SUM(Total) AS TotalG FROM GastosVarios WhERE Proyecto_idProyecto = ?",
    [Proyecto_idProyecto],
    (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    }
  );
});

router.get("/TotalC/:Proyecto_idProyecto", (req, res) => {
    const { Proyecto_idProyecto } = req.params;
    mysqlConnection.query(
      "SELECT SUM(Total) AS TotalC FROM Combustible WhERE Proyecto_idProyecto =?",
      [Proyecto_idProyecto],
      (err, rows, fields) => {
        if (!err) {
          res.json(rows);
        } else {
          console.log(err);
        }
      }
    );
  });

  router.get("/TotalT/:Proyecto_idProyecto", (req, res) => {
    const { Proyecto_idProyecto } = req.params;
    mysqlConnection.query(
      "SELECT SUM(Total) AS TotalT FROM TrasladosFletes WhERE Proyecto_idProyecto =?",
      [Proyecto_idProyecto],
      (err, rows, fields) => {
        if (!err) {
          res.json(rows);
        } else {
          console.log(err);
        }
      }
    );
  });

  router.get("/TotalM/:Proyecto_idProyecto", (req, res) => {
    const { Proyecto_idProyecto } = req.params;
    mysqlConnection.query(
      "SELECT SUM(Total) AS TotalM FROM ManoObra WhERE Proyecto_idProyecto =?",
      [Proyecto_idProyecto],
      (err, rows, fields) => {
        if (!err) {
          res.json(rows);
        } else {
          console.log(err);
        }
      }
    );
  });

  
  router.get("/TotalP/:Proyecto_idProyecto", (req, res) => {
    const { Proyecto_idProyecto } = req.params;
    mysqlConnection.query(
      "SELECT SUM(Total) AS TotalP FROM PagoHrsExtra WhERE Proyecto_idProyecto = ?",
      [Proyecto_idProyecto],
      (err, rows, fields) => {
        if (!err) {
          res.json(rows);
        } else {
          console.log(err);
        }
      }
    );
  });


module.exports = router;
