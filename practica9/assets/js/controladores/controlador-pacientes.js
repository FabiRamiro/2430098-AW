// Verificamos la sesion al cargar
document.addEventListener("DOMContentLoaded", function () {
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

  inicializarPacientes();
});

function inicializarPacientes() {
  // La animacion de entrada
  anime({
    targets: ".tarjeta",
    translateY: [30, 0],
    opacity: [0, 1],
    duration: 600,
    easing: "easeOutExpo",
  });

  cargarPacientes();
}

// Mostramos el formulario del nuevo paciente
document
  .getElementById("btnNuevoPaciente")
  .addEventListener("click", function () {
    mostrarFormularioPaciente("nuevo");
  });

// Volver a la lista
document
  .getElementById("btnVolverLista")
  .addEventListener("click", function () {
    mostrarListaPacientes();
  });

document
  .getElementById("btnCancelarForm")
  .addEventListener("click", function () {
    mostrarListaPacientes();
  });

function mostrarFormularioPaciente(tipo, datos = null) {
  document.getElementById("vistaListaPacientes").style.display = "none";
  document.getElementById("vistaFormularioPaciente").style.display = "block";

  if (tipo === "nuevo") {
    document.getElementById("tituloFormulario").textContent = "Nuevo Paciente";
    document.getElementById("formularioPaciente").reset();
  } else {
    document.getElementById("tituloFormulario").textContent = "Editar Paciente";
    // Cargar datos del paciente
    if (datos) {
      document.getElementById("nombre").value = datos.nombre;
      document.getElementById("apellidos").value = datos.apellidos;
      // Y mas y mas
    }
  }

  anime({
    targets: "#vistaFormularioPaciente .tarjeta",
    translateX: [100, 0],
    opacity: [0, 1],
    duration: 500,
    easing: "easeOutExpo",
  });
}

function mostrarListaPacientes() {
  document.getElementById("vistaFormularioPaciente").style.display = "none";
  document.getElementById("vistaListaPacientes").style.display = "block";

  anime({
    targets: "#vistaListaPacientes .tarjeta",
    translateX: [-100, 0],
    opacity: [0, 1],
    duration: 500,
    easing: "easeOutExpo",
  });
}

// Guardamos al paciente o bueno, TEORICAMENTE
document
  .getElementById("formularioPaciente")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const datosFormulario = {
      nombre: document.getElementById("nombre").value,
      apellidos: document.getElementById("apellidos").value,
      fechaNacimiento: document.getElementById("fechaNacimiento").value,
      genero: document.getElementById("genero").value,
      curp: document.getElementById("curp").value,
      telefono: document.getElementById("telefono").value,
      email: document.getElementById("email").value,
      direccion: document.getElementById("direccion").value,
      tipoSangre: document.getElementById("tipoSangre").value,
      alergias: document.getElementById("alergias").value,
      observaciones: document.getElementById("observaciones").value,
    };

    mostrarCargando("Guardando paciente");

    setTimeout(() => {
      cerrarCargando();
      mostrarExito("Paciente guardado correctamente");
      mostrarListaPacientes();
      cargarPacientes();
    }, 1500);
  });

function cargarPacientes() {
  // TEORICAMENTE aqui iria el manejamiento con php
  console.log("...");
}

function verPaciente(id) {
  // Aqui se mostrara un modal o vista con los detalles del paciente
  Swal.fire({
    title: "Detalles del Paciente",
    html: "<p>Vista detallada del paciente #" + id + "</p>",
    icon: "info",
    confirmButtonColor: "#00a0e3",
  });
}

function editarPaciente(id) {
  mostrarFormularioPaciente("editar", {
    nombre: "Gerardo",
    apellidos: "Portes Teran",
  });
}

function eliminarPaciente(id) {
  confirmarAccion(
    "¿Eliminar paciente?",
    "¿Estas seguro de eliminar este paciente?"
  ).then((result) => {
    if (result.isConfirmed) {
      mostrarCargando("Eliminando");

      setTimeout(() => {
        cerrarCargando();
        mostrarExito("Paciente eliminado correctamente");
        cargarPacientes();
      }, 1000);
    }
  });
}

// La busqueda
document.getElementById("inputBuscar").addEventListener("input", function (e) {
  const termino = e.target.value.toLowerCase();
  // Aqui se filtraran los pacientes
  console.log("Buscando:", termino);
});
