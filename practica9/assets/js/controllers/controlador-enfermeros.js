document.addEventListener("DOMContentLoaded", function () {
  verificarSesion();
  inicializarEnfermeros();
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

function inicializarEnfermeros() {
  anime({
    targets: ".tarjeta-enfermero",
    translateY: [50, 0],
    opacity: [0, 1],
    delay: anime.stagger(100),
    duration: 600,
    easing: "easeOutExpo",
  });

  cargarEnfermeros();
}

// Mostramos el formulario de nuevo enfermero
document
  .getElementById("btnNuevoEnfermero")
  .addEventListener("click", function () {
    mostrarFormularioEnfermero("nuevo");
  });

document
  .getElementById("btnVolverListaEnfermeros")
  .addEventListener("click", function () {
    mostrarListaEnfermeros();
  });

document
  .getElementById("btnCancelarFormEnfermero")
  .addEventListener("click", function () {
    mostrarListaEnfermeros();
  });

function mostrarFormularioEnfermero(tipo, datos = null) {
  document.getElementById("vistaListaEnfermeros").style.display = "none";
  document.getElementById("vistaFormularioEnfermero").style.display = "block";

  if (tipo === "nuevo") {
    document.getElementById("tituloFormularioEnfermero").textContent =
      "Nuevo Enfermero";
    document.getElementById("formularioEnfermero").reset();
  } else {
    document.getElementById("tituloFormularioEnfermero").textContent =
      "Editar Enfermero";
    if (datos) {
      document.getElementById("usuarioEnfermero").value = datos.usuario;
      document.getElementById("rolEnfermero").value = datos.rol;
    }
  }

  anime({
    targets: "#vistaFormularioEnfermero .tarjeta",
    translateX: [100, 0],
    opacity: [0, 1],
    duration: 500,
    easing: "easeOutExpo",
  });
}

function mostrarListaEnfermeros() {
  document.getElementById("vistaFormularioEnfermero").style.display = "none";
  document.getElementById("vistaListaEnfermeros").style.display = "block";

  anime({
    targets: ".tarjeta-enfermero",
    scale: [0.9, 1],
    opacity: [0, 1],
    delay: anime.stagger(50),
    duration: 400,
    easing: "easeOutExpo",
  });
}

// Guardamos al enfermero utilizando el archivo PHP
document
  .getElementById("formularioEnfermero")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Validamos que la contrasena tenga al menos 6 caracteres
    const contrasena = document.getElementById("contrasenaEnfermero").value;
    if (contrasena.length < 6) {
      mostrarError("La contrasena debe tener al menos 6 caracteres");
      return;
    }

    // Creamos el FormData con los datos del formulario
    const formData = new FormData(this);

    mostrarCargando("Guardando enfermero");

    // Enviamos los datos a su PHP
    fetch("../php/registrar_enfermero.php", {
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
            mostrarListaEnfermeros();
            cargarEnfermeros();
          } else {
            mostrarError(data.mensaje);
          }
        } catch (e) {
          // Si falla el parseo mostramos el texto recibido para debug
          console.error("Respuesta del servidor:", text);
          throw new Error(
            "La respuesta del servidor no es JSON valido: " +
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

function cargarEnfermeros() {
  // Cargar la lista de enfermeros desde PHP
  console.log("Cargando enfermeros...");
}

function verEnfermero(id) {
  Swal.fire({
    title: "Detalles del Enfermero",
    html: "<p>Vista detallada del enfermero #" + id + "</p>",
    icon: "info",
    confirmButtonColor: "#00a0e3",
  });
}

function editarEnfermero(id) {
  mostrarFormularioEnfermero("editar", {
    usuario: "maria.lopez",
    rol: "Enfermera",
  });
}

function eliminarEnfermero(id) {
  confirmarAccion(
    "¿Eliminar enfermero?",
    "¿Estas seguro de eliminar este enfermero?"
  ).then((result) => {
    if (result.isConfirmed) {
      mostrarCargando("Eliminando");

      setTimeout(() => {
        cerrarCargando();
        mostrarExito("Enfermero eliminado correctamente");
        cargarEnfermeros();
      }, 1000);
    }
  });
}

// Para la busqueda
document
  .getElementById("inputBuscarEnfermero")
  .addEventListener("input", function (e) {
    const termino = e.target.value.toLowerCase();
    console.log("Buscando enfermero:", termino);
  });

// Filtro por estado
document
  .getElementById("filtroEstadoEnfermero")
  .addEventListener("change", function (e) {
    const estado = e.target.value;
    console.log("Filtrando por estado:", estado);
  });
