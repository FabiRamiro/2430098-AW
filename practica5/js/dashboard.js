document.addEventListener("DOMContentLoaded", function () {
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (!usuarioActivo) return;

  // Referenciamos a los elementos del DOM
  const taskForm = document.getElementById("taskForm");
  const taskNameInput = document.getElementById("taskName");
  const taskDescriptionInput = document.getElementById("taskDescription");
  const taskListContainer = document.getElementById("taskList");

  // Referenciamos a los elementos del modal
  const editTaskModal = new bootstrap.Modal(
    document.getElementById("editTaskModal")
  );
  const editTaskForm = document.getElementById("editTaskForm");
  const editTaskIdInput = document.getElementById("editTaskId");
  const editTaskNameInput = document.getElementById("editTaskName");
  const editTaskDescriptionInput = document.getElementById(
    "editTaskDescription"
  );
  const saveTaskChangesBtn = document.getElementById("saveTaskChanges");

  // Obtenemos las tares del usuario (desde el localStorage)
  const obtenerTareas = () => {
    const tareasGuardadas = localStorage.getItem(`tareas_${usuarioActivo}`);
    return tareasGuardadas ? JSON.parse(tareasGuardadas) : [];
  };

  // Guardamos un arreglo de tareas en localStorage
  const guardarTareas = (tareas) => {
    localStorage.setItem(`tareas_${usuarioActivo}`, JSON.stringify(tareas));
  };

  // Mostramos las tareas en la página
  const mostrarTareas = () => {
    taskListContainer.innerHTML = "";
    const tareas = obtenerTareas();

    if (tareas.length === 0) {
      taskListContainer.innerHTML =
        '<p class="text-center text-muted">No tienes tareas asignadas.</p>';
      return;
    }

    tareas.forEach((tarea, index) => {
      const tareaElemento = document.createElement("div");
      tareaElemento.classList.add("list-group-item");
      tareaElemento.innerHTML = `
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1 task-name">${tarea.nombre}</h5>
        </div>
        <p class="mb-1 task-description">${tarea.descripcion}</p>
        <div class="task-actions">
          <button class="btn btn-warning btn-sm edit-btn" data-index="${index}">Editar</button>
          <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Eliminar</button>
        </div>
      `;
      taskListContainer.appendChild(tareaElemento);
    });
  };

  // === Manejo de Eventos ===
  // Agregar una tarea
  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const nombreTarea = taskNameInput.value.trim();
    const descripcionTarea = taskDescriptionInput.value.trim();

    if (nombreTarea === "" || descripcionTarea === "") {
      alert("Por favor completa todos los campos juechumecha");
      return;
    }

    const nuevaTarea = {
      nombre: nombreTarea,
      descripcion: descripcionTarea,
    };

    const tareas = obtenerTareas();
    tareas.push(nuevaTarea);
    guardarTareas(tareas);

    taskForm.reset();
    mostrarTareas();
  });

  // Editar o eliminar una tarea
  taskListContainer.addEventListener("click", function (e) {
    const tareas = obtenerTareas();

    // Se se hizo click en eliminar
    if (e.target.classList.contains("delete-btn")) {
      const taskIndex = e.target.getAttribute("data-index");

      // Confirmar antes de eliminar
      if (confirm("¿De veritas quieres eliminar la tarea perro?")) {
        tareas.splice(taskIndex, 1); // Eliminamos solo 1 elementos en la posicion del index
        guardarTareas(tareas);
        mostrarTareas();
      }
    }

    // Si se hizo click en editar
    if (e.target.classList.contains("edit-btn")) {
      const taskIndex = e.target.getAttribute("data-index");
      const tareaAEditar = tareas[taskIndex];

      // Llenamos el modal con los datos de la tarea
      editTaskIdInput.value = taskIndex;
      editTaskNameInput.value = tareaAEditar.nombre;
      editTaskDescriptionInput.value = tareaAEditar.descripcion;

      // Mostramos el modal
      editTaskModal.show();
    }
  });

  // Guardamos los cambios desde el modal
  saveTaskChangesBtn.addEventListener("click", function () {
    const taskIndex = editTaskIdInput.value;
    const nuevoNombre = editTaskNameInput.value.trim();
    const nuevaDescripcion = editTaskDescriptionInput.value.trim();

    if (nuevoNombre === "" || nuevaDescripcion === "") {
      alert("Por favor llena todos los campos papu");
      return;
    }

    let tareas = obtenerTareas();
    // Vamos a actualizar la tarea en la posicion correcta
    tareas[taskIndex].nombre = nuevoNombre;
    tareas[taskIndex].descripcion = nuevaDescripcion;

    guardarTareas(tareas);
    mostrarTareas();

    // Ocultamos el modal
    editTaskModal.hide();
  });

  mostrarTareas();
});
