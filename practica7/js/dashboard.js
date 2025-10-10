document.addEventListener("DOMContentLoaded", function () {
  // Verificamos si la sesión es activa
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (!usuarioActivo) return;

  // Verificamos si el usuario es admin
  const esAdmin = localStorage.getItem("esAdmin") === "true";

  // Referencias a elementos de usuario
  const correoUsuario = document.getElementById("correoUsuario");
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

  // Referencias a elementos de los proyectos
  const listaProyectos = document.getElementById("listaProyectos");
  const formularioProyecto = document.getElementById("formularioProyecto");
  const btnGuardarProyecto = document.getElementById("btnGuardarProyecto");
  const modalProyecto = new bootstrap.Modal(
    document.getElementById("modalProyecto")
  );

  // Elementos de tareas
  const formularioTarea = document.getElementById("formularioTarea");
  const btnGuardarTarea = document.getElementById("btnGuardarTarea");
  const btnAgregarTarea = document.getElementById("btnAgregarTarea");
  const modalTarea = new bootstrap.Modal(document.getElementById("modalTarea"));

  // Tablero del drag & drop
  const listaPendiente = document.getElementById("listaPendiente");
  const listaEnProceso = document.getElementById("listaEnProceso");
  const listaHecha = document.getElementById("listaHecha");

  // Informacion del proyecto
  const infoProyecto = document.getElementById("infoProyecto");
  const tableroTareas = document.getElementById("tableroTareas");
  const mensajeInicial = document.getElementById("mensajeInicial");

  // Elementos de notas
  const btnAgregarNota = document.getElementById("btnAgregarNota");
  const formularioNota = document.getElementById("formularioNota");
  const btnGuardarNota = document.getElementById("btnGuardarNota");
  const modalNota = new bootstrap.Modal(document.getElementById("modalNota"));
  const seccionNotas = document.getElementById("seccionNotas");
  const listaNotas = document.getElementById("listaNotas");

  // Elementos del panel admin
  const btnPanelAdmin = document.getElementById("btnPanelAdmin");

  // Variables globales
  let proyectoActual = null;
  let elementoArrastrado = null;

  // === LocalStorage ===
  // Obtenemos todos los proyectos del usuario actual
  const obtenerProyectos = () => {
    const proyectosGuardados = localStorage.getItem(
      `proyectos_${usuarioActivo}`
    );
    return proyectosGuardados ? JSON.parse(proyectosGuardados) : [];
  };

  // Guardamos en el array de proyectos del localStorage
  const guardarProyectos = (proyectos) => {
    localStorage.setItem(
      `proyectos_${usuarioActivo}`,
      JSON.stringify(proyectos)
    );
  };

  // Obtenemos todas las tareas del proyecto actual
  const obtenerTareas = () => {
    if (!proyectoActual) return [];
    const tareasGuardadas = localStorage.getItem(
      `tareas_${usuarioActivo}_${proyectoActual}`
    );
    return tareasGuardadas ? JSON.parse(tareasGuardadas) : [];
  };

  // Guardamos en el array de tareas en localStorage
  const guardarTareas = (tareas) => {
    if (!proyectoActual) return;
    localStorage.setItem(
      `tareas_${usuarioActivo}_${proyectoActual}`,
      JSON.stringify(tareas)
    );
  };

  // Obtenemos todas las notas del proyecto actual
  const obtenerNotas = () => {
    if (!proyectoActual) return [];
    const notasGuardadas = localStorage.getItem(
      `notas_${usuarioActivo}_${proyectoActual}`
    );
    return notasGuardadas ? JSON.parse(notasGuardadas) : [];
  };

  // Guardamos las notas en localStorage
  const guardarNotas = (notas) => {
    if (!proyectoActual) return;
    localStorage.setItem(
      `notas_${usuarioActivo}_${proyectoActual}`,
      JSON.stringify(notas)
    );
  };

  // === FUNCIONES PARA LOS PROYECTOS ===
  const mostrarProyectos = () => {
    listaProyectos.innerHTML = "";
    const proyectos = obtenerProyectos();

    if (proyectos.length === 0) {
      listaProyectos.innerHTML =
        '<p class="text-muted small">No hay proyectos aun</p>';
    }

    proyectos.forEach((proyecto) => {
      const elementoProyecto = document.createElement("div");
      elementoProyecto.classList.add(
        "list-group-item",
        "list-group-item-action"
      );

      // Marcar el proyecto como activo
      if (proyectoActual === proyecto.id) {
        elementoProyecto.classList.add("active");
      }

      // Marcar el estado
      let badgeColor = "secondary";
      if (proyecto.estado === "activo") badgeColor = "success";
      if (proyecto.estado === "pausado") badgeColor = "warning";
      if (proyecto.estado === "completado") badgeColor = "info";

      elementoProyecto.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h6 class="mb-1">${proyecto.nombre}</h6>
            <small class="text-muted">${proyecto.descripcion.substring(
              0,
              40
            )}...</small>
          </div>
          <span class="badge bg-${badgeColor}">${proyecto.estado}</span>
        </div>
        <div class="mt-2">
          <button class="btn btn-sm btn-outline-primary btn-seleccionar" data-id="${
            proyecto.id
          }">
            Abrir
          </button>
          <button class="btn btn-sm btn-outline-secondary btn-editar-proyecto" data-id="${
            proyecto.id
          }">
            Editar
          </button>
          <button class="btn btn-sm btn-outline-danger btn-eliminar-proyecto" data-id="${
            proyecto.id
          }">
            Eliminar
          </button>
        </div>
      `;

      listaProyectos.appendChild(elementoProyecto);
    });
  };

  // Seleccionamos un proyecto y mostramos sus tareas
  const seleccionarProyecto = (idProyecto) => {
    const proyectos = obtenerProyectos();
    const proyecto = proyectos.find((p) => p.id === idProyecto);

    if (!proyecto) return;

    proyectoActual = idProyecto;

    // Mostramos la informacion del proyecto
    document.getElementById("nombreProyectoActual").textContent =
      proyecto.nombre;
    document.getElementById("descripcionProyectoActual").textContent =
      proyecto.descripcion;
    document.getElementById("estadoProyectoActual").textContent =
      proyecto.estado;
    document.getElementById("fechaInicio").textContent = proyecto.fecha_inicio;
    document.getElementById("fechaFin").textContent = proyecto.fecha_fin;

    // Mostramos los elementos del tablero
    infoProyecto.classList.remove("d-none");
    tableroTareas.classList.remove("d-none");
    btnAgregarTarea.classList.remove("d-none");
    btnAgregarNota.classList.remove("d-none");
    seccionNotas.classList.remove("d-none");
    mensajeInicial.classList.add("d-none");

    // Actualizamos la lista de proyectos
    mostrarProyectos();

    // Mostramos las tareas del proyecto
    mostrarTareas();

    // Mostramos las notas del proyecto
    mostrarNotas();
  };

  // ===== FUNCIONES PARA LAS TAREAS =====
  // Mostramos todas las tareas en el tablero
  const mostrarTareas = () => {
    // Limpiamos las tres columnas
    listaPendiente.innerHTML = "";
    listaEnProceso.innerHTML = "";
    listaHecha.innerHTML = "";

    const tareas = obtenerTareas();

    if (tareas.length === 0) {
      listaPendiente.innerHTML =
        '<p class="text-muted small">Sin tareas pendientes</p>';
      listaEnProceso.innerHTML =
        '<p class="text-muted small">Sin tareas en proceso</p>';
      listaHecha.innerHTML =
        '<p class="text-muted small">Sin tareas completadas</p>';
      return;
    }

    // Separamos las tareas por estado
    tareas.forEach((tarea, indice) => {
      const elementoTarea = crearElementoTarea(tarea, indice);

      // Colocamos en la columna correspondiente
      if (tarea.estado === "pendiente") {
        listaPendiente.appendChild(elementoTarea);
      } else if (tarea.estado === "en_proceso") {
        listaEnProceso.appendChild(elementoTarea);
      } else if (tarea.estado === "hecha") {
        listaHecha.appendChild(elementoTarea);
      }
    });
  };

  // Creamos el elemento para el drag & drop
  const crearElementoTarea = (tarea, indice) => {
    const li = document.createElement("li");
    li.classList.add("tarea-item", "card", "mb-2", "p-2");
    li.draggable = true; // Permitimos arrastrar
    li.dataset.indice = indice; // Guardamos el índice para identificarlo

    // Le ponemos un color segun su  prioridad
    let colorPrioridad = "border-secondary";
    if (tarea.prioridad === "alta") colorPrioridad = "border-danger";
    if (tarea.prioridad === "media") colorPrioridad = "border-warning";
    li.classList.add(colorPrioridad);

    li.innerHTML = `
      <div>
        <strong>${tarea.titulo}</strong>
        <span class="badge bg-${
          tarea.prioridad === "alta"
            ? "danger"
            : tarea.prioridad === "media"
            ? "warning"
            : "secondary"
        } float-end">
          ${tarea.prioridad}
        </span>
      </div>
      <small class="text-muted d-block">${tarea.descripcion}</small>
      <small class="text-muted">${tarea.fecha_vencimiento}</small>
      <small class="text-muted d-block">${tarea.asignado_a}</small>
      <div class="mt-2">
        <button class="btn btn-sm btn-warning btn-editar-tarea" data-indice="${indice}">Editar</button>
        <button class="btn btn-sm btn-danger btn-eliminar-tarea" data-indice="${indice}">Eliminar</button>
      </div>
    `;

    // ===== EVENTOS DEL DRAG & DROP =====
    // Cuando empieza a arrastrarse
    li.addEventListener("dragstart", function (e) {
      elementoArrastrado = this; // Guardamos la referencia
      this.classList.add("arrastrando"); // El efecto visual
      e.dataTransfer.effectAllowed = "move";
    });

    // Cuando se termina de arrastrarse
    li.addEventListener("dragend", function () {
      this.classList.remove("arrastrando");
    });

    return li;
  };

  // Hacemos que las columnas puedan recibir elementos arrastrados
  const configurarZonasDrop = () => {
    const zonas = [listaPendiente, listaEnProceso, listaHecha];

    zonas.forEach((zona, indexZona) => {
      // Permitimos que se pueda soltar aqui
      zona.addEventListener("dragover", function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      });

      // Evento para cuando se suelta la tarea en esta columna
      zona.addEventListener("drop", function (e) {
        e.preventDefault();

        if (elementoArrastrado) {
          const indiceTarea = parseInt(elementoArrastrado.dataset.indice);
          const tareas = obtenerTareas();

          // Determinamos el nuevo estado segun la zona
          let nuevoEstado = "pendiente";
          if (indexZona === 1) nuevoEstado = "en_proceso";
          if (indexZona === 2) nuevoEstado = "hecha";

          // Actualizamos el estado de la tarea
          tareas[indiceTarea].estado = nuevoEstado;
          guardarTareas(tareas);

          // Refrescamos el tablero
          mostrarTareas();
        }
      });
    });
  };

  // ===== FUNCIONES PARA LAS NOTAS =====
  // Mostramos todas las notas del proyecto
  const mostrarNotas = () => {
    listaNotas.innerHTML = "";
    const notas = obtenerNotas();

    if (notas.length === 0) {
      listaNotas.innerHTML = '<p class="text-muted">No hay notas todavía</p>';
      return;
    }

    notas.forEach((nota, indice) => {
      const divNota = document.createElement("div");
      divNota.classList.add("col-md-4", "mb-3");

      divNota.innerHTML = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${nota.titulo}</h5>
            <p class="card-text">${nota.contenido}</p>
            <small class="text-muted">${nota.fecha}</small>
            <div class="mt-2">
              <button class="btn btn-sm btn-warning btn-editar-nota" data-indice="${indice}">Editar</button>
              <button class="btn btn-sm btn-danger btn-eliminar-nota" data-indice="${indice}">Eliminar</button>
            </div>
          </div>
        </div>
      `;

      listaNotas.appendChild(divNota);
    });
  };

  // ===== EVENTOS DE LOS BOTONES =====
  // Guardammos el proyecto (creado o editado))
  btnGuardarProyecto.addEventListener("click", function () {
    const id = document.getElementById("idProyecto").value;
    const nombre = document.getElementById("nombreProyecto").value.trim();
    const descripcion = document
      .getElementById("descripcionProyecto")
      .value.trim();
    const estado = document.getElementById("estadoProyecto").value;
    const fechaInicio = document.getElementById("fechaInicioProyecto").value;
    const fechaFin = document.getElementById("fechaFinProyecto").value;

    if (!nombre || !descripcion || !fechaInicio || !fechaFin) {
      alert("Por favor completa todos los campos papu");
      return;
    }

    let proyectos = obtenerProyectos();

    if (id) {
      // Editamos el proyecto existente
      const indice = proyectos.findIndex((p) => p.id === id);
      proyectos[indice] = {
        id,
        nombre,
        descripcion,
        estado,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      };
    } else {
      // Creamos el nuevo proyecto
      const nuevoProyecto = {
        id: Date.now().toString(), // Le damos un id unico
        nombre,
        descripcion,
        estado,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      };
      proyectos.push(nuevoProyecto);
    }

    guardarProyectos(proyectos);
    mostrarProyectos();
    modalProyecto.hide();
    formularioProyecto.reset();
    document.getElementById("idProyecto").value = "";
  });

  // Clic en la lista de proyectos
  listaProyectos.addEventListener("click", function (e) {
    // Seleccionamos el proyecto
    if (e.target.classList.contains("btn-seleccionar")) {
      const id = e.target.dataset.id;
      seleccionarProyecto(id);
    }

    // Editamos el proyecto
    if (e.target.classList.contains("btn-editar-proyecto")) {
      const id = e.target.dataset.id;
      const proyectos = obtenerProyectos();
      const proyecto = proyectos.find((p) => p.id === id);

      // Llenamos el formulario con los datos
      document.getElementById("idProyecto").value = proyecto.id;
      document.getElementById("nombreProyecto").value = proyecto.nombre;
      document.getElementById("descripcionProyecto").value =
        proyecto.descripcion;
      document.getElementById("estadoProyecto").value = proyecto.estado;
      document.getElementById("fechaInicioProyecto").value =
        proyecto.fecha_inicio;
      document.getElementById("fechaFinProyecto").value = proyecto.fecha_fin;

      document.getElementById("tituloModalProyecto").textContent =
        "Editar Proyecto";
      modalProyecto.show();
    }

    // Eliminamos el proyecto
    if (e.target.classList.contains("btn-eliminar-proyecto")) {
      const id = e.target.dataset.id;

      if (
        confirm(
          "¿De verdad quieres eliminar este proyecto perro? Se borrarán todas sus tareas."
        )
      ) {
        let proyectos = obtenerProyectos();
        proyectos = proyectos.filter((p) => p.id !== id);
        guardarProyectos(proyectos);

        // Eliminamos también sus tareas y notas
        localStorage.removeItem(`tareas_${usuarioActivo}_${id}`);
        localStorage.removeItem(`notas_${usuarioActivo}_${id}`);

        // Si era el proyecto actual, limpiamos la vista
        if (proyectoActual === id) {
          proyectoActual = null;
          infoProyecto.classList.add("d-none");
          tableroTareas.classList.add("d-none");
          btnAgregarTarea.classList.add("d-none");
          btnAgregarNota.classList.add("d-none");
          seccionNotas.classList.add("d-none");
          mensajeInicial.classList.remove("d-none");
        }

        mostrarProyectos();
      }
    }
  });

  // Al abrir el modal de proyecto nuevo
  document
    .getElementById("modalProyecto")
    .addEventListener("hidden.bs.modal", function () {
      formularioProyecto.reset();
      document.getElementById("idProyecto").value = "";
      document.getElementById("tituloModalProyecto").textContent =
        "Nuevo Proyecto";
    });

  // Guardamos la tarea (creada o editada)
  btnGuardarTarea.addEventListener("click", function () {
    const id = document.getElementById("idTarea").value;
    const titulo = document.getElementById("tituloTarea").value.trim();
    const descripcion = document
      .getElementById("descripcionTarea")
      .value.trim();
    const estado = document.getElementById("estadoTarea").value;
    const prioridad = document.getElementById("prioridadTarea").value;
    const fechaVencimiento = document.getElementById(
      "fechaVencimientoTarea"
    ).value;
    const asignadoA = document.getElementById("asignadoATarea").value.trim();

    if (!titulo || !descripcion || !fechaVencimiento || !asignadoA) {
      alert("Por favor completa todos los campos juechumecha");
      return;
    }

    let tareas = obtenerTareas();

    if (id) {
      // Editamos la tarea existente
      const indice = parseInt(id);
      tareas[indice] = {
        proyecto_id: proyectoActual,
        titulo,
        descripcion,
        estado,
        prioridad,
        fecha_vencimiento: fechaVencimiento,
        asignado_a: asignadoA,
      };
    } else {
      // Creamos la nueva tarea
      const nuevaTarea = {
        proyecto_id: proyectoActual,
        titulo,
        descripcion,
        estado,
        prioridad,
        fecha_vencimiento: fechaVencimiento,
        asignado_a: asignadoA,
      };
      tareas.push(nuevaTarea);
    }

    guardarTareas(tareas);
    mostrarTareas();
    modalTarea.hide();
    formularioTarea.reset();
    document.getElementById("idTarea").value = "";
  });

  // Al hacer clic en la tarea
  const manejarClickTareas = (e) => {
    // Editamos la tarea
    if (e.target.classList.contains("btn-editar-tarea")) {
      const indice = parseInt(e.target.dataset.indice);
      const tareas = obtenerTareas();
      const tarea = tareas[indice];

      // Llenamos el formulario
      document.getElementById("idTarea").value = indice;
      document.getElementById("tituloTarea").value = tarea.titulo;
      document.getElementById("descripcionTarea").value = tarea.descripcion;
      document.getElementById("estadoTarea").value = tarea.estado;
      document.getElementById("prioridadTarea").value = tarea.prioridad;
      document.getElementById("fechaVencimientoTarea").value =
        tarea.fecha_vencimiento;
      document.getElementById("asignadoATarea").value = tarea.asignado_a;

      document.getElementById("tituloModalTarea").textContent = "Editar Tarea";
      modalTarea.show();
    }

    // Eliminamos la tarea
    if (e.target.classList.contains("btn-eliminar-tarea")) {
      const indice = parseInt(e.target.dataset.indice);

      if (confirm("¿De verdad quieres eliminar esta tarea perro?")) {
        let tareas = obtenerTareas();
        tareas.splice(indice, 1);
        guardarTareas(tareas);
        mostrarTareas();
      }
    }
  };

  // Agregamos el evento a las tres columnas
  listaPendiente.addEventListener("click", manejarClickTareas);
  listaEnProceso.addEventListener("click", manejarClickTareas);
  listaHecha.addEventListener("click", manejarClickTareas);

  // Al abrir el modal de tarea nueva
  document
    .getElementById("modalTarea")
    .addEventListener("hidden.bs.modal", function () {
      formularioTarea.reset();
      document.getElementById("idTarea").value = "";
      document.getElementById("tituloModalTarea").textContent = "Nueva Tarea";
      // Llenamos el correo del usuario actual
      document.getElementById("asignadoATarea").value = usuarioActivo;
    });

  // ===== EVENTOS PARA LAS NOTAS =====
  // Guardamos la nota (creada o editada)
  btnGuardarNota.addEventListener("click", function () {
    const id = document.getElementById("idNota").value;
    const titulo = document.getElementById("tituloNota").value.trim();
    const contenido = document.getElementById("contenidoNota").value.trim();

    if (!titulo || !contenido) {
      alert("Por favor completa todos los campos papu");
      return;
    }

    let notas = obtenerNotas();
    const fecha = new Date().toLocaleDateString();

    if (id) {
      // Editamos la nota existente
      const indice = parseInt(id);
      notas[indice] = {
        titulo,
        contenido,
        fecha: notas[indice].fecha, // Mantenemos la fecha original
      };
    } else {
      // Creamos la nueva nota
      const nuevaNota = {
        titulo,
        contenido,
        fecha,
      };
      notas.push(nuevaNota);
    }

    guardarNotas(notas);
    mostrarNotas();
    modalNota.hide();
    formularioNota.reset();
    document.getElementById("idNota").value = "";
  });

  // Eventos para editar y eliminar notas
  listaNotas.addEventListener("click", function (e) {
    // Editamos la nota
    if (e.target.classList.contains("btn-editar-nota")) {
      const indice = parseInt(e.target.dataset.indice);
      const notas = obtenerNotas();
      const nota = notas[indice];

      // Llenamos el formulario
      document.getElementById("idNota").value = indice;
      document.getElementById("tituloNota").value = nota.titulo;
      document.getElementById("contenidoNota").value = nota.contenido;

      document.getElementById("tituloModalNota").textContent = "Editar Nota";
      modalNota.show();
    }

    // Eliminamos la nota
    if (e.target.classList.contains("btn-eliminar-nota")) {
      const indice = parseInt(e.target.dataset.indice);

      if (confirm("¿De verdad quieres eliminar esta nota perro?")) {
        let notas = obtenerNotas();
        notas.splice(indice, 1);
        guardarNotas(notas);
        mostrarNotas();
      }
    }
  });

  // Al abrir el modal de nota nueva
  document
    .getElementById("modalNota")
    .addEventListener("hidden.bs.modal", function () {
      formularioNota.reset();
      document.getElementById("idNota").value = "";
      document.getElementById("tituloModalNota").textContent = "Nueva Nota";
    });

  // ===== PANEL DE ADMINISTRACIÓN =====
  // Mostramos el botón solo si es admin
  if (esAdmin) {
    btnPanelAdmin.classList.remove("d-none");

    // Redirigimos al panel de admin
    btnPanelAdmin.addEventListener("click", function () {
      window.location.href = "admin.html";
    });
  }

  // ===== AL INICIALIZAR =====
  // Mostramos el correo del usuario
  correoUsuario.textContent = usuarioActivo;

  // Cerramos la sesión
  btnCerrarSesion.addEventListener("click", function () {
    localStorage.removeItem("usuarioActivo");
    localStorage.removeItem("esAdmin");
    window.location.href = "login.html";
  });

  // Configuramos las zonas de drop para drag & drop
  configurarZonasDrop();

  document
    .querySelector('[data-bs-target="#modalProyecto"]')
    .addEventListener("click", function () {
      formularioProyecto.reset();
      document.getElementById("idProyecto").value = "";
      document.getElementById("tituloModalProyecto").textContent =
        "Nuevo Proyecto";
    });

  // Mostramos los proyectos al cargar
  mostrarProyectos();
});
