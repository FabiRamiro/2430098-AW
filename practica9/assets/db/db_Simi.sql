-- =============================================
-- Sistema de Base de Datos de Simi
-- =============================================

USE db_Simi;

-- =============================================
-- TABLAS DEL CATALOGO
-- =============================================

-- Tabla de Especialidades
CREATE TABLE Especialidades (
    IdEspecialidad          INT AUTO_INCREMENT PRIMARY KEY,
    NombreEspecialidad      VARCHAR(100) NOT NULL,
    Descripcion             VARCHAR(250),
    CONSTRAINT UQ_NombreEspecialidad UNIQUE (NombreEspecialidad)
);

-- =============================================
-- TABLAS PRINCIPALES
-- =============================================

-- Control de Pacientes
CREATE TABLE ControlPacientes (
    IdPaciente              INT AUTO_INCREMENT PRIMARY KEY,
    NombreCompleto          VARCHAR(150) NOT NULL,
    CURP                    VARCHAR(18) UNIQUE,
    FechaNacimiento         DATE NOT NULL,
    Sexo                    CHAR(1) CHECK (Sexo IN ('M', 'F')),
    Telefono                VARCHAR(20),
    CorreoElectronico       VARCHAR(100),
    Direccion               VARCHAR(250),
    ContactoEmergencia      VARCHAR(150),
    TelefonoEmergencia      VARCHAR(20),
    Alergias                VARCHAR(250),
    AntecedentesMedicos     TEXT,
    FechaRegistro           DATETIME DEFAULT CURRENT_TIMESTAMP,
    Estatus                 BOOLEAN DEFAULT TRUE
);

-- Control de Medicos
CREATE TABLE ControlMedicos (
    IdMedico                INT AUTO_INCREMENT PRIMARY KEY,
    NombreCompleto          VARCHAR(150) NOT NULL,
    CedulaProfesional       VARCHAR(50) UNIQUE NOT NULL,
    EspecialidadId          INT NOT NULL,
    Telefono                VARCHAR(20),
    CorreoElectronico       VARCHAR(100),
    HorarioAtencion         VARCHAR(100),
    FechaIngreso            DATETIME DEFAULT CURRENT_TIMESTAMP,
    Estatus                 BOOLEAN DEFAULT TRUE,
    CONSTRAINT FK_Medico_Especialidad FOREIGN KEY (EspecialidadId)
        REFERENCES Especialidades(IdEspecialidad)
);

-- Control de Agenda (Citas)
CREATE TABLE ControlAgenda (
    IdCita                  INT AUTO_INCREMENT PRIMARY KEY,
    IdPaciente              INT NOT NULL,
    IdMedico                INT NOT NULL,
    FechaCita               DATETIME NOT NULL,
    MotivoConsulta          VARCHAR(250),
    EstadoCita              VARCHAR(20) DEFAULT 'Programada'
        CHECK (EstadoCita IN ('Programada', 'Cancelada', 'Atendida', 'En Proceso', 'No Asistió')),
    Observaciones           VARCHAR(250),
    FechaRegistro           DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_Cita_Paciente FOREIGN KEY (IdPaciente)
        REFERENCES ControlPacientes(IdPaciente),
    CONSTRAINT FK_Cita_Medico FOREIGN KEY (IdMedico)
        REFERENCES ControlMedicos(IdMedico)
);

-- Expediente Clinico
CREATE TABLE ExpedienteClinico (
    IdExpediente            INT AUTO_INCREMENT PRIMARY KEY,
    IdPaciente              INT NOT NULL,
    IdMedico                INT NOT NULL,
    IdCita                  INT NULL,
    FechaConsulta           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Sintomas                TEXT,
    Diagnostico             TEXT,
    Tratamiento             TEXT,
    RecetaMedica            TEXT,
    NotasAdicionales        TEXT,
    ProximaCita             DATETIME NULL,
    CONSTRAINT FK_Expediente_Paciente FOREIGN KEY (IdPaciente)
        REFERENCES ControlPacientes(IdPaciente),
    CONSTRAINT FK_Expediente_Medico FOREIGN KEY (IdMedico)
        REFERENCES ControlMedicos(IdMedico),
    CONSTRAINT FK_Expediente_Cita FOREIGN KEY (IdCita)
        REFERENCES ControlAgenda(IdCita)
);

