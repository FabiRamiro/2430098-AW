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

    // Creamos el FormData con los datos del formulario
    const formData = new FormData(this);

    mostrarCargando("Guardando especialidad");

    // Enviamos los datos a su PHP
    fetch("../php/registrar_especialidad.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        try {
          const data = JSON.parse(text);
          cerrarCargando();

          if (data.success) {
            mostrarExito(data.mensaje);
            mostrarListaEspecialidades();
            cargarEspecialidades();
          } else {
            mostrarError(data.mensaje);
          }
        } catch (e) {
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

function cargarEspecialidades() {
  mostrarCargando("Cargando especialidades");

  fetch("../php/obtener_especialidades.php")
    .then((response) => response.json())
    .then((data) => {
      cerrarCargando();

      if (data.success) {
        mostrarEspecialidadesEnGrid(data.especialidades);
      } else {
        mostrarError(data.mensaje);
      }
    })
    .catch((error) => {
      cerrarCargando();
      mostrarError("Error al cargar especialidades: " + error.message);
      console.error("Error:", error);
    });
}

function mostrarEspecialidadesEnGrid(especialidades) {
  const contenedor = document.getElementById("contenedorEspecialidades");
  contenedor.innerHTML = "";

  if (especialidades.length === 0) {
    contenedor.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    No hay especialidades registradas
                </div>
            </div>
        `;
    return;
  }

  // Iconos predeterminados por especialidad
  const iconos = {
    "Medicina General": "fa-user-md",
    Cardiologia: "fa-heartbeat",
    Pediatria: "fa-baby",
    Ginecologia: "fa-female",
    Traumatologia: "fa-bone",
    Oftalmologia: "fa-eye",
    Neurologia: "fa-brain",
    Odontologia: "fa-tooth",
  };

  especialidades.forEach((esp) => {
    const icono = iconos[esp.nombre] || "fa-stethoscope";

    const html = `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="tarjeta-especialidad">
                    <div class="icono-especialidad">
                        <i class="fas ${icono}"></i>
                    </div>
                    <h4 class="nombre-especialidad">${esp.nombre}</h4>
                    <p class="descripcion-especialidad">
                        ${esp.descripcion}
                    </p>
                    <div class="info-especialidad">
                        <div class="info-item">
                            <div class="numero">${esp.totalMedicos}</div>
                            <div class="etiqueta">Medicos</div>
                        </div>
                        <div class="info-item">
                            <div class="numero">${esp.totalPacientes}</div>
                            <div class="etiqueta">Pacientes</div>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-warning flex-fill" onclick="editarEspecialidad(${esp.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-info flex-fill" onclick="verDetalleEspecialidad(${esp.id})">
                            <i class="fas fa-eye"></i> Ver
                        </button>
                    </div>
                </div>
            </div>
        `;

    contenedor.innerHTML += html;
  });

  // Animamos las tarjetas
  anime({
    targets: ".tarjeta-especialidad",
    translateY: [80, 0],
    opacity: [0, 1],
    delay: anime.stagger(120),
    duration: 800,
    easing: "easeOutElastic(1, .5)",
  });
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
                <p><strong>Medicos:</strong></p>
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
