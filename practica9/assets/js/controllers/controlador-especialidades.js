document.addEventListener("DOMContentLoaded", function () {
  verificarSesion();
  inicializarEspecialidades();
});

function verificarSesion() {
  const sesionActiva = sessionStorage.getItem("sesionActiva");
  if (!sesionActiva) {
    window.location.href = "../index.html";
  }

  const usuario = sessionStorage.getItem("usuario");
  if (usuario) {
    document.getElementById("nombreUsuario").textContent = usuario;
    document.getElementById("inicialesUsuario").textContent = usuario
      .charAt(0)
      .toUpperCase();
  }
}

function inicializarEspecialidades() {
  anime({
    targets: ".tarjeta-especialidad",
    translateY: [80, 0],
    opacity: [0, 1],
    delay: anime.stagger(120),
    duration: 800,
    easing: "easeOutElastic(1, .5)",
  });

  cargarEspecialidades();
}

// Mostramos el formulario para la nueva especialidad
document
  .getElementById("btnNuevaEspecialidad")
  .addEventListener("click", function () {
    mostrarFormularioEspecialidad("nueva");
  });

document
  .getElementById("btnVolverListaEspecialidades")
  .addEventListener("click", function () {
    mostrarListaEspecialidades();
  });

document
  .getElementById("btnCancelarFormEspecialidad")
  .addEventListener("click", function () {
    mostrarListaEspecialidades();
  });

function mostrarFormularioEspecialidad(tipo, datos = null) {
  document.getElementById("vistaListaEspecialidades").style.display = "none";
  document.getElementById("vistaFormularioEspecialidad").style.display =
    "block";

  if (tipo === "nueva") {
    document.getElementById("tituloFormularioEspecialidad").textContent =
      "Nueva Especialidad";
    document.getElementById("formularioEspecialidad").reset();
    document.getElementById("especialidadActiva").checked = true;
    document.getElementById("colorEspecialidad").value = "#00a0e3";
  } else {
    document.getElementById("tituloFormularioEspecialidad").textContent =
      "Editar Especialidad";
    if (datos) {
      document.getElementById("nombreEspecialidad").value = datos.nombre;
      document.getElementById("iconoEspecialidad").value = datos.icono;
      document.getElementById("descripcionEspecialidad").value =
        datos.descripcion;
      document.getElementById("duracionConsultaEspecialidad").value =
        datos.duracion;
      document.getElementById("colorEspecialidad").value = datos.color;
      document.getElementById("especialidadActiva").checked = datos.activa;
    }
  }

  anime({
    targets: "#vistaFormularioEspecialidad .tarjeta",
    scale: [0.8, 1],
    opacity: [0, 1],
    duration: 600,
    easing: "easeOutElastic(1, .5)",
  });
}

function mostrarListaEspecialidades() {
  document.getElementById("vistaFormularioEspecialidad").style.display = "none";
  document.getElementById("vistaListaEspecialidades").style.display = "block";

  anime({
    targets: ".tarjeta-especialidad",
    scale: [0.9, 1],
    opacity: [0, 1],
    delay: anime.stagger(80),
    duration: 500,
    easing: "easeOutExpo",
  });
}

// Guardamos la especialidad
document
  .getElementById("formularioEspecialidad")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const datosEspecialidad = {
      nombre: document.getElementById("nombreEspecialidad").value,
      icono: document.getElementById("iconoEspecialidad").value,
      descripcion: document.getElementById("descripcionEspecialidad").value,
      duracion: document.getElementById("duracionConsultaEspecialidad").value,
      color: document.getElementById("colorEspecialidad").value,
      activa: document.getElementById("especialidadActiva").checked,
    };

    mostrarCargando("Guardando especialidad");

    setTimeout(() => {
      cerrarCargando();
      mostrarExito("Especialidad guardada correctamente");
      mostrarListaEspecialidades();
      cargarEspecialidades();
    }, 1500);
  });

function cargarEspecialidades() {
  console.log("...");
}

function editarEspecialidad(id) {
  mostrarFormularioEspecialidad("editar", {
    nombre: "Medicina General",
    icono: "fa-user-md",
    descripcion: "Atencion medica integral",
    duracion: "30",
    color: "#00a0e3",
    activa: true,
  });
}

function verDetalleEspecialidad(id) {
  // AQUI se supone va a ir la llamada a PHP para los detalles
  Swal.fire({
    title: "Detalles de la Especialidad",
    html: `
            <div style="text-align: left;">
                <h5>Medicina General</h5>
                <p><strong>Medicos asignados:</strong> 3</p>
                <p><strong>Pacientes atendidos:</strong> 45</p>
                <p><strong>Duracion consulta:</strong> 30 minutos</p>
                <p><strong>Estado:</strong> Activa</p>
                <hr>
                <p><strong>Médicos:</strong></p>
                <ul>
                    <li>Dr. Juan Garcia</li>
                    <li>Dra. Maria Lopez</li>
                    <li>Dr. Coronado Sanchez</li>
                </ul>
            </div>
        `,
    icon: "info",
    confirmButtonColor: "#00a0e3",
    width: 600,
  });
}

// Para la busqueda
document
  .getElementById("inputBuscarEspecialidad")
  .addEventListener("input", function (e) {
    const termino = e.target.value.toLowerCase();
    const tarjetas = document.querySelectorAll(".tarjeta-especialidad");

    tarjetas.forEach((tarjeta) => {
      const nombre = tarjeta
        .querySelector(".nombre-especialidad")
        .textContent.toLowerCase();
      const descripcion = tarjeta
        .querySelector(".descripcion-especialidad")
        .textContent.toLowerCase();

      if (nombre.includes(termino) || descripcion.includes(termino)) {
        tarjeta.parentElement.style.display = "block";
        anime({
          targets: tarjeta.parentElement,
          opacity: [0, 1],
          scale: [0.9, 1],
          duration: 300,
        });
      } else {
        tarjeta.parentElement.style.display = "none";
      }
    });
  });

// Filtro por estado
document
  .getElementById("filtroEstadoEspecialidad")
  .addEventListener("change", function (e) {
    console.log("Filtrar por estado:", e.target.value);
  });
