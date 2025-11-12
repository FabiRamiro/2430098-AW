<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Enfermeros - Clinica Lo Mismo Pero Mas Barato</title>

    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet" />
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    <link rel="stylesheet" href="../assets/css/estilos-globales.css" />

    <style>
        .tarjeta-enfermero {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            transition: all 0.3s;
            height: 100%;
        }

        .tarjeta-enfermero:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        }

        .foto-enfermero {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: linear-gradient(135deg,
                    var(--color-principal),
                    var(--color-secundario));
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            margin: 0 auto 1rem;
        }

        .nombre-enfermero {
            color: var(--color-principal);
            font-size: 1.2rem;
            font-weight: 600;
            text-align: center;
            margin-bottom: 0.5rem;
        }

        .rol-enfermero {
            color: var(--color-texto-claro);
            text-align: center;
            margin-bottom: 1rem;
        }

        .info-enfermero {
            font-size: 0.9rem;
            color: var(--color-texto);
            margin-bottom: 0.5rem;
        }

        .info-enfermero i {
            color: var(--color-principal);
            width: 20px;
        }
    </style>
</head>

<body>
    <div class="overlay" id="overlay"></div>

    <nav class="navegacion-lateral" id="navegacionLateral">
        <div class="encabezado-lateral">
            <button class="btn-cerrar-lateral" id="btnCerrarLateral">
                <i class="fas fa-times"></i>
            </button>
            <h3>Menu</h3>
        </div>
        <ul class="menu-lateral">
            <li class="item-menu-lateral">
                <a href="dashboard.html" class="enlace-menu-lateral">
                    <i class="fas fa-home"></i><span>Dashboard</span>
                </a>
            </li>
            <li class="item-menu-lateral">
                <a href="pacientes.php" class="enlace-menu-lateral">
                    <i class="fas fa-user-injured"></i><span>Pacientes</span>
                </a>
            </li>
            <li class="item-menu-lateral">
                <a href="agenda.html" class="enlace-menu-lateral">
                    <i class="fas fa-calendar-alt"></i><span>Agenda</span>
                </a>
            </li>
            <li class="item-menu-lateral">
                <a href="medicos.php" class="enlace-menu-lateral">
                    <i class="fas fa-user-md"></i><span>Medicos</span>
                </a>
            </li>
            <li class="item-menu-lateral">
                <a href="enfermeros.php" class="enlace-menu-lateral activo">
                    <i class="fas fa-user-nurse"></i><span>Enfermeros</span>
                </a>
            </li>
            <li class="item-menu-lateral">
                <a href="reportes.html" class="enlace-menu-lateral">
                    <i class="fas fa-chart-bar"></i><span>Reportes</span>
                </a>
            </li>
            <li class="item-menu-lateral">
                <a href="pagos.html" class="enlace-menu-lateral">
                    <i class="fas fa-credit-card"></i><span>Pagos</span>
                </a>
            </li>
            <li class="item-menu-lateral">
                <a href="tarifas.html" class="enlace-menu-lateral">
                    <i class="fas fa-dollar-sign"></i><span>Tarifas</span>
                </a>
            </li>
            <li class="item-menu-lateral">
                <a href="bitacoras.html" class="enlace-menu-lateral">
                    <i class="fas fa-history"></i><span>Bitacoras</span>
                </a>
            </li>
            <li class="item-menu-lateral">
                <a href="especialidades.php" class="enlace-menu-lateral">
                    <i class="fas fa-stethoscope"></i><span>Especialidades</span>
                </a>
            </li>
        </ul>
    </nav>

    <div class="contenedor-principal">
        <header class="barra-superior">
            <div class="contenido-barra">
                <div class="logo-sistema">
                    <button class="btn-toggle-menu" id="btnToggleMenu">
                        <i class="fas fa-bars"></i>
                    </button>
                    <img
                        src="../assets/img/logo-simi.png"
                        alt="Logo"
                        class="logo-imagen" />
                    <h1>Clinica Lo Mismo Pero Mas Barato</h1>
                </div>
                <div class="info-usuario">
                    <div class="usuario-perfil">
                        <span id="nombreUsuario">Usuario</span>
                        <div class="avatar-usuario">
                            <span id="inicialesUsuario">U</span>
                        </div>
                    </div>
                    <button class="btn-cerrar-sesion" id="btnCerrarSesion">
                        <i class="fas fa-sign-out-alt"></i> Salir
                    </button>
                </div>
            </div>
        </header>

        <main class="contenido-principal">
            <div
                class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h2 class="titulo-seccion mb-0">
                    <i class="fas fa-user-nurse me-2"></i>Control de Enfermeros
                </h2>
                <button class="btn-primario" id="btnNuevoEnfermero">
                    <i class="fas fa-plus me-2"></i>Nuevo Enfermero
                </button>
            </div>

            <!-- Vista Lista Enfermeros -->
            <div id="vistaListaEnfermeros">
                <div class="row mb-3">
                    <div class="col-md-8">
                        <div class="input-group">
                            <span class="input-group-text">
                                <i class="fas fa-search"></i>
                            </span>
                            <input
                                type="text"
                                class="form-control"
                                id="inputBuscarEnfermero"
                                placeholder="Buscar enfermero..." />
                        </div>
                    </div>
                    <div class="col-md-4">
                        <select class="form-select" id="filtroEstadoEnfermero">
                            <option value="">Todos</option>
                            <option value="activo">Activos</option>
                            <option value="inactivo">Inactivos</option>
                        </select>
                    </div>
                </div>

                <div class="row" id="contenedorEnfermeros">
                    <!-- Tarjeta Enfermero de ejemplo -->
                    <div class="col-md-4 col-lg-3 mb-4">
                        <div class="tarjeta-enfermero">
                            <div class="foto-enfermero">
                                <i class="fas fa-user-nurse"></i>
                            </div>
                            <h4 class="nombre-enfermero">Maria Lopez</h4>
                            <p class="rol-enfermero">Enfermera</p>
                            <div class="info-enfermero">
                                <i class="fas fa-user"></i>
                                Usuario: maria.lopez
                            </div>
                            <div class="info-enfermero">
                                <i class="fas fa-check-circle"></i>
                                Estado: Activo
                            </div>
                            <div class="d-flex gap-2 mt-3">
                                <button
                                    class="btn btn-sm btn-info flex-fill"
                                    onclick="verEnfermero(1)">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button
                                    class="btn btn-sm btn-warning flex-fill"
                                    onclick="editarEnfermero(1)">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button
                                    class="btn btn-sm btn-danger flex-fill"
                                    onclick="eliminarEnfermero(1)">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Vista del Formulario de Enfermero -->
            <div id="vistaFormularioEnfermero" style="display: none">
                <div class="tarjeta">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h3 class="titulo-tarjeta mb-0">
                            <i class="fas fa-user-nurse"></i>
                            <span id="tituloFormularioEnfermero">Nuevo Enfermero</span>
                        </h3>
                        <button class="btn-secundario" id="btnVolverListaEnfermeros">
                            <i class="fas fa-arrow-left me-2"></i>Volver
                        </button>
                    </div>

                    <form id="formularioEnfermero" method="POST">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="grupo-formulario">
                                    <label class="etiqueta-formulario">
                                        <i class="fas fa-user me-2"></i>Usuario
                                    </label>
                                    <input
                                        type="text"
                                        class="campo-formulario"
                                        id="usuarioEnfermero"
                                        name="usuarioEnfermero"
                                        placeholder="Nombre de usuario"
                                        required />
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="grupo-formulario">
                                    <label class="etiqueta-formulario">
                                        <i class="fas fa-lock me-2"></i>Contrasena
                                    </label>
                                    <input
                                        type="password"
                                        class="campo-formulario"
                                        id="contrasenaEnfermero"
                                        name="contrasenaEnfermero"
                                        placeholder="Contrasena del usuario"
                                        required />
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="grupo-formulario">
                                    <label class="etiqueta-formulario">
                                        <i class="fas fa-user-tag me-2"></i>Rol
                                    </label>
                                    <select
                                        class="campo-formulario"
                                        id="rolEnfermero"
                                        name="rolEnfermero"
                                        required>
                                        <option value="">Selecciona el rol...</option>
                                        <option value="Enfermera">Enfermera</option>
                                        <option value="Enfermero">Enfermero</option>
                                    </select>
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="alert alert-info">
                                    <i class="fas fa-info-circle me-2"></i>
                                    <strong>Nota:</strong> El usuario y contrasena seran
                                    utilizados para iniciar sesion en el sistema.
                                </div>
                            </div>
                        </div>

                        <div class="d-flex gap-2 justify-content-end mt-4">
                            <button
                                type="button"
                                class="btn-secundario"
                                id="btnCancelarFormEnfermero">
                                <i class="fas fa-times me-2"></i>Cancelar
                            </button>
                            <button type="submit" class="btn-primario">
                                <i class="fas fa-save me-2"></i>Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>

        <nav class="navegacion-inferior">
            <ul class="menu-navegacion">
                <li class="item-menu">
                    <a href="dashboard.html" class="enlace-menu">
                        <i class="fas fa-home"></i><span>Inicio</span>
                    </a>
                </li>
                <li class="item-menu">
                    <a href="pacientes.php" class="enlace-menu">
                        <i class="fas fa-user-injured"></i><span>Pacientes</span>
                    </a>
                </li>
                <li class="item-menu">
                    <a href="agenda.html" class="enlace-menu">
                        <i class="fas fa-calendar-alt"></i><span>Agenda</span>
                    </a>
                </li>
                <li class="item-menu">
                    <a href="medicos.php" class="enlace-menu">
                        <i class="fas fa-user-md"></i><span>Medicos</span>
                    </a>
                </li>
                <li class="item-menu">
                    <a href="enfermeros.php" class="enlace-menu activo">
                        <i class="fas fa-user-nurse"></i><span>Enfermeros</span>
                    </a>
                </li>
                <li class="item-menu">
                    <a href="reportes.html" class="enlace-menu">
                        <i class="fas fa-chart-bar"></i><span>Reportes</span>
                    </a>
                </li>
                <li class="item-menu">
                    <a href="pagos.html" class="enlace-menu">
                        <i class="fas fa-credit-card"></i><span>Pagos</span>
                    </a>
                </li>
                <li class="item-menu">
                    <a href="tarifas.html" class="enlace-menu">
                        <i class="fas fa-dollar-sign"></i><span>Tarifas</span>
                    </a>
                </li>
                <li class="item-menu">
                    <a href="bitacoras.html" class="enlace-menu">
                        <i class="fas fa-history"></i><span>Bitacoras</span>
                    </a>
                </li>
                <li class="item-menu">
                    <a href="especialidades.php" class="enlace-menu">
                        <i class="fas fa-stethoscope"></i><span>Especialidades</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>

    <script src="../assets/js/utils/navegacion.js"></script>
    <script src="../assets/js/utils/validaciones.js"></script>
    <script src="../assets/js/controllers/controlador-enfermeros.js"></script>
</body>

</html>