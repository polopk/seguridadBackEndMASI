USE ALGA;

DELIMITER $$
USE `ALGA`$$

CREATE PROCEDURE `permisosAddOrEdit` (
  IN _idpermisos INT,
  IN _tipodepermiso VARCHAR(45)
)
BEGIN 
  IF _idpermisos = 0 THEN
    INSERT INTO permisos (tipodepermiso)
    VALUES (_tipodepermiso);

    SET _idpermisos = LAST_INSERT_ID();
  ELSE
    UPDATE permisos
    SET
    tipodepermiso = _tipodepermiso WHERE idpermisos = _idpermisos;
  END IF;

  SELECT _idpermisos AS 'idpermisos';
END

USE ALGA;

DELIMITER $$
USE `ALGA`$$

CREATE PROCEDURE `rolAddOrEdit` (
  IN _idrol INT,
  IN _rol VARCHAR(45),
  IN _permisos_idpermisos INT
)
BEGIN 
  IF _idrol = 0 THEN
    INSERT INTO rol (rol, permisos_idpermisos)
    VALUES (_rol, _permisos_idpermisos);

    SET _idrol = LAST_INSERT_ID();
  ELSE
    UPDATE rol
    SET
    rol = _rol, permisos_idpermisos = _permisos_idpermisos  WHERE idrol = _idrol OR permisos_idpermisos = _permisos_idpermisos;
  END IF;

  SELECT _idrol AS 'idrol';
END