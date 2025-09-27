document.addEventListener("DOMContentLoaded", () => {
  // Variables
  let alumnos = [];
  let dataTable;

  const form = document.getElementById("form-alumnos");
  // Elementos de los modales
  const modalEdicion = new bootstrap.Modal(
    document.getElementById("modal-edicion")
  );
  const modalConfirmarCambios = new bootstrap.Modal(
    document.getElementById("modal-confirmar-cambios")
  );
  const modalEliminar = new bootstrap.Modal(
    document.getElementById("modal-eliminar")
  );
  let alumnoEditIndex = null;
  let alumnoDeleteIndex = null;

  // Configuracion y creacion de la instancia de DataTables
  dataTable = new DataTable("#alumnosTable", {
    // Traducir la tabla al español
    language: {
      url: "https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-MX.json",
    },
    // Hacer que la tabla sea responsive
    responsive: true,
    pagingType: "simple_numbers",

    columns: [
      { data: "matricula" },
      { data: "nombre" },
      { data: "carrera" },
      { data: "email" },
      { data: "telefono" },
      {
        data: null,
        render: function (data, type, row, meta) {
          return `
              <button class="btn btn-warning btn-sm btn-editar" data-index="${meta.row}">
                <i class="bi bi-pencil-square p-2"></i> Editar
              </button>
              <button class="btn btn-danger btn-sm btn-eliminar" data-index="${meta.row}">
                <i class="bi bi-trash p-2"></i> Eliminar
              </button>
            `;
        },
        orderable: false,
        searchable: false,
        width: "150px",
      },
    ],
  });

  const guardarEnLocalStorage = () => {
    localStorage.setItem("alumnos", JSON.stringify(alumnos));
  };

  const cargarDesdeLocalStorage = () => {
    const alumnosGuardados = localStorage.getItem("alumnos");
    if (alumnosGuardados) {
      alumnos = JSON.parse(alumnosGuardados);
      // Se limpia la tabla y se agregan los nuevos datos con la API de DataTables
      dataTable.clear();
      dataTable.rows.add(alumnos);
      dataTable.draw(); // 'draw' redibuja la tabla con los datos
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nuevoAlumno = {
      matricula: document.getElementById("matricula").value.trim(),
      nombre: document.getElementById("nombre-completo").value.trim(),
      carrera: document.getElementById("carrera").value.toUpperCase(),
      email: document.getElementById("email").value.trim(),
      telefono: document.getElementById("telefono").value.trim(),
    };

    // Se agrega al arreglo
    alumnos.push(nuevoAlumno);

    // Se guarda en el localStorage
    guardarEnLocalStorage();

    // Solo agregamos la nueva fila a la instancia de DataTables
    dataTable.row.add(nuevoAlumno).draw();

    form.reset();
  });

  cargarDesdeLocalStorage();

  document
    .getElementById("alumnosTable")
    .addEventListener("click", function (e) {
      if (e.target.closest(".btn-editar")) {
        const index = parseInt(
          e.target.closest(".btn-editar").getAttribute("data-index")
        );
        alumnoEditIndex = index;
        const alumno = alumnos[index];
        document.getElementById("edit-matricula").value = alumno.matricula;
        document.getElementById("edit-nombre-completo").value = alumno.nombre;
        document.getElementById("edit-carrera").value = alumno.carrera;
        document.getElementById("edit-email").value = alumno.email;
        document.getElementById("edit-telefono").value = alumno.telefono;
        modalEdicion.show();
      }
      if (e.target.closest(".btn-eliminar")) {
        const index = parseInt(
          e.target.closest(".btn-eliminar").getAttribute("data-index")
        );
        alumnoDeleteIndex = index;
        modalEliminar.show();
      }
    });

  // Guardar cambios de edición
  document
    .getElementById("btn-guardar-edicion")
    .addEventListener("click", function () {
      modalEdicion.hide();
      modalConfirmarCambios.show();
    });

  // Confirmar guardar cambios
  document
    .getElementById("confirmar-guardar")
    .addEventListener("click", function () {
      if (alumnoEditIndex !== null) {
        alumnos[alumnoEditIndex] = {
          matricula: document.getElementById("edit-matricula").value.trim(),
          nombre: document.getElementById("edit-nombre-completo").value.trim(),
          carrera: document.getElementById("edit-carrera").value,
          email: document.getElementById("edit-email").value.trim(),
          telefono: document.getElementById("edit-telefono").value.trim(),
        };
        guardarEnLocalStorage();
        dataTable.clear();
        dataTable.rows.add(alumnos);
        dataTable.draw();
        alumnoEditIndex = null;
      }
    });

  // Confirmar eliminación
  document
    .getElementById("confirmar-eliminar")
    .addEventListener("click", function () {
      if (alumnoDeleteIndex !== null) {
        alumnos.splice(alumnoDeleteIndex, 1);
        guardarEnLocalStorage();
        dataTable.clear();
        dataTable.rows.add(alumnos);
        dataTable.draw();
        alumnoDeleteIndex = null;
      }
    });
});
