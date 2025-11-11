document.addEventListener("DOMContentLoaded", function () {
  verificarSesion();
  inicializarReportes();
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

function inicializarReportes() {
  // Las animaciones de entrada
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
    delay: anime.stagger(150, { start: 400 }),
    duration: 600,
    easing: "easeOutExpo",
  });

  // Para establecer fecha por defecto
  const hoy = new Date();
  const hace30Dias = new Date(hoy);
  hace30Dias.setDate(hace30Dias.getDate() - 30);

  document.getElementById("fechaInicio").value = hace30Dias
    .toISOString()
    .split("T")[0];
  document.getElementById("fechaFin").value = hoy.toISOString().split("T")[0];

  inicializarGraficas();
}

function inicializarGraficas() {
  // Grafica de las citas
  const opcionesTendencia = {
    series: [
      {
        name: "Citas",
        data: [
          28, 35, 32, 41, 38, 45, 42, 48, 52, 55, 58, 60, 62, 58, 65, 68, 70,
          72, 75, 78, 80, 82, 85, 87, 90, 88, 92, 95, 93, 96,
        ],
      },
    ],
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: true,
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
      type: "datetime",
      categories: generarFechas30Dias(),
    },
    tooltip: {
      x: {
        format: "dd/MM/yy",
      },
      y: {
        formatter: function (val) {
          return val + " citas";
        },
      },
    },
  };

  const graficaTendencia = new ApexCharts(
    document.querySelector("#graficaTendenciaCitas"),
    opcionesTendencia
  );
  graficaTendencia.render();

  // Grafica de Distrobucion por Especialidad
  const opcionesDistribucion = {
    series: [42, 28, 18, 8, 4],
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
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0) + "%";
              },
            },
          },
        },
      },
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

  const graficaDistribucion = new ApexCharts(
    document.querySelector("#graficaDistribucion"),
    opcionesDistribucion
  );
  graficaDistribucion.render();
}

function generarFechas30Dias() {
  const fechas = [];
  const hoy = new Date();

  for (let i = 29; i >= 0; i--) {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() - i);
    fechas.push(fecha.getTime());
  }

  return fechas;
}

// Para generar los reportes
document
  .getElementById("btnGenerarReporte")
  .addEventListener("click", function () {
    const tipo = document.getElementById("tipoReporte").value;
    const fechaInicio = document.getElementById("fechaInicio").value;
    const fechaFin = document.getElementById("fechaFin").value;

    if (!fechaInicio || !fechaFin) {
      mostrarAdvertencia("Por favor selecciona el rango de fechas");
      return;
    }

    mostrarCargando("Generando reporte");

    const datosReporte = {
      tipo: tipo,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
    };

    setTimeout(() => {
      cerrarCargando();
      mostrarExito("Reporte generado correctamente");
      console.log("Datos del reporte:", datosReporte);
    }, 1500);
  });

// Exportar las graficas
document
  .getElementById("btnExportarGrafica")
  .addEventListener("click", function () {
    mostrarCargando("Exportando grafica");

    setTimeout(() => {
      cerrarCargando();
      mostrarExito("Grafica exportada correctamente");
    }, 1000);
  });

// DISQUE exportar a Excel
document
  .getElementById("btnExportarExcel")
  .addEventListener("click", function () {
    mostrarCargando("Generando archivo Excel");

    setTimeout(() => {
      cerrarCargando();

      Swal.fire({
        icon: "success",
        title: "Archivo generado",
        text: "El archivo Excel se ha descargado correctamente",
        confirmButtonColor: "#00a0e3",
      });
    }, 1500);
  });

// Animacion al cambiar tipo de reporte
document.getElementById("tipoReporte").addEventListener("change", function () {
  anime({
    targets: ".tarjeta-estadistica",
    scale: [1, 1.05, 1],
    duration: 400,
    easing: "easeInOutQuad",
  });
});
