// Verificamos si es admin
document.addEventListener("DOMContentLoaded", function () {
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  const esAdmin = localStorage.getItem("esAdmin") === "true";

  // Si no es admin lo mandamos al login por bot
  if (!usuarioActivo || !esAdmin) {
    alert("No tienes permisos de administrador");
    window.location.href = "login.html";
    return;
  }

  // Mostramos el correo del admin
  document.getElementById("correoUsuario").textContent = usuarioActivo;

  // Para la navegacion entre secciones
  const botonesSecciones = document.querySelectorAll("[data-seccion]");
  const secciones = document.querySelectorAll(".seccion-admin");

  botonesSecciones.forEach((boton) => {
    boton.addEventListener("click", function () {
      // Quitamos el active de todos
      botonesSecciones.forEach((b) => b.classList.remove("active"));
      // Agregamos active al clickeado
      this.classList.add("active");

      // Ocultamos todas las secciones
      secciones.forEach((s) => s.classList.add("d-none"));

      // Mostramos la seccion seleccionada
      const seccion = this.dataset.seccion;
      document
        .getElementById(`seccion${capitalize(seccion)}`)
        .classList.remove("d-none");

      // Cargamos los datos de esa seccion
      cargarSeccion(seccion);
    });
  });

  // El boton para cerrar sesion
  document
    .getElementById("btnCerrarSesion")
    .addEventListener("click", function () {
      localStorage.removeItem("usuarioActivo");
      localStorage.removeItem("esAdmin");
      window.location.href = "login.html";
    });

  // Cargamos la primera seccion
  cargarSeccion("usuarios");
});

// Funcion auxiliar para capitalizar (Mayusculas)
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ===== FUNCIÓN PARA CARGAR SECCIONES =====
function cargarSeccion(seccion) {
  switch (seccion) {
    case "usuarios":
      cargarUsuarios();
      break;
    case "proyectos":
      cargarProyectos();
      break;
    case "tareas":
      cargarTareas();
      break;
    case "notas":
      cargarNotas();
      break;
  }
}

// ===== FUNCIONES EXTRAS COMO DRI =====
// Obtenemos todos los usuarios
function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios") || "[]");
}

// Obtenemos proyectos de un usuario
function obtenerProyectos(correo) {
  return JSON.parse(localStorage.getItem(`proyectos_${correo}`) || "[]");
}

// Obtenemos tareas de un proyecto
function obtenerTareas(correo, proyectoId) {
  return JSON.parse(
    localStorage.getItem(`tareas_${correo}_${proyectoId}`) || "[]"
  );
}

// Obtenemos notas de un proyecto
function obtenerNotas(correo, proyectoId) {
  return JSON.parse(
    localStorage.getItem(`notas_${correo}_${proyectoId}`) || "[]"
  );
}

// ===== GESTION DE USUARIOS (BABY SHE LIKES ME) =====
function cargarUsuarios() {
  const usuarios = obtenerUsuarios();
  const lista = document.getElementById("listaUsuarios");
  lista.innerHTML = "";

  usuarios.forEach((usuario, indice) => {
    const card = crearCard(
      `${usuario.correo} ${
        usuario.esAdmin ? '<span class="badge bg-warning">Admin</span>' : ""
      }`,
      "",
      [
        !usuario.esAdmin
          ? {
              texto: "Eliminar",
              clase: "danger",
              click: () => eliminarUsuario(indice),
            }
          : null,
      ].filter((b) => b)
    );
    lista.appendChild(card);
  });
}

function eliminarUsuario(indice) {
  if (!confirm("¿Really men?")) return;

  let usuarios = obtenerUsuarios();
  const correo = usuarios[indice].correo;

  // Eliminamos al usuario por gay
  usuarios.splice(indice, 1);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  // Eliminamos sus datos para que no queden ratros bro, ya tu sabe
  localStorage.removeItem(`proyectos_${correo}`);

  cargarUsuarios();
  alert("Usuario eliminado");
}

