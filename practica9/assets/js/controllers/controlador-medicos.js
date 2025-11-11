document.addEventListener("DOMContentLoaded", function () {
  verificarSesion();
  inicializarMedicos();
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

function inicializarMedicos() {
  anime({
    targets: ".tarjeta-medico",
    translateY: [50, 0],
    opacity: [0, 1],
    delay: anime.stagger(100),
    duration: 600,
    easing: "easeOutExpo",
  });

  cargarMedicos();
}

// Mostramos el formulario de nuevo medico
document
  .getElementById("btnNuevoMedico")
  .addEventListener("click", function () {
    mostrarFormularioMedico("nuevo");
  });

document
  .getElementById("btnVolverListaMedicos")
  .addEventListener("click", function () {
    mostrarListaMedicos();
  });

document
  .getElementById("btnCancelarFormMedico")
  .addEventListener("click", function () {
    mostrarListaMedicos();
  });

function mostrarFormularioMedico(tipo, datos = null) {
  document.getElementById("vistaListaMedicos").style.display = "none";
  document.getElementById("vistaFormularioMedico").style.display = "block";

  if (tipo === "nuevo") {
    document.getElementById("tituloFormularioMedico").textContent =
      "Nuevo Médico";
    document.getElementById("formularioMedico").reset();
  } else {
    document.getElementById("tituloFormularioMedico").textContent =
      "Editar Médico";
    if (datos) {
      document.getElementById("nombreMedico").value = datos.nombre;
      document.getElementById("apellidosMedico").value = datos.apellidos;
      document.getElementById("cedulaMedico").value = datos.cedula;
      document.getElementById("especialidadMedico").value = datos.especialidad;
      document.getElementById("telefonoMedico").value = datos.telefono;
      document.getElementById("emailMedico").value = datos.email;
      document.getElementById("fechaIngresoMedico").value = datos.fechaIngreso;
      document.getElementById("direccionMedico").value = datos.direccion;
      document.getElementById("observacionesMedico").value =
        datos.observaciones;
    }
  }

  anime({
    targets: "#vistaFormularioMedico .tarjeta",
    translateX: [100, 0],
    opacity: [0, 1],
    duration: 500,
    easing: "easeOutExpo",
  });
}

function mostrarListaMedicos() {
  document.getElementById("vistaFormularioMedico").style.display = "none";
  document.getElementById("vistaListaMedicos").style.display = "block";

  anime({
    targets: ".tarjeta-medico",
    scale: [0.9, 1],
    opacity: [0, 1],
    delay: anime.stagger(50),
    duration: 400,
    easing: "easeOutExpo",
  });
}

// Guardamos al medico utilizando su archivo PHP
document
  .getElementById("formularioMedico")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Creamos el FormData con los datos del formulario
    const formData = new FormData(this);

    mostrarCargando("Guardando medico");

    // Enviamos los datos a su PHP
    fetch("../php/registrar_medico.php", {
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
            mostrarListaMedicos();
            cargarMedicos();
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

function cargarMedicos() {
  // Cargar la lista de medicos desde PHP
  console.log("Cargando medicos...");
}

function verMedico(id) {
  Swal.fire({
    title: "Detalles del Medico",
    html: "<p>Vista detallada del medico #" + id + "</p>",
    icon: "info",
    confirmButtonColor: "#00a0e3",
  });
}

function editarMedico(id) {
  mostrarFormularioMedico("editar", {
    nombre: "Gerardo",
    apellidos: "Portes Teran",
    cedula: "12345678",
    especialidad: "1",
    telefono: "5512345678",
    email: "dr.garcia@email.com",
    fechaIngreso: "2020-01-15",
    direccion: "Calle Principal 123",
    observaciones: "",
  });
}

function eliminarMedico(id) {
  confirmarAccion(
    "¿Eliminar medico?",
    "¿Estas seguro de eliminar este medico?"
  ).then((result) => {
    if (result.isConfirmed) {
      mostrarCargando("Eliminando");

      setTimeout(() => {
        cerrarCargando();
        mostrarExito("Medico eliminado correctamente");
        cargarMedicos();
      }, 1000);
    }
  });
}

// Para la busqueda
document
  .getElementById("inputBuscarMedico")
  .addEventListener("input", function (e) {
    const termino = e.target.value.toLowerCase();
    console.log("Buscando medico:", termino);
  });

// Filtro por especialidad
document
  .getElementById("filtroEspecialidad")
  .addEventListener("change", function (e) {
    const especialidad = e.target.value;
    console.log("Filtrando por especialidad:", especialidad);
  });
