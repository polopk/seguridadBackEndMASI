const { google } = require("googleapis");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { Generarjwt, GenerarJWTPassword } = require("../helpers/generarjwt");
const JWT = require("jsonwebtoken");
const mysqlConnection = require("../src/database");

const Loggin = async (req, res) => {
  const { Contrasenia, Correo } = req.body;


  try {
    await mysqlConnection.query(
      "SELECT * FROM Usuario WHERE Correo = ?",
      Correo,
      async (err, respuesta) => {
  
        if (respuesta.length <= 0) {
          return res.status(400).json({
            msg: "Correo o Contraseña Incorrectos",
          });
        }
        const Estado = respuesta[0].Estado_idEstado;
        if (Estado === 2) {
          return res.status(400).json({
            msg: "Correo o Contraseña Incorrectos",
          });
        }
        const Contrasenia2 = respuesta[0].Contrasenia;
        const ContraseniaValida = bcrypt.compareSync(Contrasenia, Contrasenia2);
        if (!ContraseniaValida) {
          return res.status(400).json({
            msg: "Correo o Contraseña Incorrectos",
          });
        }
        const id = respuesta[0].idUsuario;
        const token = await Generarjwt(id);
        const { Correo, Rol_idRol, Estado_idEstado, Empleado_idEmpleado } =
          respuesta[0];
        const usuario = {
          Correo,
          Rol_idRol,
          Estado_idEstado,
          Empleado_idEmpleado,
        };
        res.json({
          usuario,
          token,
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      msg: "Sucedió algo inesperado", //Error en el servidor
    });
  }
};

const ResetPassword = async (req, res) => {
  const { Correo } = req.body;
  console.log(Correo);
  try {
    await mysqlConnection.query(
      "SELECT * FROM Usuario WHERE Correo = ?",
      Correo,
      async (err, respuesta) => {
        if (respuesta.length <= 0) {
          //Validar que el usuario existe
          return res.status(400).json({
            msg: "Usuario no existe", //Error en el servidor
          });
        }
        const Estado = respuesta[0].Estado_idEstado; //Validar que este en estado activo
        if (Estado === 2) {
          return res.status(400).json({
            msg: "Usuario no válido", //Error en el servidor
          });
        }
        const id = respuesta[0].idUsuario;
        //Generar JWT
        const TokenPassword = await GenerarJWTPassword(id);
        //Enviar ID a la funcion GENERAR JWT
        const { Correo } = respuesta[0]; //Extraer correo
        try {
          const clientId = process.env.GOOGLE_CLIENT_ID;
          const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
          const redirectUri = process.env.redirectUri;
          const refreshToken =process.env.refresh;
          const oAuth2Client = new google.auth.OAuth2(
            clientId,
            clientSecret,
            redirectUri
          );

          await oAuth2Client.setCredentials({ refresh_token: refreshToken });
          const accessToken = await oAuth2Client.getAccessToken();
   
          let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              type: "OAuth2",
              user: process.env.correo,
              clientId: clientId,
              clientSecret: clientSecret,
              refreshToken: refreshToken,
              accessToken: accessToken,
              password: process.env.contra,
            },
          });
          await transporter.sendMail({
            from: "Soluciones S.A",
            to: Correo,
            subject: "Recuparación de contraseña",
            html: `
                <p>Ingresa al siguiente link para poder actualizar tu contraseña</p>
                <p>Este link únicamente será valido durante los siguientes 15 minutos</p>
                <a href="http://localhost:3000/ActualizarContrasenia/${id}/${TokenPassword}">Ingresa acá</a>`,
          });
          res.json({
            msg: "Correo Enviado ",
          });
        } catch (error) {
          console.log(error);
          return res.status(500).json({
            msg: "Correo No Enviado ",
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Algo salió mal...", //Error en el servidor
    });
  }
};

const UpdatePassword = async (req, res) => {
  const { Contrasenia, Contrasenia2 } = req.body;
  const { id, Token } = req.params;

  const Usuario = { Contrasenia };

  try {
    const { uid } = JWT.verify(Token, process.env.secretOrPrivateKey);
    await mysqlConnection.query(
      "SELECT * FROM Usuario WHERE idUsuario = ?",
      uid,
      async (err, respuesta) => {
        if (respuesta.length <= 0) {
          //Validar que el usuario existe
          return res.status(400).json({
            msg: "Usuario no existe", //Error en el servidor
          });
        }
   
        const Estado = respuesta[0].Estado_idEstado; //Validar que este en estado activo
        if (Estado === 2) {
          return res.status(400).json({
            msg: "Usuario no válido", //Error en el servidor
          });
        }
        const id = respuesta[0].idUsuario;
        if (Contrasenia === Contrasenia2) {
          const salt = bcrypt.genSaltSync(10);
          Usuario.Contrasenia = bcrypt.hashSync(Contrasenia, salt);
          await mysqlConnection.query(
            "UPDATE Usuario SET ? WHERE idUsuario = ?",
            [Usuario, uid],
            (err, resul) => {
              res.status(201).json({
                msg: "Contraseña actualizada con exito",
              });
            }
          );
        } else {
          res.status(401).json({
            msg: "Las contraseñas no coinciden",
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Vuelva a intentarlo, su tiempo de espera culminó",
    });
  }
};

module.exports = {
  Loggin,
  ResetPassword,
  UpdatePassword,
};
