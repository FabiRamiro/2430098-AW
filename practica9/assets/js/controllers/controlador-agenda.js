// Variables globales
let mesActual = 10; // Noviembre (0-11)
let anioActual = 2025;
let fechaSeleccionada = new Date(2025, 10, 7);

document.addEventListener("DOMContentLoaded", function () {
  verificarSesion();
  inicializarAgenda();
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

function inicializarAgenda() {
  anime({
    targets: ".tarjeta",
    translateY: [30, 0],
    opacity: [0, 1],
    delay: anime.stagger(100),
    duration: 600,
    easing: "easeOutExpo",
  });

  generarCalendario();
  cargarCitasDia();
}

// Generamos el calendario
function generarCalendario() {
  const primerDia = new Date(anioActual, mesActual, 1).getDay();
  const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();
  const diasMesAnterior = new Date(anioActual, mesActual, 0).getDate();

  const contenedorDias = document.getElementById("diasCalendario");
  contenedorDias.innerHTML = "";

  const nombresMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  document.getElementById(
    "mesAnioActual"
  ).textContent = `${nombresMeses[mesActual]} ${anioActual}`;

  // Dias del mes anterior
  for (let i = primerDia - 1; i >= 0; i--) {
    const dia = diasMesAnterior - i;
    const divDia = crearDiaCalendario(dia, true, mesActual - 1);
    contenedorDias.appendChild(divDia);
  }

  // Dias del mes actual
  for (let dia = 1; dia <= diasEnMes; dia++) {
    const divDia = crearDiaCalendario(dia, false, mesActual);
    contenedorDias.appendChild(divDia);
  }

  // Dias del mes siguiente
  const diasRestantes = 42 - (primerDia + diasEnMes);
  for (let dia = 1; dia <= diasRestantes; dia++) {
    const divDia = crearDiaCalendario(dia, true, mesActual + 1);
    contenedorDias.appendChild(divDia);
  }
}

function crearDiaCalendario(dia, otroMes, mes) {
  const divDia = document.createElement("div");
  divDia.className = "dia-calendario";

  if (otroMes) {
    divDia.classList.add("dia-otro-mes");
  }

  // Marcamos el dia de hoy
  const hoy = new Date();
  if (
    !otroMes &&
    dia === hoy.getDate() &&
    mesActual === hoy.getMonth() &&
    anioActual === hoy.getFullYear()
  ) {
    divDia.classList.add("dia-hoy");
  }

  divDia.innerHTML = `
        <div class="dia-numero">${dia}</div>
        ${!otroMes ? '<div class="cita-mini">2 citas</div>' : ""}
    `;

  divDia.addEventListener("click", function () {
    fechaSeleccionada = new Date(anioActual, mes, dia);
    actualizarFechaSeleccionada();
    cargarCitasDia();
  });

  return divDia;
}

function actualizarFechaSeleccionada() {
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const textoFecha = `${fechaSeleccionada.getDate()} de ${
    meses[fechaSeleccionada.getMonth()]
  }, ${fechaSeleccionada.getFullYear()}`;
  document.getElementById("fechaSeleccionada").textContent = textoFecha;
}

// Navegacion de los meses
document
  .getElementById("btnMesAnterior")
  .addEventListener("click", function () {
    if (mesActual === 0) {
      mesActual = 11;
      anioActual--;
    } else {
      mesActual--;
    }
    generarCalendario();
  });

document
  .getElementById("btnMesSiguiente")
  .addEventListener("click", function () {
    if (mesActual === 11) {
      mesActual = 0;
      anioActual++;
    } else {
      mesActual++;
    }
    generarCalendario();
  });

// Mostramos el formulario de nueva cita
document.getElementById("btnNuevaCita").addEventListener("click", function () {
  mostrarFormularioCita("nueva");
});

document
  .getElementById("btnVolverCalendario")
  .addEventListener("click", function () {
    mostrarCalendario();
  });

document
  .getElementById("btnCancelarFormCita")
  .addEventListener("click", function () {
    mostrarCalendario();
  });

function mostrarFormularioCita(tipo, datos = null) {
  document.getElementById("vistaCalendario").style.display = "none";
  document.getElementById("vistaFormularioCita").style.display = "block";

  if (tipo === "nueva") {
    document.getElementById("tituloFormularioCita").textContent = "Nueva Cita";
    document.getElementById("formularioCita").reset();

    // Establecemos la fecha actual
    const hoy = new Date();
    const fechaStr = hoy.toISOString().split("T")[0];
    document.getElementById("fechaCita").value = fechaStr;
  } else {
    document.getElementById("tituloFormularioCita").textContent = "Editar Cita";
    if (datos) {
      document.getElementById("pacienteCita").value = datos.paciente;
      document.getElementById("medicoCita").value = datos.medico;
      document.getElementById("fechaCita").value = datos.fecha;
      document.getElementById("horaCita").value = datos.hora;
      document.getElementById("motivoCita").value = datos.motivo;
      document.getElementById("observacionesCita").value = datos.observaciones;
    }
  }

  anime({
    targets: "#vistaFormularioCita .tarjeta",
    translateX: [100, 0],
    opacity: [0, 1],
    duration: 500,
    easing: "easeOutExpo",
  });
}

function mostrarCalendario() {
  document.getElementById("vistaFormularioCita").style.display = "none";
  document.getElementById("vistaCalendario").style.display = "block";

  anime({
    targets: "#vistaCalendario .tarjeta",
    translateX: [-100, 0],
    opacity: [0, 1],
    duration: 500,
    easing: "easeOutExpo",
  });
}

// Guardamos la cita
document
  .getElementById("formularioCita")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const datosCita = {
      paciente: document.getElementById("pacienteCita").value,
      medico: document.getElementById("medicoCita").value,
      fecha: document.getElementById("fechaCita").value,
      hora: document.getElementById("horaCita").value,
      motivo: document.getElementById("motivoCita").value,
      observaciones: document.getElementById("observacionesCita").value,
    };

    mostrarCargando("Guardando cita...");

    setTimeout(() => {
      cerrarCargando();
      mostrarExito("Cita guardada correctamente");
      mostrarCalendario();
    }, 1500);
  });

function cargarCitasDia() {
  // SEGUN aqui va a estar la carga de las citas por PHP
  console.log("Cargando citas del día:", fechaSeleccionada);
}

function editarCita(id) {
  mostrarFormularioCita("editar", {
    paciente: "1",
    medico: "1",
    fecha: "2025-11-07",
    hora: "09:00",
    motivo: "Consulta General",
    observaciones: "",
  });
}

function cancelarCita(id) {
  confirmarAccion(
    "¿Cancelar cita?",
    "¿Estas seguro de cancelar esta cita?"
  ).then((result) => {
    if (result.isConfirmed) {
      mostrarCargando("Cancelando cita");

      setTimeout(() => {
        cerrarCargando();
        mostrarExito("Cita cancelada correctamente");
        cargarCitasDia();
      }, 1000);
    }
  });
}
