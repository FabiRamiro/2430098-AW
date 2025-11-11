document.addEventListener("DOMContentLoaded", function () {
  verificarSesion();
  inicializarBitacoras();
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

function inicializarBitacoras() {
  // Las animaciones de entrada
  anime({
    targets: ".tarjeta",
    translateY: [30, 0],
    opacity: [0, 1],
    delay: anime.stagger(100),
    duration: 600,
    easing: "easeOutExpo",
  });

  anime({
    targets: ".registro-bitacora",
    translateX: [-50, 0],
    opacity: [0, 1],
    delay: anime.stagger(80, { start: 400 }),
    duration: 500,
    easing: "easeOutExpo",
  });

  // Ultimos 7 dias por defecto
  const hoy = new Date();
  const hace7Dias = new Date(hoy);
  hace7Dias.setDate(hace7Dias.getDate() - 7);

  document.getElementById("fechaInicioBitacora").value = hace7Dias
    .toISOString()
    .split("T")[0];
  document.getElementById("fechaFinBitacora").value = hoy
    .toISOString()
    .split("T")[0];

  cargarBitacoras();
}

// Filtrar bitacora
document
  .getElementById("btnFiltrarBitacora")
  .addEventListener("click", function () {
    const filtros = {
      usuario: document.getElementById("filtroUsuario").value,
      accion: document.getElementById("filtroAccion").value,
      fechaInicio: document.getElementById("fechaInicioBitacora").value,
      fechaFin: document.getElementById("fechaFinBitacora").value,
    };

    mostrarCargando("Filtrando registros");

    setTimeout(() => {
      cerrarCargando();
      console.log("Filtros aplicados:", filtros);

      // Animamos los registros filtrados
      anime({
        targets: ".registro-bitacora",
        translateX: [-30, 0],
        opacity: [0, 1],
        delay: anime.stagger(60),
        duration: 400,
        easing: "easeOutExpo",
      });
    }, 1000);
  });

// Exportamos las bitacoras
document
  .getElementById("btnExportarBitacora")
  .addEventListener("click", function () {
    const filtros = {
      usuario: document.getElementById("filtroUsuario").value,
      accion: document.getElementById("filtroAccion").value,
      fechaInicio: document.getElementById("fechaInicioBitacora").value,
      fechaFin: document.getElementById("fechaFinBitacora").value,
    };

    mostrarCargando("Generando reporte de bitacoras");

    setTimeout(() => {
      cerrarCargando();

      Swal.fire({
        icon: "success",
        title: "Reporte generado",
        text: "El archivo Excel se ha descargado correctamente",
        confirmButtonColor: "#00a0e3",
      });
    }, 1500);
  });

function cargarBitacoras() {
  // Se supone que aqui va a ir la llamada a PHP
  console.log("Cargando bitacoras desde PHP");
}

// Segun para registrar una accion en la bitacora
function registrarAccion(accion, modulo, descripcion) {
  const datosAccion = {
    usuario: sessionStorage.getItem("usuario"),
    accion: accion,
    modulo: modulo,
    descripcion: descripcion,
    fecha: new Date().toISOString(),
    ip: "obtener_ip_cliente",
  };

  console.log("Accion registrada:", datosAccion);
}

// Funcion para ser llamada desde otros controladores
window.registrarAccionBitacora = registrarAccion;
