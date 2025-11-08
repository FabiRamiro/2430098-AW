// Verificamos la sesion
document.addEventListener("DOMContentLoaded", function () {
  verificarSesion();
  inicializarDashboard();
  cargarDatos();
});

function verificarSesion() {
  const sesionActiva = sessionStorage.getItem("sesionActiva");
  if (!sesionActiva) {
    window.location.href = "../index.html";
  }

  // Mostramos el nombre de usuario
  const usuario = sessionStorage.getItem("usuario");
  if (usuario) {
    document.getElementById("nombreUsuario").textContent = usuario;
    document.getElementById("inicialesUsuario").textContent = usuario
      .charAt(0)
      .toUpperCase();
  }
}

function inicializarDashboard() {
  // La animacion de entrada
  anime({
    targets: ".tarjeta-estadistica",
    translateY: [50, 0],
    opacity: [0, 1],
    delay: anime.stagger(100),
    duration: 800,
    easing: "easeOutExpo",
  });

  anime({
    targets: ".tarjeta",
    translateY: [50, 0],
    opacity: [0, 1],
    delay: anime.stagger(150, { start: 400 }),
    duration: 800,
    easing: "easeOutExpo",
  });

  // Inicializamos las graficas
  inicializarGraficas();
}

function cargarDatos() {
  console.log("Cargando datos del dashboard");
}

function inicializarGraficas() {
  // Grafica de las citas por mes
  const opcionesGraficaCitas = {
    series: [
      {
        name: "Citas",
        data: [45, 52, 48, 65, 72, 68, 75, 80, 85, 90, 88, 95],
      },
    ],
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#00a0e3"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
      },
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
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " citas";
        },
      },
    },
  };

  const graficaCitas = new ApexCharts(
    document.querySelector("#graficaCitas"),
    opcionesGraficaCitas
  );
  graficaCitas.render();

  // Grafica de pacientes por especialidad
  const opcionesGraficaEspecialidades = {
    series: [35, 25, 20, 15, 5],
    chart: {
      type: "donut",
      height: 350,
    },
    labels: [
      "Medicina General",
      "Cardiologia",
      "Pediatria",
      "Ginecologia",
      "Otras",
    ],
    colors: ["#00a0e3", "#0077be", "#28a745", "#ffc107", "#dc3545"],
    legend: {
      position: "bottom",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const graficaEspecialidades = new ApexCharts(
    document.querySelector("#graficaEspecialidades"),
    opcionesGraficaEspecialidades
  );
  graficaEspecialidades.render();
}

// La animacion del hover de las tarjetas estadisticas
document.querySelectorAll(".tarjeta-estadistica").forEach((tarjeta) => {
  tarjeta.addEventListener("mouseenter", function () {
    anime({
      targets: this,
      scale: 1.05,
      duration: 300,
      easing: "easeOutQuad",
    });
  });

  tarjeta.addEventListener("mouseleave", function () {
    anime({
      targets: this,
      scale: 1,
      duration: 300,
      easing: "easeOutQuad",
    });
  });
});