// AYUDA YA NO PUEDO MAS
// ===== GESTION DE PROYECTOS =====
function cargarProyectos() {
  const usuarios = obtenerUsuarios();
  const lista = document.getElementById("listaProyectos");
  lista.innerHTML = "";

  // Boton de agregar
  document.getElementById("btnAgregarProyecto").onclick = () =>
    abrirFormulario("proyecto");

  usuarios.forEach((usuario) => {
    const proyectos = obtenerProyectos(usuario.correo);

    proyectos.forEach((proyecto) => {
      const card = crearCard(
        `${proyecto.nombre} <span class="badge bg-info">${usuario.correo}</span>`,
        `${proyecto.descripcion}<br><small>Estado: ${proyecto.estado}</small>`,
        [
          {
            texto: "Editar",
            clase: "warning",
            click: () => abrirFormulario("proyecto", usuario.correo, proyecto),
          },
          {
            texto: "Eliminar",
            clase: "danger",
            click: () => eliminarProyecto(usuario.correo, proyecto.id),
          },
        ]
      );
      lista.appendChild(card);
    });
  });
}

function eliminarProyecto(correo, proyectoId) {
  if (!confirm("¿Eliminar este proyecto y todas sus tareas?")) return;

  let proyectos = obtenerProyectos(correo);
  proyectos = proyectos.filter((p) => p.id !== proyectoId);
  localStorage.setItem(`proyectos_${correo}`, JSON.stringify(proyectos));

  // Eliminamos las tareas y notas
  localStorage.removeItem(`tareas_${correo}_${proyectoId}`);
  localStorage.removeItem(`notas_${correo}_${proyectoId}`);

  cargarProyectos();
  alert("Proyecto eliminado");
}

// ===== GESTION DE TAREAS =====
function cargarTareas() {
  const usuarios = obtenerUsuarios();
  const lista = document.getElementById("listaTareas");
  lista.innerHTML = "";

  // Boton agregar
  document.getElementById("btnAgregarTarea").onclick = () =>
    abrirFormulario("tarea");

  usuarios.forEach((usuario) => {
    const proyectos = obtenerProyectos(usuario.correo);

    proyectos.forEach((proyecto) => {
      const tareas = obtenerTareas(usuario.correo, proyecto.id);

      tareas.forEach((tarea, indice) => {
        const card = crearCard(
          `${tarea.titulo} <span class="badge bg-info">${usuario.correo}</span> <span class="badge bg-secondary">${proyecto.nombre}</span>`,
          `${tarea.descripcion}<br><small>Estado: ${tarea.estado} | Prioridad: ${tarea.prioridad}</small>`,
          [
            {
              texto: "Editar",
              clase: "warning",
              click: () =>
                abrirFormulario(
                  "tarea",
                  usuario.correo,
                  proyecto.id,
                  tarea,
                  indice
                ),
            },
            {
              texto: "Eliminar",
              clase: "danger",
              click: () => eliminarTarea(usuario.correo, proyecto.id, indice),
            },
          ]
        );
        lista.appendChild(card);
      });
    });
  });
}

function eliminarTarea(correo, proyectoId, indice) {
  if (!confirm("¿Eliminar esta tarea?")) return;

  let tareas = obtenerTareas(correo, proyectoId);
  tareas.splice(indice, 1);
  localStorage.setItem(
    `tareas_${correo}_${proyectoId}`,
    JSON.stringify(tareas)
  );

  cargarTareas();
  alert("Tarea eliminada");
}

// ===== GESTION DE NOTAS =====
function cargarNotas() {
  const usuarios = obtenerUsuarios();
  const lista = document.getElementById("listaNotas");
  lista.innerHTML = "";

  // Boton agregar
  document.getElementById("btnAgregarNota").onclick = () =>
    abrirFormulario("nota");

  usuarios.forEach((usuario) => {
    const proyectos = obtenerProyectos(usuario.correo);

    proyectos.forEach((proyecto) => {
      const notas = obtenerNotas(usuario.correo, proyecto.id);

      notas.forEach((nota, indice) => {
        const card = crearCard(
          `${nota.titulo} <span class="badge bg-info">${usuario.correo}</span> <span class="badge bg-secondary">${proyecto.nombre}</span>`,
          `${nota.contenido}<br><small>${nota.fecha}</small>`,
          [
            {
              texto: "Editar",
              clase: "warning",
              click: () =>
                abrirFormulario(
                  "nota",
                  usuario.correo,
                  proyecto.id,
                  nota,
                  indice
                ),
            },
            {
              texto: "Eliminar",
              clase: "danger",
              click: () => eliminarNota(usuario.correo, proyecto.id, indice),
            },
          ]
        );
        lista.appendChild(card);
      });
    });
  });
}

