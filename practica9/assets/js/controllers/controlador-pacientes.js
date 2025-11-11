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

// Guardamos a los pacientes utilizando su archivo PHP
document
  .getElementById("formularioPaciente")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Creamos el FormData con los datos del formulario
    const formData = new FormData(this);

    mostrarCargando("Guardando paciente");

    // Enviamos los datos a su archivo PHP
    fetch("../php/registrar_paciente.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        // Verificamos si la respuesta es exitosa
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Primero obtenemos el texto de la respuesta
        return response.text();
      })
      .then((text) => {
        // Intentamos parsear como JSON
        try {
          const data = JSON.parse(text);
          cerrarCargando();

          if (data.success) {
            mostrarExito(data.mensaje);
            mostrarListaPacientes();
            cargarPacientes();
          } else {
            mostrarError(data.mensaje);
          }
        } catch (e) {
          // Si falla el parseo, mostramos el texto recibido para debug
          console.error("Respuesta del servidor:", text);
          throw new Error(
            "La respuesta del servidor no es JSON válido: " +
              text.substring(0, 100)
          );
        }
      })
      .catch((error) => {
        cerrarCargando();
        mostrarError("Error de conexion con el servidor: " + error.message);
        console.error("Error completo:", error);
      });
  });

function cargarPacientes() {
  // Se cargara la lista de pacientes desde PHP
  console.log("Cargando pacientes...");
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
