-- MySQL Script generated by MySQL Workbench
-- Mon Sep  5 18:18:19 2022
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema PG_ALGA
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `PG_ALGA` ;

-- -----------------------------------------------------
-- Schema PG_ALGA
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `PG_ALGA` DEFAULT CHARACTER SET utf8 ;
USE `PG_ALGA` ;

-- -----------------------------------------------------
-- Table `PG_ALGA`.`Cliente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`Cliente` (
  `idCliente` INT NOT NULL AUTO_INCREMENT,
  `Empresa` VARCHAR(200) NOT NULL,
  `Encargado` VARCHAR(200) NOT NULL,
  `Direccion` VARCHAR(200) NOT NULL,
  `NIT` VARCHAR(45) NOT NULL,
  `NoTelefono` INT NOT NULL,
  PRIMARY KEY (`idCliente`),
  UNIQUE INDEX `NIT_UNIQUE` (`NIT` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`Vehiculos_Maquinaria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`Vehiculos_Maquinaria` (
  `idVehiculo` INT NOT NULL AUTO_INCREMENT,
  `Tipo` VARCHAR(200) NOT NULL,
  `Marca` VARCHAR(200) NOT NULL,
  `Placa` VARCHAR(45) NOT NULL,
  `Modelo` VARCHAR(200) NOT NULL,
  `NoSerie` VARCHAR(200) NOT NULL,
  `Aseguradora` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`idVehiculo`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`Estado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`Estado` (
  `idEstado` INT NOT NULL AUTO_INCREMENT,
  `Estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idEstado`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`Proyecto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`Proyecto` (
  `idProyecto` INT NOT NULL AUTO_INCREMENT,
  `NombreProyecto` VARCHAR(100) NOT NULL,
  `Ubicacion` VARCHAR(100) NOT NULL,
  `FechaInicio` DATE NOT NULL,
  `EstadoProyecto` VARCHAR(45) NOT NULL,
  `ValorProyecto` DOUBLE NOT NULL,
  `Cliente_idCliente` INT NOT NULL,
  `Estado_idEstado` INT NOT NULL,
  PRIMARY KEY (`idProyecto`),
  INDEX `fk_proyecto_Cliente1_idx` (`Cliente_idCliente` ASC),
  INDEX `fk_Proyecto_Estado1_idx` (`Estado_idEstado` ASC),
  CONSTRAINT `fk_proyecto_Cliente1`
    FOREIGN KEY (`Cliente_idCliente`)
    REFERENCES `PG_ALGA`.`Cliente` (`idCliente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Proyecto_Estado1`
    FOREIGN KEY (`Estado_idEstado`)
    REFERENCES `PG_ALGA`.`Estado` (`idEstado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`TipoCombustible`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`TipoCombustible` (
  `idTipoCombustible` INT NOT NULL AUTO_INCREMENT,
  `TipoCombustible` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idTipoCombustible`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`Combustible`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`Combustible` (
  `idCombustible` INT NOT NULL AUTO_INCREMENT,
  `Fecha` DATE NOT NULL,
  `Cantidad` DOUBLE NOT NULL,
  `Proveedor` VARCHAR(200) NOT NULL,
  `Valor` DOUBLE NOT NULL,
  `NoFactura` BIGINT(15) NOT NULL,
  `Total` DOUBLE NOT NULL,
  `Vehiculos_Maquinaria_idVehiculo` INT NOT NULL,
  `Proyecto_idProyecto` INT NOT NULL,
  `TipoCombustible_idTipoCombustible` INT NOT NULL,
  PRIMARY KEY (`idCombustible`),
  INDEX `fk_combustible_Vehiculos_Maquinaria1_idx` (`Vehiculos_Maquinaria_idVehiculo` ASC),
  INDEX `fk_Combustible_Proyecto1_idx` (`Proyecto_idProyecto` ASC),
  INDEX `fk_Combustible_TipoCombustible1_idx` (`TipoCombustible_idTipoCombustible` ASC),
  CONSTRAINT `fk_combustible_Vehiculos_Maquinaria1`
    FOREIGN KEY (`Vehiculos_Maquinaria_idVehiculo`)
    REFERENCES `PG_ALGA`.`Vehiculos_Maquinaria` (`idVehiculo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Combustible_Proyecto1`
    FOREIGN KEY (`Proyecto_idProyecto`)
    REFERENCES `PG_ALGA`.`Proyecto` (`idProyecto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Combustible_TipoCombustible1`
    FOREIGN KEY (`TipoCombustible_idTipoCombustible`)
    REFERENCES `PG_ALGA`.`TipoCombustible` (`idTipoCombustible`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`TrasladosFletes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`TrasladosFletes` (
  `idTraslado` INT NOT NULL AUTO_INCREMENT,
  `Fecha` DATE NOT NULL,
  `Cantidad` INT NOT NULL,
  `TipoTraslado` VARCHAR(200) NOT NULL,
  `ValorU` DOUBLE NOT NULL,
  `Factura` BIGINT(15) NOT NULL,
  `Nombre` VARCHAR(200) NOT NULL,
  `LugarProcedencia` VARCHAR(200) NOT NULL,
  `Medida` VARCHAR(200) NOT NULL,
  `Total` DOUBLE NOT NULL,
  `Proyecto_idProyecto` INT NOT NULL,
  PRIMARY KEY (`idTraslado`),
  INDEX `fk_TrasladosFletes_Proyecto1_idx` (`Proyecto_idProyecto` ASC),
  CONSTRAINT `fk_TrasladosFletes_Proyecto1`
    FOREIGN KEY (`Proyecto_idProyecto`)
    REFERENCES `PG_ALGA`.`Proyecto` (`idProyecto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`MaquinariaEquipo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`MaquinariaEquipo` (
  `idMaquinaria` INT NOT NULL AUTO_INCREMENT,
  `FechaIngreso` DATE NOT NULL,
  `CantidadCombustible` VARCHAR(200) NOT NULL,
  `Inicia` DOUBLE NOT NULL,
  `Termina` DOUBLE NOT NULL,
  `CantidadHoras` DOUBLE NOT NULL,
  `FechaFin` DATE NOT NULL,
  `Vehiculos_Maquinaria_idVehiculo` INT NOT NULL,
  PRIMARY KEY (`idMaquinaria`),
  INDEX `fk_MaquinariaEquipo_Vehiculos_Maquinaria1_idx` (`Vehiculos_Maquinaria_idVehiculo` ASC),
  CONSTRAINT `fk_MaquinariaEquipo_Vehiculos_Maquinaria1`
    FOREIGN KEY (`Vehiculos_Maquinaria_idVehiculo`)
    REFERENCES `PG_ALGA`.`Vehiculos_Maquinaria` (`idVehiculo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`TipoPago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`TipoPago` (
  `idTipoPago` INT NOT NULL AUTO_INCREMENT,
  `TipoDePago` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idTipoPago`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`Empleado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`Empleado` (
  `idEmpleado` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(200) NOT NULL,
  `Apellido` VARCHAR(200) NOT NULL,
  `FechaNacimiento` DATE NOT NULL,
  `EstadoCivil` VARCHAR(45) NOT NULL,
  `Direccion` VARCHAR(200) NOT NULL,
  `Profesion` VARCHAR(200) NOT NULL,
  `DPI` BIGINT(20) NOT NULL,
  `Telefono` INT NOT NULL,
  `NoAfiliacion` VARCHAR(45) NOT NULL,
  `NIT` VARCHAR(45) NOT NULL,
  `FechaInicio` DATE NOT NULL,
  `FechaFin` DATE NULL,
  `Puesto` VARCHAR(45) NOT NULL,
  `TipoPago_idTipoPago` INT NOT NULL,
  PRIMARY KEY (`idEmpleado`),
  INDEX `fk_Empleado_TipoPago1_idx` (`TipoPago_idTipoPago` ASC),
  UNIQUE INDEX `DPI_UNIQUE` (`DPI` ASC),
  UNIQUE INDEX `NIT_UNIQUE` (`NIT` ASC),
  UNIQUE INDEX `NoAfiliacion_UNIQUE` (`NoAfiliacion` ASC),
  CONSTRAINT `fk_Empleado_TipoPago1`
    FOREIGN KEY (`TipoPago_idTipoPago`)
    REFERENCES `PG_ALGA`.`TipoPago` (`idTipoPago`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`PagoHrsExtra`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`PagoHrsExtra` (
  `idPagosHrs` INT NOT NULL AUTO_INCREMENT,
  `Cargo` VARCHAR(200) NOT NULL,
  `FechaInicio` DATE NOT NULL,
  `FechaFin` DATE NOT NULL,
  `HrsRegistradas` INT NOT NULL,
  `PrecioHora` DOUBLE NOT NULL,
  `Total` DOUBLE NOT NULL,
  `Proyecto_idProyecto` INT NOT NULL,
  `Empleado_idEmpleado` INT NOT NULL,
  PRIMARY KEY (`idPagosHrs`),
  INDEX `fk_PagoHrsExtra_Proyecto1_idx` (`Proyecto_idProyecto` ASC),
  INDEX `fk_PagoHrsExtra_Empleado1_idx` (`Empleado_idEmpleado` ASC),
  CONSTRAINT `fk_PagoHrsExtra_Proyecto1`
    FOREIGN KEY (`Proyecto_idProyecto`)
    REFERENCES `PG_ALGA`.`Proyecto` (`idProyecto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_PagoHrsExtra_Empleado1`
    FOREIGN KEY (`Empleado_idEmpleado`)
    REFERENCES `PG_ALGA`.`Empleado` (`idEmpleado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`GastosVarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`GastosVarios` (
  `idGastos` INT NOT NULL AUTO_INCREMENT,
  `Fecha` DATE NOT NULL,
  `Factura` BIGINT(15) NOT NULL,
  `Proveedor` VARCHAR(200) NOT NULL,
  `Material` VARCHAR(200) NOT NULL,
  `Cantidad` INT NOT NULL,
  `CostoU` DOUBLE NOT NULL,
  `Ubicacion` VARCHAR(200) NOT NULL,
  `Total` DOUBLE NOT NULL,
  `Proyecto_idProyecto` INT NOT NULL,
  PRIMARY KEY (`idGastos`),
  INDEX `fk_GastosVarios_Proyecto1_idx` (`Proyecto_idProyecto` ASC),
  CONSTRAINT `fk_GastosVarios_Proyecto1`
    FOREIGN KEY (`Proyecto_idProyecto`)
    REFERENCES `PG_ALGA`.`Proyecto` (`idProyecto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`MovimientosTierra`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`MovimientosTierra` (
  `idMovimiento` INT NOT NULL AUTO_INCREMENT,
  `NoFactura` BIGINT(15) NOT NULL,
  `MetrosCubicos` DOUBLE NOT NULL,
  `Trabajo` VARCHAR(200) NOT NULL,
  `Descripcion` VARCHAR(200) NOT NULL,
  `Area` DOUBLE NOT NULL,
  `BaseCompactada` VARCHAR(200) NOT NULL,
  `Proyecto_idProyecto` INT NOT NULL,
  PRIMARY KEY (`idMovimiento`),
  INDEX `fk_MovimientosTierra_Proyecto1_idx` (`Proyecto_idProyecto` ASC),
  CONSTRAINT `fk_MovimientosTierra_Proyecto1`
    FOREIGN KEY (`Proyecto_idProyecto`)
    REFERENCES `PG_ALGA`.`Proyecto` (`idProyecto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`Agregados`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`Agregados` (
  `idAgregados` INT NOT NULL AUTO_INCREMENT,
  `Componentes` VARCHAR(200) NOT NULL,
  `Fecha` DATE NOT NULL,
  `CantidadRecibida` DOUBLE NOT NULL,
  `Tipo` VARCHAR(200) NOT NULL,
  `NoFactura` BIGINT(15) NOT NULL,
  `OrdenCompra` INT NULL,
  `Descripcion` VARCHAR(500) NOT NULL,
  `ValorU` DOUBLE NOT NULL,
  `Total` DOUBLE NOT NULL,
  `Proyecto_idProyecto` INT NOT NULL,
  PRIMARY KEY (`idAgregados`),
  INDEX `fk_Agregados_Proyecto1_idx` (`Proyecto_idProyecto` ASC),
  CONSTRAINT `fk_Agregados_Proyecto1`
    FOREIGN KEY (`Proyecto_idProyecto`)
    REFERENCES `PG_ALGA`.`Proyecto` (`idProyecto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`ManoObra`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`ManoObra` (
  `idManodeObra` INT NOT NULL AUTO_INCREMENT,
  `Fecha` DATE NOT NULL,
  `Precio` DOUBLE NOT NULL,
  `Cantidad` DOUBLE NOT NULL,
  `Descripcion` VARCHAR(200) NOT NULL,
  `NoInforme` VARCHAR(200) NOT NULL,
  `Factura` BIGINT(15) NOT NULL,
  `TipoManoObra` VARCHAR(200) NOT NULL,
  `Medidas` INT NOT NULL,
  `Total` DOUBLE NOT NULL,
  `Proyecto_idProyecto` INT NOT NULL,
  PRIMARY KEY (`idManodeObra`),
  INDEX `fk_ManoObra_Proyecto1_idx` (`Proyecto_idProyecto` ASC),
  CONSTRAINT `fk_ManoObra_Proyecto1`
    FOREIGN KEY (`Proyecto_idProyecto`)
    REFERENCES `PG_ALGA`.`Proyecto` (`idProyecto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`Ingresos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`Ingresos` (
  `idIngresos` INT NOT NULL AUTO_INCREMENT,
  `Fecha` DATE NOT NULL,
  `NoFactura` BIGINT(15) NOT NULL,
  `Retenciones` DOUBLE NOT NULL,
  `Porcentaje` INT NOT NULL,
  `Descripcion` VARCHAR(200) NOT NULL,
  `Proyecto_idProyecto` INT NOT NULL,
  PRIMARY KEY (`idIngresos`),
  INDEX `fk_Ingresos_Proyecto1_idx` (`Proyecto_idProyecto` ASC),
  CONSTRAINT `fk_Ingresos_Proyecto1`
    FOREIGN KEY (`Proyecto_idProyecto`)
    REFERENCES `PG_ALGA`.`Proyecto` (`idProyecto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`Pagos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`Pagos` (
  `idPagos` INT NOT NULL AUTO_INCREMENT,
  `Monto` DOUBLE NOT NULL,
  `TipoDocumento` VARCHAR(100) NOT NULL,
  `NoDocumento` INT NOT NULL,
  `Fecha` DATE NOT NULL,
  `TipoPago_idTipoPago` INT NOT NULL,
  `Empleado_idEmpleado` INT NOT NULL,
  PRIMARY KEY (`idPagos`),
  INDEX `fk_Pagos_TipoPago1_idx` (`TipoPago_idTipoPago` ASC),
  INDEX `fk_Pagos_Empleado1_idx` (`Empleado_idEmpleado` ASC),
  CONSTRAINT `fk_Pagos_TipoPago1`
    FOREIGN KEY (`TipoPago_idTipoPago`)
    REFERENCES `PG_ALGA`.`TipoPago` (`idTipoPago`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Pagos_Empleado1`
    FOREIGN KEY (`Empleado_idEmpleado`)
    REFERENCES `PG_ALGA`.`Empleado` (`idEmpleado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`Prestamo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`Prestamo` (
  `idPrestamo` INT NOT NULL AUTO_INCREMENT,
  `Fecha` DATE NOT NULL,
  `ValorPrestamo` DOUBLE NOT NULL,
  `Restante` DOUBLE NOT NULL,
  `Empleado_idEmpleado` INT NOT NULL,
  PRIMARY KEY (`idPrestamo`),
  INDEX `fk_Prestamo_Empleado1_idx` (`Empleado_idEmpleado` ASC),
  CONSTRAINT `fk_Prestamo_Empleado1`
    FOREIGN KEY (`Empleado_idEmpleado`)
    REFERENCES `PG_ALGA`.`Empleado` (`idEmpleado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`Rol`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`Rol` (
  `idRol` INT NOT NULL AUTO_INCREMENT,
  `Rol` VARCHAR(45) NOT NULL,
  `Estado_idEstado` INT NOT NULL,
  PRIMARY KEY (`idRol`),
  INDEX `fk_Rol_Estado1_idx` (`Estado_idEstado` ASC),
  CONSTRAINT `fk_Rol_Estado1`
    FOREIGN KEY (`Estado_idEstado`)
    REFERENCES `PG_ALGA`.`Estado` (`idEstado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`Usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`Usuario` (
  `idUsuario` INT NOT NULL AUTO_INCREMENT,
  `Correo` VARCHAR(100) NOT NULL,
  `Contrasenia` VARCHAR(200) NOT NULL,
  `Rol_idRol` INT NOT NULL,
  `Estado_idEstado` INT NOT NULL,
  `Empleado_idEmpleado` INT NOT NULL,
  PRIMARY KEY (`idUsuario`),
  INDEX `fk_usuario_Rol1_idx` (`Rol_idRol` ASC),
  INDEX `fk_usuario_Estado1_idx` (`Estado_idEstado` ASC),
  INDEX `fk_usuario_Empleado1_idx` (`Empleado_idEmpleado` ASC),
  CONSTRAINT `fk_usuario_Rol1`
    FOREIGN KEY (`Rol_idRol`)
    REFERENCES `PG_ALGA`.`Rol` (`idRol`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_usuario_Estado1`
    FOREIGN KEY (`Estado_idEstado`)
    REFERENCES `PG_ALGA`.`Estado` (`idEstado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_usuario_Empleado1`
    FOREIGN KEY (`Empleado_idEmpleado`)
    REFERENCES `PG_ALGA`.`Empleado` (`idEmpleado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`Bitacora`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`Bitacora` (
  `idBitacora` INT NOT NULL AUTO_INCREMENT,
  `FechaHora` DATETIME NOT NULL,
  `Usuario` VARCHAR(100) NOT NULL,
  `ActividadRealizada` VARCHAR(300) NOT NULL,
  PRIMARY KEY (`idBitacora`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`PagoPrestamo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`PagoPrestamo` (
  `idPagoPrestamo` INT NOT NULL AUTO_INCREMENT,
  `Monto` DOUBLE NOT NULL,
  `Fecha` DATE NOT NULL,
  `Prestamo_idPrestamo` INT NOT NULL,
  PRIMARY KEY (`idPagoPrestamo`),
  INDEX `fk_PagoPrestamo_Prestamo1_idx` (`Prestamo_idPrestamo` ASC),
  CONSTRAINT `fk_PagoPrestamo_Prestamo1`
    FOREIGN KEY (`Prestamo_idPrestamo`)
    REFERENCES `PG_ALGA`.`Prestamo` (`idPrestamo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`Modulo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`Modulo` (
  `idModulo` INT NOT NULL AUTO_INCREMENT,
  `Modulo` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idModulo`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PG_ALGA`.`Rol_Modulo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PG_ALGA`.`Rol_Modulo` (
  `idRol_Modulo` INT NOT NULL AUTO_INCREMENT,
  `Ver` TINYINT NULL,
  `Insertar` TINYINT NULL,
  `Eliminar` TINYINT NULL,
  `Actualizar` TINYINT NULL,
  `Rol_idRol` INT NOT NULL,
  `Modulo_idModulo` INT NOT NULL,
  PRIMARY KEY (`idRol_Modulo`),
  INDEX `fk_Rol_Modulo_Rol1_idx` (`Rol_idRol` ASC),
  INDEX `fk_Rol_Modulo_Modulo1_idx` (`Modulo_idModulo` ASC),
  CONSTRAINT `fk_Rol_Modulo_Rol1`
    FOREIGN KEY (`Rol_idRol`)
    REFERENCES `PG_ALGA`.`Rol` (`idRol`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Rol_Modulo_Modulo1`
    FOREIGN KEY (`Modulo_idModulo`)
    REFERENCES `PG_ALGA`.`Modulo` (`idModulo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
