document.addEventListener("DOMContentLoaded", function () {
  // Verificamos si la sesión es activa
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (!usuarioActivo) return;

  // Referencias a elementos de usuario
  const correoUsuario = document.getElementById("correoUsuario");
  const btnCerrarSesion = document.getElementById(btnCerrarSesion);

  // Referencias a elementos de los proyectos
  const listaProyectos = document.getElementById("listaProyectos");
  const formularioProyecto = document.getElementById("formularioProyecto");
  const btnGuardarProyecto = document.getElementById("btnGuardarProyecto");
  const modalProyecto = new bootstrap.Modal(
    document.getElementById("modalProyecto")
  );

  // Elementos de tareas
  const formularioTarea = document.getElementById("formularioTarea");
  const btnGuardarTarea = document.getElementById("btnGuardarTarea");
  const btnAgregarTarea = document.getElementById("btnAgregarTarea");
  const modalTarea = new bootstrap.Modal(document.getElementById("modalTarea"));

  // Tablero del drag & drop
  const listaPendiente = document.getElementById("listaPendiente");
  const listaEnProceso = document.getElementById("listaEnProceso");
  const listaHecha = document.getElementById("listaHecha");

  // Informacion del proyecto
  const infoProyecto = document.getElementById("infoProyecto");
  const tableroTareas = document.getElementById("tableroTareas");
  const mensajeInicial = document.getElementById("mensajeInicial");

  // Variables globales
  let proyectoActual = null;
  let elementosArrastrado = null;

  // === LocalStorage ===
  // Obtenemos todos los proyectos del usuario actual
  const obtenerProyectos = () => {
    const proyectosGuardados = localStorage.getItem(
      `proyectos_${usuarioActivo}`
    );
    return proyectosGuardados ? JSON.parse(proyectosGuardados) : [];
  };

  // Guardamos en el array de proyectos del localStorage
  const guardarProyectos = (proyectos) => {
    localStorage.setItem(
      `proyectos_${usuarioActivo}`,
      JSON.stringify(proyectos)
    );
  };
});
