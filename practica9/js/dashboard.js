// Verificar si hay usuario logueado
var usuarioData = sessionStorage.getItem("usuarioActual");

if (!usuarioData) {
  // Si no hay usuario, redirigir al login
  window.location.href = "login.html";
} else {
  // Obtener datos del usuario
  var usuario = JSON.parse(usuarioData);

  // Mostrar datos del usuario en la barra superior
  document.getElementById("nombreUsuario").textContent = usuario.nombre;
  var rolTexto =
    usuario.rol === "admin"
      ? "Administrador"
      : usuario.rol === "medico"
      ? "Médico"
      : "Recepcionista";
  document.getElementById("rolUsuario").textContent = rolTexto;

  // Poner iniciales en el avatar
  var iniciales = usuario.nombre
    .split(" ")
    .map(function (n) {
      return n[0];
    })
    .join("");
  document.getElementById("avatarUsuario").textContent = iniciales;
}

// Boton cerrar sesion
document
  .getElementById("btnCerrarSesion")
  .addEventListener("click", function () {
    // Limpiar sesion
    sessionStorage.removeItem("usuarioActual");

    // Animar salida
    gsap.to(".contenido-principal", {
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: function () {
        window.location.href = "login.html";
      },
    });
  });

// Animaciones al cargar la pagina
document.addEventListener("DOMContentLoaded", function () {
  // Asegurar que todas las tarjetas esten visibles primero
  gsap.set(".tarjeta-estadistica", { opacity: 1, y: 0 });
  gsap.set(".tarjeta", { opacity: 1, y: 0 });

  // Animar tarjetas de estadisticas
  gsap.fromTo(
    ".tarjeta-estadistica",
    {
      y: 30,
      opacity: 0,
    },
    {
      duration: 0.8,
      y: 0,
      opacity: 1,
      stagger: 0.15,
      ease: "power3.out",
    }
  );

  // Animar las tarjetas principales
  gsap.fromTo(
    ".tarjeta",
    {
      y: 50,
      opacity: 0,
    },
    {
      duration: 1,
      y: 0,
      opacity: 1,
      stagger: 0.2,
      ease: "power3.out",
      delay: 0.5,
    }
  );

  // Animar los numeros de las estadisticas
  setTimeout(function () {
    animarContadores();
  }, 800);

  // Crear las graficas despues de que cargue todo
  setTimeout(function () {
    crearGraficas();
  }, 1000);

  // Animar tabla y actividades
  setTimeout(function () {
    animarElementos();
  }, 1500);
});

// Funcion para animar los contadores
function animarContadores() {
  // Total Pacientes
  animarNumero("totalPacientes", 0, 1245, 2000);

  // Citas Hoy
  animarNumero("citasHoy", 0, 24, 1500);

  // Citas Pendientes
  animarNumero("citasPendientes", 0, 15, 1500);

  // Total Medicos
  animarNumero("totalMedicos", 0, 32, 1500);
}

// Funcion para animar un numero
function animarNumero(id, desde, hasta, duracion) {
  var elemento = document.getElementById(id);
  var inicio = Date.now();

  function actualizar() {
    var ahora = Date.now();
    var progreso = Math.min((ahora - inicio) / duracion, 1);
    var valor = Math.floor(desde + (hasta - desde) * progreso);

    elemento.textContent = valor.toLocaleString();

    if (progreso < 1) {
      requestAnimationFrame(actualizar);
    }
  }

  actualizar();
}

// Funcion para crear las graficas
function crearGraficas() {
  // Crear grafica de citas por mes con ApexCharts
  var opcionesCitas = {
    series: [
      {
        name: "Citas",
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 72, 68, 75],
      },
    ],
    chart: {
      type: "bar",
      height: 300,
      toolbar: {
        show: false,
      },
    },
    colors: ["#4f46e5"],
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "50%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ],
    },
    yaxis: {
      title: {
        text: "Número de Citas",
      },
    },
  };

  var graficoCitas = new ApexCharts(
    document.querySelector("#graficocitas"),
    opcionesCitas
  );
  graficoCitas.render();

  // Crear grafica de genero
  var opcionesGenero = {
    series: [52, 48],
    chart: {
      type: "donut",
      height: 300,
    },
    labels: ["Mujeres", "Hombres"],
    colors: ["#ef4444", "#4f46e5"],
    legend: {
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
        },
      },
    },
  };

  var graficoGenero = new ApexCharts(
    document.querySelector("#graficoGenero"),
    opcionesGenero
  );
  graficoGenero.render();
}

// Funcion para animar otros elementos
function animarElementos() {
  // Animar las filas de la tabla cuando se pasa el mouse
  var filas = document.querySelectorAll(".tabla tbody tr");
  filas.forEach(function (fila) {
    fila.addEventListener("mouseenter", function () {
      anime({
        targets: this,
        scale: 1.02,
        duration: 300,
        easing: "easeOutQuad",
      });
    });

    fila.addEventListener("mouseleave", function () {
      anime({
        targets: this,
        scale: 1,
        duration: 300,
        easing: "easeOutQuad",
      });
    });
  });

  // Animar items de actividad reciente
  var itemsActividad = document.querySelectorAll(".item-actividad");
  anime({
    targets: itemsActividad,
    translateX: [-50, 0],
    opacity: [0, 1],
    delay: anime.stagger(100),
    duration: 800,
    easing: "easeOutQuad",
  });
}

// Funcion para actualizar las estadisticas
function actualizarEstadisticas() {
  // Simular actualizacion de datos cada 5 segundos
  setInterval(function () {
    // Obtener valores actuales
    var citasActual = parseInt(document.getElementById("citasHoy").textContent);
    var pendientesActual = parseInt(
      document.getElementById("citasPendientes").textContent
    );

    // Generar cambios aleatorios pequeños
    var nuevasCitas = citasActual + Math.floor(Math.random() * 3) - 1;
    var nuevasPendientes = pendientesActual + Math.floor(Math.random() * 3) - 1;

    // Asegurar que sean positivos
    if (nuevasCitas < 0) nuevasCitas = 0;
    if (nuevasPendientes < 0) nuevasPendientes = 0;

    // Actualizar con animacion
    if (nuevasCitas !== citasActual) {
      animarNumero("citasHoy", citasActual, nuevasCitas, 1000);
    }

    if (nuevasPendientes !== pendientesActual) {
      animarNumero("citasPendientes", pendientesActual, nuevasPendientes, 1000);
    }
  }, 5000);
}

// Iniciar actualizaciones
actualizarEstadisticas();

// Hacer que los iconos de notificacion pulsen
setInterval(function () {
  anime({
    targets: ".icono-notificacion",
    scale: [1, 1.2, 1],
    duration: 1000,
    easing: "easeInOutQuad",
  });
}, 3000);
