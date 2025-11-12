<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pacientes - Clinica Lo Mismo Pero Mas Barato</title>

  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    rel="stylesheet" />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <link rel="stylesheet" href="../assets/css/estilos-globales.css" />
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
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="titulo-seccion mb-0">
          <i class="fas fa-user-injured me-2"></i>Control de Pacientes
        </h2>
        <button class="btn-primario" id="btnNuevoPaciente">
          <i class="fas fa-plus me-2"></i>Nuevo Paciente
        </button>
      </div>

      <!-- Vista Lista de Pacientes -->
      <div id="vistaListaPacientes">
        <div class="tarjeta">
          <div class="row mb-3">
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text">
                  <i class="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  class="form-control"
                  id="inputBuscar"
                  placeholder="Buscar paciente" />
              </div>
            </div>
            <div class="col-md-3">
              <select class="form-select" id="filtroEstado">
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <div class="col-md-3">
              <button class="btn-secundario w-100" id="btnFiltrar">
                <i class="fas fa-filter me-2"></i>Filtrar
              </button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="tabla-personalizada">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre Completo</th>
                  <th>Edad</th>
                  <th>Telefono</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody id="tablaPacientes">
                <!-- Datos de ejemplo -->
                <tr>
                  <td>#001</td>
                  <td>Juan Perez Garcia</td>
                  <td>35</td>
                  <td>5512345678</td>
                  <td>juan@email.com</td>
                  <td><span class="badge bg-success">Activo</span></td>
                  <td>
                    <button
                      class="btn btn-sm btn-info me-1"
                      onclick="verPaciente(1)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-warning me-1"
                      onclick="editarPaciente(1)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-danger"
                      onclick="eliminarPaciente(1)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>#002</td>
                  <td>Maria Lopez Sanchez</td>
                  <td>28</td>
                  <td>5587654321</td>
                  <td>maria@email.com</td>
                  <td><span class="badge bg-success">Activo</span></td>
                  <td>
                    <button
                      class="btn btn-sm btn-info me-1"
                      onclick="verPaciente(2)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-warning me-1"
                      onclick="editarPaciente(2)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-danger"
                      onclick="eliminarPaciente(2)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="d-flex justify-content-between align-items-center mt-3">
            <div>Mostrando 1 a 2 de 2 registros</div>
            <nav>
              <ul class="pagination mb-0">
                <li class="page-item disabled">
                  <a class="page-link" href="#">Anterior</a>
                </li>
                <li class="page-item active">
                  <a class="page-link" href="#">1</a>
                </li>
                <li class="page-item disabled">
                  <a class="page-link" href="#">Siguiente</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <!-- Vista Formulario Paciente -->
      <div id="vistaFormularioPaciente" style="display: none">
        <div class="tarjeta">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="titulo-tarjeta mb-0">
              <i class="fas fa-user-plus"></i>
              <span id="tituloFormulario">Nuevo Paciente</span>
            </h3>
            <button class="btn-secundario" id="btnVolverLista">
              <i class="fas fa-arrow-left me-2"></i>Volver
            </button>
          </div>

          <form id="formularioPaciente" method="POST">
            <div class="row">
              <div class="col-md-6">
                <div class="grupo-formulario">
                  <label class="etiqueta-formulario">
                    <i class="fas fa-user me-2"></i>Nombre(s)
                  </label>
                  <input
                    type="text"
                    class="campo-formulario"
                    id="nombre"
                    name="nombre"
                    placeholder="Ingresa el nombre"
                    required />
                </div>
              </div>

              <div class="col-md-6">
                <div class="grupo-formulario">
                  <label class="etiqueta-formulario">
                    <i class="fas fa-user me-2"></i>Apellidos
                  </label>
                  <input
                    type="text"
                    class="campo-formulario"
                    id="apellidos"
                    name="apellidos"
                    placeholder="Ingresa los apellidos"
                    required />
                </div>
              </div>

              <div class="col-md-4">
                <div class="grupo-formulario">
                  <label class="etiqueta-formulario">
                    <i class="fas fa-calendar me-2"></i>Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    class="campo-formulario"
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    required />
                </div>
              </div>

              <div class="col-md-4">
                <div class="grupo-formulario">
                  <label class="etiqueta-formulario">
                    <i class="fas fa-venus-mars me-2"></i>Genero
                  </label>
                  <select
                    class="campo-formulario"
                    id="genero"
                    name="genero"
                    required>
                    <option value="">Selecciona...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="O">Otro</option>
                  </select>
                </div>
              </div>

              <div class="col-md-4">
                <div class="grupo-formulario">
                  <label class="etiqueta-formulario">
                    <i class="fas fa-id-card me-2"></i>CURP
                  </label>
                  <input
                    type="text"
                    class="campo-formulario"
                    id="curp"
                    name="curp"
                    placeholder="CURP del paciente" />
                </div>
              </div>

              <div class="col-md-6">
                <div class="grupo-formulario">
                  <label class="etiqueta-formulario">
                    <i class="fas fa-phone me-2"></i>Telefono
                  </label>
                  <input
                    type="tel"
                    class="campo-formulario"
                    id="telefono"
                    name="telefono"
                    placeholder="10 dígitos"
                    required />
                </div>
              </div>

              <div class="col-md-6">
                <div class="grupo-formulario">
                  <label class="etiqueta-formulario">
                    <i class="fas fa-envelope me-2"></i>Email
                  </label>
                  <input
                    type="email"
                    class="campo-formulario"
                    id="email"
                    name="email"
                    placeholder="correo@ejemplo.com" />
                </div>
              </div>

              <div class="col-md-12">
                <div class="grupo-formulario">
                  <label class="etiqueta-formulario">
                    <i class="fas fa-map-marker-alt me-2"></i>Direccion
                  </label>
                  <textarea
                    class="campo-formulario"
                    id="direccion"
                    name="direccion"
                    rows="2"
                    placeholder="Direccion completa"></textarea>
                </div>
              </div>

              <div class="col-md-6">
                <div class="grupo-formulario">
                  <label class="etiqueta-formulario">
                    <i class="fas fa-tint me-2"></i>Tipo de Sangre
                  </label>
                  <select
                    class="campo-formulario"
                    id="tipoSangre"
                    name="tipoSangre">
                    <option value="">Selecciona...</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div class="col-md-6">
                <div class="grupo-formulario">
                  <label class="etiqueta-formulario">
                    <i class="fas fa-allergies me-2"></i>Alergias
                  </label>
                  <input
                    type="text"
                    class="campo-formulario"
                    id="alergias"
                    name="alergias"
                    placeholder="Alergias conocidas" />
                </div>
              </div>

              <div class="col-md-12">
                <div class="grupo-formulario">
                  <label class="etiqueta-formulario">
                    <i class="fas fa-notes-medical me-2"></i>Observaciones
                  </label>
                  <textarea
                    class="campo-formulario"
                    id="observaciones"
                    name="observaciones"
                    rows="3"
                    placeholder="Observaciones adicionales"></textarea>
                </div>
              </div>
            </div>

            <div class="d-flex gap-2 justify-content-end mt-4">
              <button
                type="button"
                class="btn-secundario"
                id="btnCancelarForm">
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
  <script src="../assets/js/controllers/controlador-pacientes.js"></script>
</body>

</html>