-- =============================================
-- TABLAS FINANCIERAS
-- =============================================

-- Gestor de Tarifas
CREATE TABLE GestorTarifas (
    IdTarifa                INT AUTO_INCREMENT PRIMARY KEY,
    DescripcionServicio     VARCHAR(150) NOT NULL,
    CostoBase               DECIMAL(10,2) NOT NULL CHECK (CostoBase >= 0),
    EspecialidadId          INT NULL,
    Estatus                 BOOLEAN DEFAULT TRUE,
    CONSTRAINT FK_Tarifa_Especialidad FOREIGN KEY (EspecialidadId)
        REFERENCES Especialidades(IdEspecialidad)
);

-- Gestor de Pagos
CREATE TABLE GestorPagos (
    IdPago                  INT AUTO_INCREMENT PRIMARY KEY,
    IdCita                  INT NOT NULL,
    IdPaciente              INT NOT NULL,
    Monto                   DECIMAL(10,2) NOT NULL CHECK (Monto >= 0),
    MetodoPago              VARCHAR(50) CHECK (MetodoPago IN ('Efectivo', 'Tarjeta', 'Transferencia', 'Cheque')),
    FechaPago               DATETIME DEFAULT CURRENT_TIMESTAMP,
    Referencia              VARCHAR(100),
    EstatusPago             VARCHAR(20) DEFAULT 'Pendiente'
        CHECK (EstatusPago IN ('Pagado', 'Pendiente', 'Cancelado', 'Reembolsado')),
    CONSTRAINT FK_Pago_Cita FOREIGN KEY (IdCita)
        REFERENCES ControlAgenda(IdCita),
    CONSTRAINT FK_Pago_Paciente FOREIGN KEY (IdPaciente)
        REFERENCES ControlPacientes(IdPaciente)
);

-- =============================================
-- TABLAS DE SISTEMA
-- =============================================

-- Usuarios del Sistema
CREATE TABLE UsuariosSistema (
    IdUsuario               INT AUTO_INCREMENT PRIMARY KEY,
    Usuario                 VARCHAR(50) UNIQUE NOT NULL,
    ContrasenaHash          VARCHAR(200) NOT NULL,
    Rol                     VARCHAR(50) CHECK (Rol IN ('Admin', 'Medico', 'Recepcionista', 'Secretaria', 'Secretario')),
    IdMedico                INT NULL,
    IdSecretario            INT NULL,
    Activo                  BOOLEAN DEFAULT TRUE,
    UltimoAcceso            DATETIME,
    FechaCreacion           DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_Usuario_Medico FOREIGN KEY (IdMedico)
        REFERENCES ControlMedicos(IdMedico)
);

-- Control de Secretarios
CREATE TABLE ControlSecretarios (
    IdSecretario            INT AUTO_INCREMENT PRIMARY KEY,
    NombreCompleto          VARCHAR(150) NOT NULL,
    Telefono                VARCHAR(20),
    CorreoElectronico       VARCHAR(100),
    Direccion               VARCHAR(250),
    FechaIngreso            DATETIME DEFAULT CURRENT_TIMESTAMP,
    Estatus                 BOOLEAN DEFAULT TRUE,
    IdUsuario               INT NULL,
    CONSTRAINT FK_Secretario_Usuario FOREIGN KEY (IdUsuario)
        REFERENCES UsuariosSistema(IdUsuario)
);

-- Relación entre Secretarios y Médicos (a su cuidado)
CREATE TABLE SecretariosMedicos (
    IdRelacion              INT AUTO_INCREMENT PRIMARY KEY,
    IdSecretario            INT NOT NULL,
    IdMedico                INT NOT NULL,
    FechaAsignacion         DATETIME DEFAULT CURRENT_TIMESTAMP,
    Estatus                 BOOLEAN DEFAULT TRUE,
    CONSTRAINT FK_SecMed_Secretario FOREIGN KEY (IdSecretario)
        REFERENCES ControlSecretarios(IdSecretario),
    CONSTRAINT FK_SecMed_Medico FOREIGN KEY (IdMedico)
        REFERENCES ControlMedicos(IdMedico),
    CONSTRAINT UQ_Secretario_Medico UNIQUE (IdSecretario, IdMedico)
);

