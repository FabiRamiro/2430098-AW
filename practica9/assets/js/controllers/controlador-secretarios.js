document.addEventListener("DOMContentLoaded", function () {
  verificarSesion();
  inicializarSecretarios();
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

function inicializarSecretarios() {
  anime({
    targets: ".tarjeta-secretario",
    translateY: [50, 0],
    opacity: [0, 1],
    delay: anime.stagger(100),
    duration: 600,
    easing: "easeOutExpo",
  });

  cargarSecretarios();
}

// Mostramos el formulario de nuevo secretario
document
  .getElementById("btnNuevoSecretario")
  .addEventListener("click", function () {
    mostrarFormularioSecretario("nuevo");
  });

document
  .getElementById("btnVolverListaSecretarios")
  .addEventListener("click", function () {
    mostrarListaSecretarios();
  });

document
  .getElementById("btnCancelarFormSecretario")
  .addEventListener("click", function () {
    mostrarListaSecretarios();
  });

function mostrarFormularioSecretario(tipo, datos = null) {
  document.getElementById("vistaListaSecretarios").style.display = "none";
  document.getElementById("vistaFormularioSecretario").style.display = "block";

  if (tipo === "nuevo") {
    document.getElementById("tituloFormularioSecretario").textContent =
      "Nuevo Secretario/a";
    document.getElementById("formularioSecretario").reset();
    cargarMedicosParaAsignar();
  } else {
    document.getElementById("tituloFormularioSecretario").textContent =
      "Editar Secretario/a";
    if (datos) {
      document.getElementById("nombreCompletoSecretario").value =
        datos.nombreCompleto;
      document.getElementById("telefonoSecretario").value = datos.telefono;
      document.getElementById("correoSecretario").value = datos.correo;
      document.getElementById("direccionSecretario").value = datos.direccion;
      document.getElementById("usuarioSecretario").value = datos.usuario;
      document.getElementById("rolSecretario").value = datos.rol;
    }
    cargarMedicosParaAsignar();
  }

  anime({
    targets: "#vistaFormularioSecretario .tarjeta",
    translateX: [100, 0],
    opacity: [0, 1],
    duration: 500,
    easing: "easeOutExpo",
  });
}

function mostrarListaSecretarios() {
  document.getElementById("vistaFormularioSecretario").style.display = "none";
  document.getElementById("vistaListaSecretarios").style.display = "block";

  anime({
    targets: ".tarjeta-secretario",
    scale: [0.9, 1],
    opacity: [0, 1],
    delay: anime.stagger(50),
    duration: 400,
    easing: "easeOutExpo",
  });
}

// Guardamos al secretario utilizando el archivo PHP
document
  .getElementById("formularioSecretario")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Validamos que la contrasena tenga al menos 6 caracteres
    const contrasena = document.getElementById("contrasenaSecretario").value;
    if (contrasena.length < 6) {
      mostrarError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Validamos el correo si se proporciono
    const correo = document.getElementById("correoSecretario").value;
    if (correo && !validarEmail(correo)) {
      mostrarError("El formato del correo electrónico no es válido");
      return;
    }

    // Creamos el FormData con los datos del formulario
    const formData = new FormData(this);

    mostrarCargando("Guardando secretario/a");

    // Enviamos los datos a su PHP
    fetch("../php/registrar_secretario.php", {
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
            mostrarListaSecretarios();
            cargarSecretarios();
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
        mostrarError("Error de conexión con el servidor: " + error.message);
        console.error("Error completo:", error);
      });
  });

function cargarSecretarios() {
  // Cargar la lista de secretarios desde PHP
  console.log("Cargando secretarios...");
  // TODO: Implementar llamada al PHP para obtener la lista
}

function verSecretario(id) {
  Swal.fire({
    title: "Detalles del Secretario/a",
    html: "<p>Vista detallada del secretario/a #" + id + "</p>",
    icon: "info",
    confirmButtonColor: "#00a0e3",
  });
}

function editarSecretario(id) {
  mostrarFormularioSecretario("editar", {
    nombreCompleto: "Maria Lopez",
    telefono: "555-1234",
    correo: "maria.lopez@clinica.com",
    direccion: "Calle Principal 123",
    usuario: "maria.lopez",
    rol: "Secretaria",
  });
}

function eliminarSecretario(id) {
  confirmarAccion(
    "¿Eliminar secretario/a?",
    "¿Estás seguro de eliminar este secretario/a? Esta acción también eliminará su usuario del sistema."
  ).then((result) => {
    if (result.isConfirmed) {
      mostrarCargando("Eliminando");

      // TODO: Implementar llamada al PHP para eliminar
      setTimeout(() => {
        cerrarCargando();
        mostrarExito("Secretario/a eliminado correctamente");
        cargarSecretarios();
      }, 1000);
    }
  });
}

// Para la búsqueda
document
  .getElementById("inputBuscarSecretario")
  .addEventListener("input", function (e) {
    const termino = e.target.value.toLowerCase();
    console.log("Buscando secretario/a:", termino);
    // TODO: Implementar filtrado
  });

// Filtro por estado
document
  .getElementById("filtroEstadoSecretario")
  .addEventListener("change", function (e) {
    const estado = e.target.value;
    console.log("Filtrando por estado:", estado);
    // TODO: Implementar filtrado por estado
  });

// Función auxiliar para validar email
function validarEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Cargar medicos disponibles para asignar
function cargarMedicosParaAsignar() {
  const contenedor = document.getElementById("listaMedicosAsignar");
  contenedor.innerHTML =
    '<div class="text-center text-muted"><i class="fas fa-spinner fa-spin me-2"></i>Cargando médicos...</div>';

  fetch("../php/obtener_medicos.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.success && data.medicos.length > 0) {
        let html = "";
        data.medicos.forEach((medico) => {
          html += `
            <div class="form-check mb-2 p-2 border-bottom">
              <input 
                class="form-check-input" 
                type="checkbox" 
                value="${medico.idMedico}" 
                id="medico${medico.idMedico}"
                name="medicosAsignados[]">
              <label class="form-check-label w-100" for="medico${medico.idMedico}">
                <strong>${medico.nombreCompleto}</strong>
                <br>
                <small class="text-muted">
                  <i class="fas fa-stethoscope me-1"></i>${medico.especialidad} | 
                  <i class="fas fa-id-card me-1"></i>${medico.cedulaProfesional}
                </small>
              </label>
            </div>
          `;
        });
        contenedor.innerHTML = html;
      } else {
        contenedor.innerHTML = `
          <div class="alert alert-warning mb-0">
            <i class="fas fa-exclamation-triangle me-2"></i>
            No hay médicos disponibles. Registra médicos primero para poder asignarlos.
          </div>
        `;
      }
    })
    .catch((error) => {
      console.error("Error al cargar médicos:", error);
      contenedor.innerHTML = `
        <div class="alert alert-danger mb-0">
          <i class="fas fa-times-circle me-2"></i>
          Error al cargar la lista de médicos.
        </div>
      `;
    });
}

// Obtener medicos seleccionados
function obtenerMedicosSeleccionados() {
  const checkboxes = document.querySelectorAll(
    'input[name="medicosAsignados[]"]:checked'
  );
  return Array.from(checkboxes).map((cb) => cb.value);
}
