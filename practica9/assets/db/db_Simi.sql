-- =============================================
-- Sistema de Base de Datos de MediClinic
-- =============================================

-- Crear la base de datos
CREATE DATABASE db_MediClinic;
GO

USE db_MediClinic;
GO

-- =============================================
-- TABLAS DEL CATALOGO
-- =============================================

-- Tabla de Especialidades
CREATE TABLE Especialidades (
    IdEspecialidad          INT IDENTITY(1,1) PRIMARY KEY,
    NombreEspecialidad      NVARCHAR(100) NOT NULL,
    Descripcion             NVARCHAR(250),
    CONSTRAINT UQ_NombreEspecialidad UNIQUE (NombreEspecialidad)
);

-- =============================================
-- TABLAS PRINCIPALES
-- =============================================

-- Control de Pacientes
CREATE TABLE ControlPacientes (
    IdPaciente              INT IDENTITY(1,1) PRIMARY KEY,
    NombreCompleto          NVARCHAR(150) NOT NULL,
    CURP                    NVARCHAR(18) UNIQUE,
    FechaNacimiento         DATE NOT NULL,
    Sexo                    CHAR(1) CHECK (Sexo IN ('M', 'F')),
    Telefono                NVARCHAR(20),
    CorreoElectronico       NVARCHAR(100),
    Direccion               NVARCHAR(250),
    ContactoEmergencia      NVARCHAR(150),
    TelefonoEmergencia      NVARCHAR(20),
    Alergias                NVARCHAR(250),
    AntecedentesMedicos     NVARCHAR(MAX),
    FechaRegistro           DATETIME DEFAULT GETDATE(),
    Estatus                 BIT DEFAULT 1, -- 1=Activo, 0=Inactivo
    CONSTRAINT CHK_CURP_Length CHECK (LEN(CURP) = 18 OR CURP IS NULL)
);

-- Control de Medicos
CREATE TABLE ControlMedicos (
    IdMedico                INT IDENTITY(1,1) PRIMARY KEY,
    NombreCompleto          NVARCHAR(150) NOT NULL,
    CedulaProfesional       NVARCHAR(50) UNIQUE NOT NULL,
    EspecialidadId          INT NOT NULL,
    Telefono                NVARCHAR(20),
    CorreoElectronico       NVARCHAR(100),
    HorarioAtencion         NVARCHAR(100),
    FechaIngreso            DATETIME DEFAULT GETDATE(),
    Estatus                 BIT DEFAULT 1,
    CONSTRAINT FK_Medico_Especialidad FOREIGN KEY (EspecialidadId)
        REFERENCES Especialidades(IdEspecialidad)
);

-- Control de Agenda (Citas)
CREATE TABLE ControlAgenda (
    IdCita                  INT IDENTITY(1,1) PRIMARY KEY,
    IdPaciente              INT NOT NULL,
    IdMedico                INT NOT NULL,
    FechaCita               DATETIME NOT NULL,
    MotivoConsulta          NVARCHAR(250),
    EstadoCita              NVARCHAR(20) DEFAULT 'Programada'
        CHECK (EstadoCita IN ('Programada', 'Cancelada', 'Atendida', 'En Proceso', 'No Asistió')),
    Observaciones           NVARCHAR(250),
    FechaRegistro           DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Cita_Paciente FOREIGN KEY (IdPaciente)
        REFERENCES ControlPacientes(IdPaciente),
    CONSTRAINT FK_Cita_Medico FOREIGN KEY (IdMedico)
        REFERENCES ControlMedicos(IdMedico)
);

-- Expediente Clinico
CREATE TABLE ExpedienteClinico (
    IdExpediente            INT IDENTITY(1,1) PRIMARY KEY,
    IdPaciente              INT NOT NULL,
    IdMedico                INT NOT NULL,
    IdCita                  INT NULL, -- Relacionamos con la cita que genero este expediente
    FechaConsulta           DATETIME NOT NULL DEFAULT GETDATE(),
    Sintomas                NVARCHAR(MAX),
    Diagnostico             NVARCHAR(MAX),
    Tratamiento             NVARCHAR(MAX),
    RecetaMedica            NVARCHAR(MAX),
    NotasAdicionales        NVARCHAR(MAX),
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
    IdTarifa                INT IDENTITY(1,1) PRIMARY KEY,
    DescripcionServicio     NVARCHAR(150) NOT NULL,
    CostoBase               DECIMAL(10,2) NOT NULL CHECK (CostoBase >= 0),
    EspecialidadId          INT NULL, -- Permite tarifas generales o por especialidad
    Estatus                 BIT DEFAULT 1,
    CONSTRAINT FK_Tarifa_Especialidad FOREIGN KEY (EspecialidadId)
        REFERENCES Especialidades(IdEspecialidad)
);

-- Gestor de Pagos
CREATE TABLE GestorPagos (
    IdPago                  INT IDENTITY(1,1) PRIMARY KEY,
    IdCita                  INT NOT NULL,
    IdPaciente              INT NOT NULL,
    Monto                   DECIMAL(10,2) NOT NULL CHECK (Monto >= 0),
    MetodoPago              NVARCHAR(50) CHECK (MetodoPago IN ('Efectivo', 'Tarjeta', 'Transferencia', 'Cheque')),
    FechaPago               DATETIME DEFAULT GETDATE(),
    Referencia              NVARCHAR(100),
    EstatusPago             NVARCHAR(20) DEFAULT 'Pendiente'
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
    IdUsuario               INT IDENTITY(1,1) PRIMARY KEY,
    Usuario                 NVARCHAR(50) UNIQUE NOT NULL,
    ContrasenaHash          NVARCHAR(200) NOT NULL,
    Rol                     NVARCHAR(50) CHECK (Rol IN ('Admin', 'Medico', 'Recepcionista', 'Enfermera')),
    IdMedico                INT NULL, -- Si el usuario es medico
    Activo                  BIT DEFAULT 1,
    UltimoAcceso            DATETIME,
    FechaCreacion           DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Usuario_Medico FOREIGN KEY (IdMedico)
        REFERENCES ControlMedicos(IdMedico)
);

-- Bitacora de Acceso
CREATE TABLE BitacoraAcceso (
    IdBitacora              INT IDENTITY(1,1) PRIMARY KEY,
    IdUsuario               INT NOT NULL,
    FechaAcceso             DATETIME DEFAULT GETDATE(),
    AccionRealizada         NVARCHAR(250),
    Modulo                  NVARCHAR(100),
    DireccionIP             NVARCHAR(50),
    CONSTRAINT FK_Bitacora_Usuario FOREIGN KEY (IdUsuario)
        REFERENCES UsuariosSistema(IdUsuario)
);

-- Reportes
CREATE TABLE Reportes (
    IdReporte               INT IDENTITY(1,1) PRIMARY KEY,
    TipoReporte             NVARCHAR(50) CHECK (TipoReporte IN ('Medico', 'Financiero', 'Citas', 'Inventario', 'Auditoria')),
    IdPaciente              INT NULL,
    IdMedico                INT NULL,
    FechaGeneracion         DATETIME DEFAULT GETDATE(),
    RutaArchivo             NVARCHAR(250),
    Descripcion             NVARCHAR(250),
    GeneradoPor             NVARCHAR(100),
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
