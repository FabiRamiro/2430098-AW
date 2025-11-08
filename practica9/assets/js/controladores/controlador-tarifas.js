document.addEventListener("DOMContentLoaded", function () {
  verificarSesion();
  inicializarTarifas();
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

function inicializarTarifas() {
  anime({
    targets: ".tarjeta-tarifa",
    translateY: [50, 0],
    opacity: [0, 1],
    delay: anime.stagger(80),
    duration: 600,
    easing: "easeOutExpo",
  });

  cargarTarifas();
}

// Mostrar el formulario para la nueva tarifa
document
  .getElementById("btnNuevaTarifa")
  .addEventListener("click", function () {
    mostrarFormularioTarifa("nueva");
  });

document
  .getElementById("btnVolverListaTarifas")
  .addEventListener("click", function () {
    mostrarListaTarifas();
  });

document
  .getElementById("btnCancelarFormTarifa")
  .addEventListener("click", function () {
    mostrarListaTarifas();
  });

function mostrarFormularioTarifa(tipo, datos = null) {
  document.getElementById("vistaListaTarifas").style.display = "none";
  document.getElementById("vistaFormularioTarifa").style.display = "block";

  if (tipo === "nueva") {
    document.getElementById("tituloFormularioTarifa").textContent =
      "Nueva Tarifa";
    document.getElementById("formularioTarifa").reset();
    document.getElementById("servicioActivo").checked = true;
  } else {
    document.getElementById("tituloFormularioTarifa").textContent =
      "Editar Tarifa";
    if (datos) {
      document.getElementById("nombreServicio").value = datos.nombre;
      document.getElementById("precioServicio").value = datos.precio;
      document.getElementById("categoriaServicio").value = datos.categoria;
      document.getElementById("especialidadServicio").value =
        datos.especialidad;
      document.getElementById("duracionServicio").value = datos.duracion;
      document.getElementById("descripcionServicio").value = datos.descripcion;
      document.getElementById("servicioActivo").checked = datos.activo;
    }
  }

  anime({
    targets: "#vistaFormularioTarifa .tarjeta",
    translateX: [100, 0],
    opacity: [0, 1],
    duration: 500,
    easing: "easeOutExpo",
  });
}

function mostrarListaTarifas() {
  document.getElementById("vistaFormularioTarifa").style.display = "none";
  document.getElementById("vistaListaTarifas").style.display = "block";

  anime({
    targets: ".tarjeta-tarifa",
    scale: [0.9, 1],
    opacity: [0, 1],
    delay: anime.stagger(50),
    duration: 400,
    easing: "easeOutExpo",
  });
}

// DISQUE guardamos la tarifa
document
  .getElementById("formularioTarifa")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const datosTarifa = {
      nombre: document.getElementById("nombreServicio").value,
      precio: document.getElementById("precioServicio").value,
      categoria: document.getElementById("categoriaServicio").value,
      especialidad: document.getElementById("especialidadServicio").value,
      duracion: document.getElementById("duracionServicio").value,
      descripcion: document.getElementById("descripcionServicio").value,
      activo: document.getElementById("servicioActivo").checked,
    };

    mostrarCargando("AMOS CBRON, guardando la tarifa");

    setTimeout(() => {
      cerrarCargando();
      mostrarExito("Tarifa guardada correctamente");
      mostrarListaTarifas();
      cargarTarifas();
    }, 1500);
  });

function cargarTarifas() {
  // TEORICAMENTE aqui iria la carga de PHP
  console.log("...");
}

function editarTarifa(id) {
  // TEORICAMENTE los datos a editar se llamarian desde el PHP
  mostrarFormularioTarifa("editar", {
    nombre: "Consulta General",
    precio: "500.00",
    categoria: "consultas",
    especialidad: "1",
    duracion: "30",
    descripcion: "Consulta medica general con revision completa",
    activo: true,
  });
}

function eliminarTarifa(id) {
  confirmarAccion(
    "¿Eliminar tarifa?",
    "¿Estás seguro de eliminar esta tarifa?"
  ).then((result) => {
    if (result.isConfirmed) {
      mostrarCargando("Eliminando");

      // Nuevamente aqui se supone iria la llamada a PHP
      setTimeout(() => {
        cerrarCargando();
        mostrarExito("Tarifa eliminada correctamente");
        cargarTarifas();
      }, 1000);
    }
  });
}

// Para la busqueda
document
  .getElementById("inputBuscarTarifa")
  .addEventListener("input", function (e) {
    const termino = e.target.value.toLowerCase();
    console.log("Buscando tarifa:", termino);
  });

// Para los filtros
document
  .getElementById("filtroCategoria")
  .addEventListener("change", function (e) {
    console.log("Filtrar por categoría:", e.target.value);
  });

document
  .getElementById("filtroEspecialidadTarifa")
  .addEventListener("change", function (e) {
    console.log("Filtrar por especialidad:", e.target.value);
  });
