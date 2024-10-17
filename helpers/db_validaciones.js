const mysqlConnection = require("../src/database");
const db = require("../src/database");

const esRolvalido = async (Rol_idRol = "") => {
  return new Promise(async (resolve, reject) => {
    await db.query(
      "SELECT * FROM Rol WHERE idRol = ?",
      Rol_idRol,
      (error, res) => {
        if (res.length <= 0) {
          reject(new Error("El rol no existe "));
        }
        resolve(true);
      }
    );
  });
};

const esCorreoValido = async (Correo = "") => {
    return new Promise(async (resolve, reject) => {
      await db.query(
        "SELECT * FROM Usuario WHERE Correo = ?",
        Correo,
        (error, res) => {
          if (res.length > 0) {
            reject(new Error("El correo existe "));
          }
          resolve(true);
        }
      );
    });
  };

  const UsuarioExiste =async (idUsuario = "") => {
    return new Promise(async (resolve, reject) => {
      await mysqlConnection.query(
        "SELECT * FROM Usuario WHERE idUsuario = ?",
     idUsuario,
        (error, res) => {

          if (res.length <= 0) {
            reject(new Error("Identificador invalido "));
          }
          resolve(true);
        }
      );
    });
  };

  const RolExiste =async (idRol = "") => {
    return new Promise(async (resolve, reject) => {
      await mysqlConnection.query(
        "SELECT * FROM Rol WHERE idRol= ?",
     idRol,
        (error, res) => {

          if (res.length <= 0) {
            reject(new Error("El Rol No Existe"));
          }
          resolve(true);
        }
      );
    });
  };
  
  const EstadoExiste =async (idEstado = "") => {
    return new Promise(async (resolve, reject) => {
      await mysqlConnection.query(
        "SELECT * FROM Estado WHERE idEstado= ?",
     idEstado,
        (error, res) => {

          if (res.length <= 0) {
            reject(new Error("El Estado No Existe"));
          }
          resolve(true);
        }
      );
    });
  };

  const EmpleadoExiste =async (idEmpleado = "") => {
    return new Promise(async (resolve, reject) => {
      await mysqlConnection.query(
        "SELECT * FROM Empleado WHERE idEmpleado= ?",
     idEmpleado,
        (error, res) => {

          if (res.length <= 0) {
            reject(new Error("El Empleado No Existe"));
          }
          resolve(true);
        }
      );
    });
  };

  const EmpleadoUsuarioExiste = async (Empleado_idEmpleado = "") => {
    console.log(Empleado_idEmpleado)
    return new Promise(async (resolve, reject) => {
      await mysqlConnection.query(
        "SELECT * FROM Usuario WHERE Empleado_idEmpleado= ?",
     Empleado_idEmpleado,
        (error, res) => {

          if (res.length > 0) {
            reject(new Error("Este empleado ya tiene un usuario"));
          }
          resolve(true);
        }
      );
    });
  };

  const TipoPagoExiste =async (idTipoPago = "") => {
    return new Promise(async (resolve, reject) => {
      await mysqlConnection.query(
        "SELECT * FROM TipoPago WHERE idTipoPago= ?",
        idTipoPago,
        (error, res) => {

          if (res.length <= 0) {
            reject(new Error("Selecciona Tipo de Pago"));
          }
          resolve(true);
        }
      );
    });
  };

  const DpiExiste =async (DPI = "") => {
    return new Promise(async (resolve, reject) => {
      await mysqlConnection.query(
        "SELECT * FROM Empleado WHERE DPI =?",
  DPI,
        (error, res) => {

          if (res.length > 0) {
            reject(new Error("Este número de Dpi ya existe"));
          }
          resolve(true);
        }
      );
    });
  };
  const NoAfiliacionExiste=async (NoAfiliacion= "") => {
    return new Promise(async (resolve, reject) => {
      await mysqlConnection.query(
        "SELECT * FROM Empleado WHERE NoAfiliacion =?",
        NoAfiliacion,
        (error, res) => {

          if (res.length > 0) {
            reject(new Error("Este número de Afiliación ya existe"));
          }
          resolve(true);
        }
      );
    });
  };

  const NITExiste =async (NIT = "") => {
    return new Promise(async (resolve, reject) => {
      await mysqlConnection.query(
        "SELECT * FROM Empleado WHERE NIT =?",
  NIT,
        (error, res) => {

          if (res.length > 0) {
            reject(new Error("Este número de NIT ya existe"));
          }
          resolve(true);
        }
      );
    });
  };

module.exports = {
    esRolvalido,
    esCorreoValido,
    UsuarioExiste,
    RolExiste,
    EstadoExiste,
    EmpleadoExiste,
    EmpleadoUsuarioExiste,
    TipoPagoExiste, 
    DpiExiste,
    NoAfiliacionExiste,
    NITExiste 
}