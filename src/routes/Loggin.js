const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  Loggin,
  ResetPassword,
  UpdatePassword,
} = require("../../Controllers/auth.js");

const { validarCampos } = require("../../middleware/validarcampos.js");

router.post(
  "/Loggear",
  [
    check("Correo", "El Correo No Es Valido").isEmail(),
    check("Contrasenia", "La Contraseña es Obligatoria").not().isEmpty(),
    validarCampos,
  ],
  Loggin
);

router.post(
  "/RecuperarContrasenia",
  [check("Correo", "El Correo No Es Valido").isEmail(), validarCampos],
  ResetPassword
);

router.post("/ActualizarContrasenia/:id/:Token", UpdatePassword);

module.exports = router;
