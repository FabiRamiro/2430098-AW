document.addEventListener("DOMContentLoaded", function () {
  verificarSesion();
  inicializarPagos();
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

function inicializarPagos() {
  anime({
    targets: ".tarjeta-estadistica",
    scale: [0, 1],
    opacity: [0, 1],
    delay: anime.stagger(100),
    duration: 600,
    easing: "easeOutElastic(1, .5)",
  });

  anime({
    targets: ".tarjeta",
    translateY: [30, 0],
    opacity: [0, 1],
    delay: 400,
    duration: 600,
    easing: "easeOutExpo",
  });

  // Establecer la fecha actual
  const hoy = new Date().toISOString().split("T")[0];
  document.getElementById("fechaPago").value = hoy;

  cargarPagos();
}

// Mostrar el formulario nuevo pago
document.getElementById("btnNuevoPago").addEventListener("click", function () {
  mostrarFormularioPago();
});

document
  .getElementById("btnVolverListaPagos")
  .addEventListener("click", function () {
    mostrarListaPagos();
  });

document
  .getElementById("btnCancelarFormPago")
  .addEventListener("click", function () {
    mostrarListaPagos();
  });

function mostrarFormularioPago() {
  document.getElementById("vistaListaPagos").style.display = "none";
  document.getElementById("vistaFormularioPago").style.display = "block";

  document.getElementById("formularioPago").reset();
  const hoy = new Date().toISOString().split("T")[0];
  document.getElementById("fechaPago").value = hoy;

  anime({
    targets: "#vistaFormularioPago .tarjeta",
    translateX: [100, 0],
    opacity: [0, 1],
    duration: 500,
    easing: "easeOutExpo",
  });
}

function mostrarListaPagos() {
  document.getElementById("vistaFormularioPago").style.display = "none";
  document.getElementById("vistaListaPagos").style.display = "block";

  anime({
    targets: "#vistaListaPagos .tarjeta",
    translateX: [-100, 0],
    opacity: [0, 1],
    duration: 500,
    easing: "easeOutExpo",
  });
}

// Guardamos el pago, bueno DISQUE
document
  .getElementById("formularioPago")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const datosPago = {
      paciente: document.getElementById("pacientePago").value,
      fecha: document.getElementById("fechaPago").value,
      concepto: document.getElementById("conceptoPago").value,
      monto: document.getElementById("montoPago").value,
      metodo: document.getElementById("metodoPago").value,
      referencia: document.getElementById("referenciaPago").value,
      observaciones: document.getElementById("observacionesPago").value,
    };

    mostrarCargando("Registrando pago");

    setTimeout(() => {
      cerrarCargando();

      Swal.fire({
        icon: "success",
        title: "Pago registrado",
        text: "¿Deseas imprimir el recibo?",
        showCancelButton: true,
        confirmButtonText: "Imprimir",
        cancelButtonText: "No",
        confirmButtonColor: "#00a0e3",
        cancelButtonColor: "#6c757d",
      }).then((result) => {
        if (result.isConfirmed) {
          imprimirRecibo(1);
        }
        mostrarListaPagos();
        cargarPagos();
      });
    }, 1500);
  });

function cargarPagos() {
  // TEORICAMENTE aqui iria el PHP para el manejamiento
  console.log("...");
}

function verPago(id) {
  Swal.fire({
    title: "Detalles del Pago",
    html: `
            <div style="text-align: left;">
                <p><strong>Folio:</strong> #PAG-${id
                  .toString()
                  .padStart(3, "0")}</p>
                <p><strong>Fecha:</strong> 07/11/2025</p>
                <p><strong>Paciente:</strong> Juan Perez</p>
                <p><strong>Concepto:</strong> Consulta General</p>
                <p><strong>Monto:</strong> $500.00</p>
                <p><strong>Metodo:</strong> Efectivo</p>
                <p><strong>Estado:</strong> Pagado</p>
            </div>
        `,
    icon: "info",
    confirmButtonColor: "#00a0e3",
    confirmButtonText: "Cerrar",
  });
}

function registrarPago(id) {
  Swal.fire({
    title: "Registrar pago",
    text: "¿Confirmar el pago de esta consulta?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#28a745",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Registrar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      mostrarCargando("Registrando pago");

      // TEORICAMENTE aqui iria el manejamiento de PHP
      setTimeout(() => {
        cerrarCargando();
        mostrarExito("Pago registrado correctamente");
        cargarPagos();
      }, 1000);
    }
  });
}

function imprimirRecibo(id) {
  mostrarCargando("Generando recibo");

  // TEORICAMENTE aqui iria la generacion del PDF
  setTimeout(() => {
    cerrarCargando();

    Swal.fire({
      icon: "success",
      title: "Recibo generado",
      text: "El recibo se ha generado correctamente",
      confirmButtonColor: "#00a0e3",
    });
  }, 1000);
}

// Para la busqueda
document
  .getElementById("inputBuscarPago")
  .addEventListener("input", function (e) {
    const termino = e.target.value.toLowerCase();
    console.log("Buscando pago:", termino);
  });

// Filtros
document
  .getElementById("filtroEstadoPago")
  .addEventListener("change", function (e) {
    console.log("Filtrar por estado:", e.target.value);
  });