-- Bitacora de Acceso
CREATE TABLE BitacoraAcceso (
    IdBitacora              INT AUTO_INCREMENT PRIMARY KEY,
    IdUsuario               INT NOT NULL,
    FechaAcceso             DATETIME DEFAULT CURRENT_TIMESTAMP,
    AccionRealizada         VARCHAR(250),
    Modulo                  VARCHAR(100),
    DireccionIP             VARCHAR(50),
    CONSTRAINT FK_Bitacora_Usuario FOREIGN KEY (IdUsuario)
        REFERENCES UsuariosSistema(IdUsuario)
);

-- Reportes
CREATE TABLE Reportes (
    IdReporte               INT AUTO_INCREMENT PRIMARY KEY,
    TipoReporte             VARCHAR(50) CHECK (TipoReporte IN ('Medico', 'Financiero', 'Citas', 'Inventario', 'Auditoria')),
    IdPaciente              INT NULL,
    IdMedico                INT NULL,
    FechaGeneracion         DATETIME DEFAULT CURRENT_TIMESTAMP,
    RutaArchivo             VARCHAR(250),
    Descripcion             VARCHAR(250),
    GeneradoPor             VARCHAR(100),
    CONSTRAINT FK_Reporte_Paciente FOREIGN KEY (IdPaciente)
        REFERENCES ControlPacientes(IdPaciente),
    CONSTRAINT FK_Reporte_Medico FOREIGN KEY (IdMedico)
        REFERENCES ControlMedicos(IdMedico)
);

-- =============================================
-- INDICES PARA EL RENDIMIENTO
-- =============================================

CREATE INDEX IX_Paciente_CURP ON ControlPacientes(CURP);
CREATE INDEX IX_Paciente_Nombre ON ControlPacientes(NombreCompleto);
CREATE INDEX IX_Paciente_Estatus ON ControlPacientes(Estatus);

CREATE INDEX IX_Medico_Especialidad ON ControlMedicos(EspecialidadId);
CREATE INDEX IX_Medico_Cedula ON ControlMedicos(CedulaProfesional);

CREATE INDEX IX_Cita_Fecha ON ControlAgenda(FechaCita);
CREATE INDEX IX_Cita_Paciente ON ControlAgenda(IdPaciente);
CREATE INDEX IX_Cita_Medico ON ControlAgenda(IdMedico);
CREATE INDEX IX_Cita_Estado ON ControlAgenda(EstadoCita);

CREATE INDEX IX_Expediente_Paciente ON ExpedienteClinico(IdPaciente);
CREATE INDEX IX_Expediente_Medico ON ExpedienteClinico(IdMedico);
CREATE INDEX IX_Expediente_Fecha ON ExpedienteClinico(FechaConsulta);

CREATE INDEX IX_Pago_Estatus ON GestorPagos(EstatusPago);
CREATE INDEX IX_Pago_Fecha ON GestorPagos(FechaPago);

CREATE INDEX IX_Bitacora_Fecha ON BitacoraAcceso(FechaAcceso);
CREATE INDEX IX_Bitacora_Usuario ON BitacoraAcceso(IdUsuario);

-- Indices para Secretarios
CREATE INDEX IX_Secretario_Nombre ON ControlSecretarios(NombreCompleto);
CREATE INDEX IX_Secretario_Estatus ON ControlSecretarios(Estatus);
CREATE INDEX IX_Secretario_Usuario ON ControlSecretarios(IdUsuario);

CREATE INDEX IX_SecMed_Secretario ON SecretariosMedicos(IdSecretario);
CREATE INDEX IX_SecMed_Medico ON SecretariosMedicos(IdMedico);
CREATE INDEX IX_SecMed_Estatus ON SecretariosMedicos(Estatus);

-- Agregar FK de IdSecretario en UsuariosSistema (después de crear ControlSecretarios)
ALTER TABLE UsuariosSistema
    ADD CONSTRAINT FK_Usuario_Secretario FOREIGN KEY (IdSecretario)
        REFERENCES ControlSecretarios(IdSecretario);

CREATE INDEX IX_Usuario_Secretario ON UsuariosSistema(IdSecretario);