function eliminarNota(correo, proyectoId, indice) {
  if (!confirm("¿Eliminar esta nota?")) return;

  let notas = obtenerNotas(correo, proyectoId);
  notas.splice(indice, 1);
  localStorage.setItem(`notas_${correo}_${proyectoId}`, JSON.stringify(notas));

  cargarNotas();
  alert("Nota eliminada");
}

// ===== FUNCION PARA AYUDAR A CREAR LAS CARDS =====
function crearCard(titulo, contenido, botones = []) {
  const card = document.createElement("div");
  card.classList.add("card", "mb-3", "p-3");

  let botonesHTML = "";
  botones.forEach((btn) => {
    const boton = document.createElement("button");
    boton.classList.add("btn", "btn-sm", `btn-${btn.clase}`, "me-2");
    boton.textContent = btn.texto;
    boton.onclick = btn.click;
    botonesHTML += boton.outerHTML;
  });

  card.innerHTML = `
    <div><strong>${titulo}</strong></div>
    <div class="text-muted">${contenido}</div>
    <div class="mt-2">${botonesHTML}</div>
  `;

  // Agregamos eventos a los botones
  botones.forEach((btn, i) => {
    card.querySelectorAll("button")[i].onclick = btn.click;
  });

  return card;
}

// ===== FORMULARIOS =====
function abrirFormulario(
  tipo,
  correo = null,
  proyectoOId = null,
  datos = null,
  indice = null
) {
  const usuarios = obtenerUsuarios();

  // Creamos el formulario segun el tipo
  let formulario = "";

  if (tipo === "proyecto") {
    formulario = `
      <div class="mb-3">
        <label class="form-label">Usuario</label>
        <select class="form-select" id="formUsuario">
          ${usuarios
            .map(
              (u) =>
                `<option value="${u.correo}" ${
                  u.correo === correo ? "selected" : ""
                }>${u.correo}</option>`
            )
            .join("")}
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Nombre del Proyecto</label>
        <input type="text" class="form-control" id="formNombre" value="${
          datos?.nombre || ""
        }" />
      </div>
      <div class="mb-3">
        <label class="form-label">Descripción</label>
        <textarea class="form-control" id="formDescripcion" rows="3">${
          datos?.descripcion || ""
        }</textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">Estado</label>
        <select class="form-select" id="formEstado">
          <option value="activo" ${
            datos?.estado === "activo" ? "selected" : ""
          }>Activo</option>
          <option value="pausado" ${
            datos?.estado === "pausado" ? "selected" : ""
          }>Pausado</option>
          <option value="completado" ${
            datos?.estado === "completado" ? "selected" : ""
          }>Completado</option>
        </select>
      </div>
      <div class="row">
        <div class="col-6">
          <label class="form-label">Fecha Inicio</label>
          <input type="date" class="form-control" id="formFechaInicio" value="${
            datos?.fecha_inicio || ""
          }" />
        </div>
        <div class="col-6">
          <label class="form-label">Fecha Fin</label>
          <input type="date" class="form-control" id="formFechaFin" value="${
            datos?.fecha_fin || ""
          }" />
        </div>
      </div>
    `;
  } else if (tipo === "tarea") {
    const proyectosUsuario = correo ? obtenerProyectos(correo) : [];

    formulario = `
      <div class="mb-3">
        <label class="form-label">Usuario</label>
        <select class="form-select" id="formUsuario">
          ${usuarios
            .map(
              (u) =>
                `<option value="${u.correo}" ${
                  u.correo === correo ? "selected" : ""
                }>${u.correo}</option>`
            )
            .join("")}
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Proyecto</label>
        <select class="form-select" id="formProyecto">
          ${proyectosUsuario
            .map(
              (p) =>
                `<option value="${p.id}" ${
                  p.id === proyectoOId ? "selected" : ""
                }>${p.nombre}</option>`
            )
            .join("")}
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Título</label>
        <input type="text" class="form-control" id="formTitulo" value="${
          datos?.titulo || ""
        }" />
      </div>
      <div class="mb-3">
        <label class="form-label">Descripción</label>
        <textarea class="form-control" id="formDescripcion" rows="3">${
          datos?.descripcion || ""
        }</textarea>
      </div>
      <div class="row">
        <div class="col-4">
          <label class="form-label">Estado</label>
          <select class="form-select" id="formEstado">
            <option value="pendiente" ${
              datos?.estado === "pendiente" ? "selected" : ""
            }>Pendiente</option>
            <option value="en_proceso" ${
              datos?.estado === "en_proceso" ? "selected" : ""
            }>En Proceso</option>
            <option value="hecha" ${
              datos?.estado === "hecha" ? "selected" : ""
            }>Hecha</option>
          </select>
        </div>
        <div class="col-4">
          <label class="form-label">Prioridad</label>
          <select class="form-select" id="formPrioridad">
            <option value="baja" ${
              datos?.prioridad === "baja" ? "selected" : ""
            }>Baja</option>
            <option value="media" ${
              datos?.prioridad === "media" ? "selected" : ""
            }>Media</option>
            <option value="alta" ${
              datos?.prioridad === "alta" ? "selected" : ""
            }>Alta</option>
          </select>
        </div>
        <div class="col-4">
          <label class="form-label">Vencimiento</label>
          <input type="date" class="form-control" id="formFecha" value="${
            datos?.fecha_vencimiento || ""
          }" />
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">Asignado a</label>
        <input type="email" class="form-control" id="formAsignado" value="${
          datos?.asignado_a || ""
        }" />
      </div>
    `;

    // Evento para cargar proyectos cuando cambia el usuario
    setTimeout(() => {
      document
        .getElementById("formUsuario")
        .addEventListener("change", function () {
          const usuario = this.value;
          const proyectos = obtenerProyectos(usuario);
          const select = document.getElementById("formProyecto");
          select.innerHTML = proyectos
            .map((p) => `<option value="${p.id}">${p.nombre}</option>`)
            .join("");
        });
    }, 100);
  } else if (tipo === "nota") {
    const proyectosUsuario = correo ? obtenerProyectos(correo) : [];

    formulario = `
      <div class="mb-3">
        <label class="form-label">Usuario</label>
        <select class="form-select" id="formUsuario">
          ${usuarios
            .map(
              (u) =>
                `<option value="${u.correo}" ${
                  u.correo === correo ? "selected" : ""
                }>${u.correo}</option>`
            )
            .join("")}
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Proyecto</label>
        <select class="form-select" id="formProyecto">
          ${proyectosUsuario
            .map(
              (p) =>
                `<option value="${p.id}" ${
                  p.id === proyectoOId ? "selected" : ""
                }>${p.nombre}</option>`
            )
            .join("")}
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Título</label>
        <input type="text" class="form-control" id="formTitulo" value="${
          datos?.titulo || ""
        }" />
      </div>
      <div class="mb-3">
        <label class="form-label">Contenido</label>
        <textarea class="form-control" id="formContenido" rows="5">${
          datos?.contenido || ""
        }</textarea>
      </div>
    `;

    // Evento para cargar proyectos
    setTimeout(() => {
      document
        .getElementById("formUsuario")
        .addEventListener("change", function () {
          const usuario = this.value;
          const proyectos = obtenerProyectos(usuario);
          const select = document.getElementById("formProyecto");
          select.innerHTML = proyectos
            .map((p) => `<option value="${p.id}">${p.nombre}</option>`)
            .join("");
        });
    }, 100);
  }

  // Creamos el modal
  const modalHTML = `
    <div class="modal fade" id="modalFormulario" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${
              datos ? "Editar" : "Agregar"
            } ${capitalize(tipo)}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            ${formulario}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" id="btnGuardarForm">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Eliminamos el modal anterior
  const modalAnterior = document.getElementById("modalFormulario");
  if (modalAnterior) modalAnterior.remove();

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Evento para guardar
  document.getElementById("btnGuardarForm").onclick = () =>
    guardarFormulario(tipo, correo, proyectoOId, datos, indice);

  // Mostramos el modal
  const modal = new bootstrap.Modal(document.getElementById("modalFormulario"));
  modal.show();
}

// ===== GUARDAR FORMULARIO =====
function guardarFormulario(tipo, correo, proyectoOId, datos, indice) {
  const usuario = correo || document.getElementById("formUsuario").value;

  if (tipo === "proyecto") {
    const nombre = document.getElementById("formNombre").value.trim();
    const descripcion = document.getElementById("formDescripcion").value.trim();
    const estado = document.getElementById("formEstado").value;
    const fechaInicio = document.getElementById("formFechaInicio").value;
    const fechaFin = document.getElementById("formFechaFin").value;

    if (!nombre || !descripcion || !fechaInicio || !fechaFin) {
      alert("Completa todos los campos");
      return;
    }

    let proyectos = obtenerProyectos(usuario);

    if (datos) {
      // Editamos
      const idx = proyectos.findIndex((p) => p.id === proyectoOId.id);
      proyectos[idx] = {
        id: proyectoOId.id,
        nombre,
        descripcion,
        estado,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      };
    } else {
      // Creamos
      proyectos.push({
        id: Date.now().toString(),
        nombre,
        descripcion,
        estado,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      });
    }

    localStorage.setItem(`proyectos_${usuario}`, JSON.stringify(proyectos));
    cargarProyectos();
  } else if (tipo === "tarea") {
    const proyecto = document.getElementById("formProyecto").value;
    const titulo = document.getElementById("formTitulo").value.trim();
    const descripcion = document.getElementById("formDescripcion").value.trim();
    const estado = document.getElementById("formEstado").value;
    const prioridad = document.getElementById("formPrioridad").value;
    const fecha = document.getElementById("formFecha").value;
    const asignado = document.getElementById("formAsignado").value.trim();

    if (!proyecto || !titulo || !descripcion || !fecha || !asignado) {
      alert("Completa todos los campos");
      return;
    }

    let tareas = obtenerTareas(usuario, proyecto);

    if (datos) {
      // Editamos
      tareas[indice] = {
        proyecto_id: proyecto,
        titulo,
        descripcion,
        estado,
        prioridad,
        fecha_vencimiento: fecha,
        asignado_a: asignado,
      };
    } else {
      // Creamos
      tareas.push({
        proyecto_id: proyecto,
        titulo,
        descripcion,
        estado,
        prioridad,
        fecha_vencimiento: fecha,
        asignado_a: asignado,
      });
    }

    localStorage.setItem(
      `tareas_${usuario}_${proyecto}`,
      JSON.stringify(tareas)
    );
    cargarTareas();
  } else if (tipo === "nota") {
    const proyecto = document.getElementById("formProyecto").value;
    const titulo = document.getElementById("formTitulo").value.trim();
    const contenido = document.getElementById("formContenido").value.trim();

    if (!proyecto || !titulo || !contenido) {
      alert("Completa todos los campos");
      return;
    }

    let notas = obtenerNotas(usuario, proyecto);
    const fecha = new Date().toLocaleDateString();

    if (datos) {
      // Editamos
      notas[indice] = {
        titulo,
        contenido,
        fecha: notas[indice].fecha,
      };
    } else {
      // Creamos
      notas.push({
        titulo,
        contenido,
        fecha,
      });
    }

    localStorage.setItem(`notas_${usuario}_${proyecto}`, JSON.stringify(notas));
    cargarNotas();
  }

  // Cerramos el modal
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("modalFormulario")
  );
  modal.hide();
  alert("Guardado correctamente");
}
