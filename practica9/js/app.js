// Funciones de apoyo generales
function showAlert(type, message, title) {
  if (typeof Swal === "undefined") {
    alert(message);
    return Promise.resolve();
  }
  var icon = type || "info";
  var heading = title;
  if (!heading) {
    if (icon === "success") heading = "Listo";
    else if (icon === "error") heading = "Error";
    else if (icon === "warning") heading = "Atencion";
    else heading = "Aviso";
  }
  return Swal.fire({
    icon: icon,
    title: heading,
    text: message || "",
    confirmButtonText: "Entendido",
  });
}

function showConfirm(options) {
  if (typeof Swal === "undefined") {
    return Promise.resolve(confirm(options.text || "Deseas continuar?"));
  }
  return Swal.fire({
    icon: options.icon || "question",
    title: options.title || "Confirmar",
    text: options.text || "",
    showCancelButton: true,
    confirmButtonText: options.confirmText || "Si",
    cancelButtonText: options.cancelText || "No",
    reverseButtons: true,
  }).then(function (result) {
    return result.isConfirmed;
  });
}

var modalCache = {};

function getModalInstance(id) {
  var element = document.getElementById(id);
  if (!element) return null;
  if (!modalCache[id]) {
    if (typeof bootstrap === "undefined" || !bootstrap.Modal) return null;
    modalCache[id] = new bootstrap.Modal(element, {
      backdrop: true,
      keyboard: true,
    });
  }
  return modalCache[id];
}

function openModal(id) {
  var instance = getModalInstance(id);
  if (!instance) return;
  instance.show();
}

function closeModal(id) {
  var instance = getModalInstance(id);
  if (!instance) return;
  instance.hide();
}

function resetForm(form) {
  if (!form) return;
  form.reset();
  var inputs = form.querySelectorAll(".control-formulario");
  inputs.forEach(function (input) {
    input.classList.remove("error");
    input.classList.remove("exito");
  });
}

function animateRow(row) {
  if (typeof anime === "undefined" || !row) return;
  anime({
    targets: row,
    backgroundColor: ["#fdf4ff", "#ffffff"],
    duration: 1200,
    easing: "easeOutQuad",
  });
}

function animateCards() {
  if (typeof gsap === "undefined") return;
  var stats = document.querySelectorAll(".tarjeta-estadistica");
  if (stats.length) {
    gsap.from(stats, {
      y: 35,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
    });
  }
  var cards = document.querySelectorAll(".tarjeta");
  if (cards.length) {
    gsap.from(cards, {
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
      delay: 0.1,
    });
  }
}

function setRowData(row, data) {
  if (!row) return;
  row.dataset.info = JSON.stringify(data);
}

function getRowData(row) {
  if (!row) return {};
  try {
    return JSON.parse(row.dataset.info || "{}");
  } catch (err) {
    return {};
  }
}

function formatDateToDisplay(fecha) {
  if (!fecha) return "";
  var partes = fecha.split("-");
  if (partes.length !== 3) return fecha;
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function formatDateToInput(fecha) {
  if (!fecha) return "";
  var partes = fecha.split("/");
  if (partes.length !== 3) return fecha;
  return partes[2] + "-" + partes[1] + "-" + partes[0];
}

function formatDateTime(fecha, hora) {
  if (!fecha || !hora) return "";
  var partesFecha = fecha.split("-");
  if (partesFecha.length !== 3) return fecha + " " + hora;
  var dia = partesFecha[2];
  var mes = partesFecha[1];
  var anio = partesFecha[0];
  var partesHora = hora.split(":");
  var horas = parseInt(partesHora[0], 10);
  var minutos = partesHora[1];
  var sufijo = "AM";
  if (horas >= 12) {
    sufijo = "PM";
    if (horas > 12) horas -= 12;
  }
  if (horas === 0) horas = 12;
  return (
    dia + "/" + mes + "/" + anio + " " + horas + ":" + minutos + " " + sufijo
  );
}

function splitDateTime(valor) {
  if (!valor) return { fecha: "", hora: "" };
  var partes = valor.split(" ");
  if (partes.length < 2) return { fecha: "", hora: "" };
  var fechaParte = partes[0];
  var horaParte = partes[1];
  var sufijo = partes[2] || "";
  var fecha = formatDateToInput(fechaParte);
  var horas = parseInt(horaParte.split(":")[0], 10);
  var minutos = horaParte.split(":")[1];
  if (sufijo === "PM" && horas < 12) horas += 12;
  if (sufijo === "AM" && horas === 12) horas = 0;
  var hora = String(horas).padStart(2, "0") + ":" + minutos;
  return { fecha: fecha, hora: hora };
}

function formatMoney(valor) {
  var numero = parseFloat(valor);
  if (isNaN(numero)) numero = 0;
  return "$" + numero.toFixed(2);
}

function parseMoneyText(texto) {
  if (!texto) return 0;
  return parseFloat(texto.replace(/[^0-9.-]/g, "")) || 0;
}

function initSessionInfo() {
  var data = sessionStorage.getItem("usuarioActual");
  if (!data) return;
  try {
    var usuario = JSON.parse(data);
    var nombre = document.getElementById("nombreUsuario");
    var rol = document.getElementById("rolUsuario");
    var avatar = document.getElementById("avatarUsuario");
    if (nombre) nombre.textContent = usuario.nombre;
    if (rol) {
      var etiqueta = "Usuario";
      if (usuario.rol === "admin") etiqueta = "Administrador";
      if (usuario.rol === "medico") etiqueta = "Medico";
      if (usuario.rol === "recepcionista") etiqueta = "Recepcionista";
      rol.textContent = etiqueta;
    }
    if (avatar && usuario.nombre) {
      var iniciales = usuario.nombre
        .split(" ")
        .filter(Boolean)
        .map(function (parte) {
          return parte[0];
        })
        .join("")
        .substring(0, 2)
        .toUpperCase();
      avatar.textContent = iniciales;
    }
  } catch (err) {}
}

function initModals() {
  var configuraciones = [
    {
      modal: "modalPaciente",
      abrir: ["botonNuevoPaciente"],
      cerrar: ["botonCerrarModal", "botonCancelar"],
    },
    {
      modal: "modalMedico",
      abrir: ["botonNuevoMedico"],
      cerrar: ["botonCerrarModalMedico", "botonCancelarMedico"],
    },
    {
      modal: "modalEspecialidad",
      abrir: ["botonNuevaEspecialidad"],
      cerrar: ["botonCerrarModalEspecialidad", "botonCancelarEspecialidad"],
    },
    {
      modal: "modalCita",
      abrir: ["botonNuevaCita"],
      cerrar: ["botonCerrarModalCita", "botonCancelarCita"],
    },
    {
      modal: "modalExpediente",
      abrir: ["botonNuevoExpediente"],
      cerrar: ["botonCerrarModalExpediente", "botonCancelarExpediente"],
    },
    {
      modal: "modalPago",
      abrir: ["botonRegistrarPago"],
      cerrar: ["botonCerrarModalPago", "botonCancelarPago"],
    },
    {
      modal: "modalTarifa",
      abrir: ["botonNuevaTarifa"],
      cerrar: ["botonCerrarModalTarifa", "botonCancelarTarifa"],
    },
  ];

  configuraciones.forEach(function (cfg) {
    var modal = document.getElementById(cfg.modal);
    if (!modal) return;
    getModalInstance(cfg.modal);

    if (cfg.abrir) {
      cfg.abrir.forEach(function (id) {
        var boton = document.getElementById(id);
        if (!boton) return;
        boton.addEventListener("click", function () {
          resetForm(modal.querySelector("form"));
          modal.querySelectorAll("[data-modo]").forEach(function (el) {
            el.removeAttribute("data-modo");
          });
          openModal(cfg.modal);
        });
      });
    }

    if (cfg.cerrar) {
      cfg.cerrar.forEach(function (id) {
        var botonCerrar = document.getElementById(id);
        if (!botonCerrar) return;
        botonCerrar.addEventListener("click", function () {
          closeModal(cfg.modal);
        });
      });
    }
  });
}

function setupAgenda() {
  var cuerpo = document.getElementById("cuerpoCitasTabla");
  var form = document.getElementById("formularioCita");
  if (!cuerpo || !form) return;

  var citas = [];
  var consecutivo = 0;
  var citaEnEdicion = null;

  function leerIniciales() {
    var filas = Array.from(cuerpo.querySelectorAll("tr"));
    filas.forEach(function (fila) {
      var celdas = fila.querySelectorAll("td");
      if (celdas.length < 6) return;
      var registro = {
        id: celdas[0].textContent.trim(),
        fechaHora: celdas[1].textContent.trim(),
        paciente: celdas[2].textContent.trim(),
        medico: celdas[3].textContent.trim(),
        motivo: celdas[4].textContent.trim(),
        estado: celdas[5].textContent.trim(),
        observaciones: fila.dataset.observaciones || "",
      };
      citas.push(registro);
      var numero = parseInt(registro.id.replace(/[^0-9]/g, ""), 10);
      if (!isNaN(numero) && numero > consecutivo) consecutivo = numero;
    });
  }

  function claseEstado(estado) {
    var base = "insignia-principal";
    var texto = estado.toLowerCase();
    if (texto.indexOf("confirm") !== -1) base = "insignia-exito";
    else if (texto.indexOf("pend") !== -1) base = "insignia-advertencia";
    else if (texto.indexOf("cancel") !== -1) base = "insignia-peligro";
    else if (texto.indexOf("atend") !== -1) base = "insignia-exito";
    return '<span class="insignia ' + base + '">' + estado + "</span>";
  }

  function renderizar() {
    cuerpo.innerHTML = "";
    citas.forEach(function (cita) {
      var fila = document.createElement("tr");
      fila.dataset.id = cita.id;
      setRowData(fila, cita);
      fila.innerHTML =
        "<td>" +
        cita.id +
        "</td><td>" +
        cita.fechaHora +
        "</td><td>" +
        cita.paciente +
        "</td><td>" +
        cita.medico +
        "</td><td>" +
        cita.motivo +
        "</td><td>" +
        claseEstado(cita.estado) +
        "</td><td>" +
        '<button class="boton boton-sm boton-principal boton-icono" title="Ver">' +
        '<i class="fas fa-eye"></i></button>' +
        '<button class="boton boton-sm boton-advertencia boton-icono" title="Editar">' +
        '<i class="fas fa-edit"></i></button>' +
        '<button class="boton boton-sm boton-peligro boton-icono" title="Cancelar">' +
        '<i class="fas fa-times"></i></button>' +
        "</td>";
      cuerpo.appendChild(fila);
    });
    actualizarResumen();
  }

  function actualizarResumen() {
    var total = document.getElementById("citasHoy");
    var confirmadas = document.getElementById("citasConfirmadas");
    var pendientes = document.getElementById("citasPendientes");
    var canceladas = document.getElementById("citasCanceladas");
    if (total) total.textContent = citas.length.toString();
    if (confirmadas)
      confirmadas.textContent = citas
        .filter(function (item) {
          return item.estado.toLowerCase().indexOf("confirm") !== -1;
        })
        .length.toString();
    if (pendientes)
      pendientes.textContent = citas
        .filter(function (item) {
          return item.estado.toLowerCase().indexOf("pend") !== -1;
        })
        .length.toString();
    if (canceladas)
      canceladas.textContent = citas
        .filter(function (item) {
          return item.estado.toLowerCase().indexOf("cancel") !== -1;
        })
        .length.toString();
  }

  function validarCita(datos) {
    if (!datos.paciente) return "Selecciona un paciente";
    if (!datos.medico) return "Selecciona un medico";
    if (!datos.fecha) return "Selecciona una fecha";
    if (!datos.hora) return "Selecciona una hora";
    if (!datos.motivo || datos.motivo.length < 5)
      return "Describe el motivo de la cita";
    if (!datos.estado) return "Selecciona un estado";
    return "";
  }

  leerIniciales();
  renderizar();

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    var datos = {
      paciente: form.paciente.value.trim(),
      medico: form.medico.value.trim(),
      fecha: form.fecha.value,
      hora: form.hora.value,
      motivo: form.motivo.value.trim(),
      estado: form.estado.value.trim(),
      observaciones: form.observaciones.value.trim(),
    };
    var error = validarCita(datos);
    if (error) {
      showAlert("error", error);
      return;
    }

    var fechaHora = formatDateTime(datos.fecha, datos.hora);

    var idObjetivo = citaEnEdicion;
    if (citaEnEdicion) {
      citas = citas.map(function (item) {
        if (item.id === citaEnEdicion) {
          item.paciente = datos.paciente;
          item.medico = datos.medico;
          item.fechaHora = fechaHora;
          item.motivo = datos.motivo;
          item.estado = datos.estado;
          item.observaciones = datos.observaciones;
        }
        return item;
      });
      showAlert("success", "Cita actualizada con exito");
    } else {
      consecutivo += 1;
      idObjetivo = "#" + String(consecutivo).padStart(3, "0");
      var nuevo = {
        id: idObjetivo,
        paciente: datos.paciente,
        medico: datos.medico,
        fechaHora: fechaHora,
        motivo: datos.motivo,
        estado: datos.estado,
        observaciones: datos.observaciones,
      };
      citas.push(nuevo);
      showAlert("success", "Cita creada correctamente");
    }

    renderizar();
    closeModal("modalCita");
    resetForm(form);
    var fila = cuerpo.querySelector('tr[data-id="' + idObjetivo + '"]');
    if (fila) animateRow(fila);
    citaEnEdicion = null;
  });

  cuerpo.addEventListener("click", function (evento) {
    var boton = evento.target.closest("button");
    if (!boton) return;
    var fila = boton.closest("tr");
    if (!fila) return;
    var info = getRowData(fila);
    var titulo = (boton.title || "").toLowerCase();

    if (titulo.indexOf("ver") !== -1) {
      var detalle =
        "Paciente: " +
        info.paciente +
        "\nMedico: " +
        info.medico +
        "\nFecha: " +
        info.fechaHora +
        "\nEstado: " +
        info.estado +
        (info.observaciones ? "\nNotas: " + info.observaciones : "");
      showAlert("info", detalle, "Detalle de cita");
      return;
    }

    if (titulo.indexOf("editar") !== -1) {
      citaEnEdicion = info.id;
      var partes = splitDateTime(info.fechaHora);
      form.paciente.value = info.paciente;
      form.medico.value = info.medico;
      form.fecha.value = partes.fecha;
      form.hora.value = partes.hora;
      form.motivo.value = info.motivo;
      form.estado.value = info.estado;
      form.observaciones.value = info.observaciones || "";
      openModal("modalCita");
      return;
    }

    if (titulo.indexOf("cancel") !== -1) {
      showConfirm({
        text: "Cancelar esta cita?",
        confirmText: "Cancelar",
      }).then(function (confirmado) {
        if (!confirmado) return;
        citas = citas.map(function (item) {
          if (item.id === info.id) {
            item.estado = "Cancelada";
          }
          return item;
        });
        renderizar();
        animateRow(cuerpo.querySelector('tr[data-id="' + info.id + '"]'));
        showAlert("success", "Cita cancelada");
      });
      return;
    }
  });
}

function setupPacientes() {
  var cuerpo = document.getElementById("cuerpoPacientesTabla");
  var form = document.getElementById("formularioPaciente");
  var buscador = document.getElementById("buscarPaciente");
  if (!cuerpo || !form) return;

  var pacientes = [];
  var consecutivo = 0;
  var pacienteEdicion = null;

  function leerIniciales() {
    Array.from(cuerpo.querySelectorAll("tr")).forEach(function (fila) {
      var celdas = fila.querySelectorAll("td");
      if (celdas.length < 9) return;
      var registro = {
        id: celdas[0].textContent.trim(),
        nombre: celdas[1].textContent.trim(),
        curp: celdas[2].textContent.trim(),
        nacimiento: celdas[3].textContent.trim(),
        sexo: celdas[4].textContent.trim(),
        telefono: celdas[5].textContent.trim(),
        email: celdas[6].textContent.trim(),
        estado: celdas[7].textContent.trim(),
      };
      pacientes.push(registro);
      var numero = parseInt(registro.id.replace(/[^0-9]/g, ""), 10);
      if (!isNaN(numero) && numero > consecutivo) consecutivo = numero;
    });
  }

  function renderizar(lista) {
    cuerpo.innerHTML = "";
    lista.forEach(function (paciente) {
      var fila = document.createElement("tr");
      fila.dataset.id = paciente.id;
      setRowData(fila, paciente);
      fila.innerHTML =
        "<td>" +
        paciente.id +
        "</td><td>" +
        paciente.nombre +
        "</td><td>" +
        paciente.curp +
        "</td><td>" +
        paciente.nacimiento +
        "</td><td>" +
        paciente.sexo +
        "</td><td>" +
        paciente.telefono +
        "</td><td>" +
        paciente.email +
        "</td><td>" +
        (paciente.estado.indexOf("Activo") !== -1
          ? '<span class="insignia insignia-exito">' +
            paciente.estado +
            "</span>"
          : '<span class="insignia insignia-peligro">' +
            paciente.estado +
            "</span>") +
        "</td><td>" +
        '<button class="boton boton-sm boton-principal boton-icono" title="Ver">' +
        '<i class="fas fa-eye"></i></button>' +
        '<button class="boton boton-sm boton-advertencia boton-icono" title="Editar">' +
        '<i class="fas fa-edit"></i></button>' +
        '<button class="boton boton-sm boton-peligro boton-icono" title="Eliminar">' +
        '<i class="fas fa-trash"></i></button>' +
        "</td>";
      cuerpo.appendChild(fila);
    });
  }

  function validar(datos) {
    if (!datos.nombre || datos.nombre.length < 5)
      return "Ingresa un nombre completo";
    if (!datos.curp || datos.curp.length !== 18)
      return "CURP debe tener 18 caracteres";
    if (!datos.nacimiento) return "Selecciona fecha de nacimiento";
    if (!datos.sexo) return "Selecciona el sexo";
    if (!datos.telefono || datos.telefono.length < 8)
      return "Telefono invalido";
    return "";
  }

  leerIniciales();
  renderizar(pacientes);

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    var datos = {
      nombre: form.nombreCompleto.value.trim(),
      curp: form.curp.value.trim().toUpperCase(),
      nacimiento: form.fechaNacimiento.value,
      sexo: form.sexo.value,
      telefono: form.telefono.value.trim(),
      email: form.email.value.trim(),
      direccion: form.direccion.value.trim(),
      contactoEmergencia: form.contactoEmergencia.value.trim(),
      telefonoEmergencia: form.telefonoEmergencia.value.trim(),
      alergias: form.alergias.value.trim(),
      antecedentes: form.antecedentes.value.trim(),
    };

    var error = validar(datos);
    if (error) {
      showAlert("error", error);
      return;
    }

    var registro = {
      id: pacienteEdicion || "",
      nombre: datos.nombre,
      curp: datos.curp,
      nacimiento: formatDateToDisplay(datos.nacimiento),
      sexo: datos.sexo,
      telefono: datos.telefono,
      email: datos.email || "-",
      estado: "Activo",
      direccion: datos.direccion,
      contactoEmergencia: datos.contactoEmergencia,
      telefonoEmergencia: datos.telefonoEmergencia,
      alergias: datos.alergias,
      antecedentes: datos.antecedentes,
    };

    if (pacienteEdicion) {
      pacientes = pacientes.map(function (item) {
        if (item.id === pacienteEdicion) {
          Object.assign(item, registro);
        }
        return item;
      });
      showAlert("success", "Paciente actualizado");
    } else {
      consecutivo += 1;
      registro.id = String(consecutivo).padStart(3, "0");
      pacientes.push(registro);
      showAlert("success", "Paciente registrado");
    }

    renderizar(pacientes);
    closeModal("modalPaciente");
    resetForm(form);
    pacienteEdicion = null;
    animateRow(cuerpo.querySelector('tr[data-id="' + registro.id + '"]'));
  });

  cuerpo.addEventListener("click", function (evento) {
    var boton = evento.target.closest("button");
    if (!boton) return;
    var fila = boton.closest("tr");
    if (!fila) return;
    var data = getRowData(fila);
    var accion = (boton.title || "").toLowerCase();

    if (accion.indexOf("ver") !== -1) {
      var detalle =
        "Nombre: " +
        data.nombre +
        "\nCURP: " +
        data.curp +
        "\nTelefono: " +
        data.telefono +
        (data.email ? "\nEmail: " + data.email : "");
      showAlert("info", detalle, "Paciente");
      return;
    }

    if (accion.indexOf("editar") !== -1) {
      pacienteEdicion = data.id;
      form.nombreCompleto.value = data.nombre;
      form.curp.value = data.curp;
      form.fechaNacimiento.value = formatDateToInput(data.nacimiento);
      form.sexo.value = data.sexo;
      form.telefono.value = data.telefono;
      form.email.value = data.email === "-" ? "" : data.email;
      form.direccion.value = data.direccion || "";
      form.contactoEmergencia.value = data.contactoEmergencia || "";
      form.telefonoEmergencia.value = data.telefonoEmergencia || "";
      form.alergias.value = data.alergias || "";
      form.antecedentes.value = data.antecedentes || "";
      openModal("modalPaciente");
      return;
    }

    if (accion.indexOf("eliminar") !== -1) {
      showConfirm({ text: "Eliminar paciente " + data.nombre + "?" }).then(
        function (confirmado) {
          if (!confirmado) return;
          pacientes = pacientes.filter(function (item) {
            return item.id !== data.id;
          });
          renderizar(pacientes);
          showAlert("success", "Paciente eliminado");
        }
      );
    }
  });

  if (buscador) {
    buscador.addEventListener("input", function () {
      var texto = buscador.value.trim().toLowerCase();
      if (!texto) {
        renderizar(pacientes);
        return;
      }
      var filtrados = pacientes.filter(function (item) {
        return (
          item.nombre.toLowerCase().indexOf(texto) !== -1 ||
          item.curp.toLowerCase().indexOf(texto) !== -1
        );
      });
      renderizar(filtrados);
    });
  }
}

function setupMedicos() {
  var cuerpo = document.getElementById("cuerpoMedicosTabla");
  var form = document.getElementById("formularioMedico");
  var buscador = document.getElementById("buscarMedico");
  if (!cuerpo || !form) return;

  var medicos = [];
  var consecutivo = 0;
  var edicion = null;

  function leerIniciales() {
    Array.from(cuerpo.querySelectorAll("tr")).forEach(function (fila) {
      var celdas = fila.querySelectorAll("td");
      if (celdas.length < 9) return;
      var registro = {
        id: celdas[0].textContent.trim(),
        nombre: celdas[1].textContent.trim(),
        cedula: celdas[2].textContent.trim(),
        especialidad: celdas[3].textContent.trim(),
        telefono: celdas[4].textContent.trim(),
        email: celdas[5].textContent.trim(),
        horario: celdas[6].textContent.trim(),
        estado: celdas[7].textContent.trim(),
      };
      medicos.push(registro);
      var numero = parseInt(registro.id.replace(/[^0-9]/g, ""), 10);
      if (!isNaN(numero) && numero > consecutivo) consecutivo = numero;
    });
  }

  function renderizar(lista) {
    cuerpo.innerHTML = "";
    lista.forEach(function (medico) {
      var fila = document.createElement("tr");
      fila.dataset.id = medico.id;
      setRowData(fila, medico);
      fila.innerHTML =
        "<td>" +
        medico.id +
        "</td><td>" +
        medico.nombre +
        "</td><td>" +
        medico.cedula +
        "</td><td>" +
        medico.especialidad +
        "</td><td>" +
        medico.telefono +
        "</td><td>" +
        medico.email +
        "</td><td>" +
        medico.horario +
        '</td><td><span class="insignia ' +
        (medico.estado.indexOf("Activo") !== -1
          ? "insignia-exito"
          : "insignia-peligro") +
        '">' +
        medico.estado +
        "</span></td><td>" +
        '<button class="boton boton-sm boton-principal boton-icono" title="Ver">' +
        '<i class="fas fa-eye"></i></button>' +
        '<button class="boton boton-sm boton-advertencia boton-icono" title="Editar">' +
        '<i class="fas fa-edit"></i></button>' +
        '<button class="boton boton-sm boton-peligro boton-icono" title="Eliminar">' +
        '<i class="fas fa-trash"></i></button>' +
        "</td>";
      cuerpo.appendChild(fila);
    });
  }

  function validar(datos) {
    if (!datos.nombre || datos.nombre.length < 5)
      return "Ingresa el nombre del medico";
    if (!datos.cedula) return "Ingresa la cedula";
    if (!datos.especialidad) return "Selecciona especialidad";
    if (!datos.telefono || datos.telefono.length < 8)
      return "Telefono invalido";
    if (!datos.email) return "Ingresa un correo";
    if (!datos.horario) return "Ingresa el horario";
    return "";
  }

  leerIniciales();
  renderizar(medicos);

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    var datos = {
      nombre: form.nombreCompleto.value.trim(),
      cedula: form.cedula.value.trim(),
      especialidad: form.especialidad.value.trim(),
      telefono: form.telefono.value.trim(),
      email: form.email.value.trim(),
      horario: form.horario.value.trim(),
      estado: form.estatus.value === "1" ? "Activo" : "Inactivo",
    };

    var error = validar(datos);
    if (error) {
      showAlert("error", error);
      return;
    }

    if (edicion) {
      medicos = medicos.map(function (item) {
        if (item.id === edicion) {
          Object.assign(item, datos);
        }
        return item;
      });
      showAlert("success", "Medico actualizado");
    } else {
      consecutivo += 1;
      var nuevo = Object.assign(
        { id: String(consecutivo).padStart(3, "0") },
        datos
      );
      medicos.push(nuevo);
      showAlert("success", "Medico registrado");
    }

    renderizar(medicos);
    closeModal("modalMedico");
    resetForm(form);
    animateRow(
      cuerpo.querySelector(
        'tr[data-id="' +
          (edicion || String(consecutivo).padStart(3, "0")) +
          '"]'
      )
    );
    edicion = null;
  });

  cuerpo.addEventListener("click", function (evento) {
    var boton = evento.target.closest("button");
    if (!boton) return;
    var fila = boton.closest("tr");
    if (!fila) return;
    var data = getRowData(fila);
    var accion = (boton.title || "").toLowerCase();

    if (accion.indexOf("ver") !== -1) {
      var detalle =
        "Nombre: " +
        data.nombre +
        "\nEspecialidad: " +
        data.especialidad +
        "\nHorario: " +
        data.horario;
      showAlert("info", detalle, "Medico");
      return;
    }

    if (accion.indexOf("editar") !== -1) {
      edicion = data.id;
      form.nombreCompleto.value = data.nombre;
      form.cedula.value = data.cedula;
      form.especialidad.value = "";
      var opciones = Array.from(form.especialidad.options);
      var encontrado = opciones.find(function (opt) {
        return opt.textContent.indexOf(data.especialidad) !== -1;
      });
      if (encontrado) form.especialidad.value = encontrado.value;
      form.telefono.value = data.telefono;
      form.email.value = data.email;
      form.horario.value = data.horario;
      form.estatus.value = data.estado.indexOf("Activo") !== -1 ? "1" : "0";
      openModal("modalMedico");
      return;
    }

    if (accion.indexOf("eliminar") !== -1) {
      showConfirm({ text: "Eliminar medico " + data.nombre + "?" }).then(
        function (si) {
          if (!si) return;
          medicos = medicos.filter(function (item) {
            return item.id !== data.id;
          });
          renderizar(medicos);
          showAlert("success", "Medico eliminado");
        }
      );
    }
  });

  if (buscador) {
    buscador.addEventListener("input", function () {
      var texto = buscador.value.trim().toLowerCase();
      if (!texto) {
        renderizar(medicos);
        return;
      }
      var filtrados = medicos.filter(function (item) {
        return (
          item.nombre.toLowerCase().indexOf(texto) !== -1 ||
          item.especialidad.toLowerCase().indexOf(texto) !== -1
        );
      });
      renderizar(filtrados);
    });
  }
}

function setupEspecialidades() {
  var grid = document.getElementById("cuadriculaEspecialidades");
  var form = document.getElementById("formularioEspecialidad");
  if (!grid || !form) return;

  function crearTarjeta(info) {
    var col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.dataset.nombre = info.nombre;
    col.innerHTML =
      '<div class="tarjeta h-100">' +
      '<div class="cuerpo-tarjeta">' +
      '<div class="d-flex justify-content-between align-items-start mb-3">' +
      '<div class="icono-estadistica" style="width:50px;height:50px;background:rgba(79,70,229,0.1);color:var(--color-principal);">' +
      '<i class="fas fa-star"></i></div>' +
      '<div class="dropdown">' +
      '<button class="boton boton-sm boton-secundario dropdown-toggle" type="button" data-bs-toggle="dropdown">' +
      '<i class="fas fa-ellipsis-v"></i></button>' +
      '<ul class="dropdown-menu">' +
      '<li><a class="dropdown-item" href="#" data-accion="editar">' +
      '<i class="fas fa-edit me-2"></i>Editar</a></li>' +
      '<li><a class="dropdown-item text-danger" href="#" data-accion="eliminar">' +
      '<i class="fas fa-trash me-2"></i>Eliminar</a></li>' +
      "</ul></div></div>" +
      '<h5 class="mb-2">' +
      info.nombre +
      '</h5><p class="text-muted small">' +
      info.descripcion +
      "</p>" +
      '<div class="mt-3"><span class="insignia insignia-principal me-2">' +
      info.medicos +
      ' Medicos</span><span class="insignia insignia-exito">' +
      info.consultas +
      " Consultas/mes</span></div></div></div>";
    return col;
  }

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    var nombre = form.nombre.value.trim();
    var descripcion = form.descripcion.value.trim();
    if (!nombre || nombre.length < 3) {
      showAlert("error", "Ingresa el nombre de la especialidad");
      return;
    }
    if (!descripcion || descripcion.length < 10) {
      showAlert("error", "Describe la especialidad");
      return;
    }

    var nueva = crearTarjeta({
      nombre: nombre,
      descripcion: descripcion,
      medicos: Math.floor(Math.random() * 5) + 2,
      consultas: Math.floor(Math.random() * 60) + 20,
    });
    grid.prepend(nueva);
    showAlert("success", "Especialidad guardada");
    closeModal("modalEspecialidad");
    resetForm(form);
    if (typeof anime !== "undefined") {
      anime({
        targets: nueva,
        translateY: [-20, 0],
        opacity: [0, 1],
        duration: 600,
        easing: "easeOutQuad",
      });
    }
  });

  grid.addEventListener("click", function (evento) {
    var enlace = evento.target.closest("a[data-accion]");
    if (!enlace) return;
    evento.preventDefault();
    var tarjeta = evento.target.closest(".col-md-4");
    if (!tarjeta) return;
    var accion = enlace.dataset.accion;
    var nombre =
      tarjeta.dataset.nombre || tarjeta.querySelector("h5").textContent.trim();

    if (accion === "editar") {
      form.nombre.value = nombre;
      form.descripcion.value = tarjeta.querySelector("p").textContent.trim();
      openModal("modalEspecialidad");
      return;
    }

    if (accion === "eliminar") {
      showConfirm({ text: "Eliminar especialidad " + nombre + "?" }).then(
        function (si) {
          if (!si) return;
          tarjeta.remove();
          showAlert("success", "Especialidad eliminada");
        }
      );
    }
  });
}

function setupExpedientes() {
  var cuerpo = document.getElementById("cuerpoExpedientesTabla");
  var form = document.getElementById("formularioExpediente");
  if (!cuerpo || !form) return;

  var expedientes = [];
  var consecutivo = 0;
  var editando = null;

  function leerIniciales() {
    Array.from(cuerpo.querySelectorAll("tr")).forEach(function (fila) {
      var celdas = fila.querySelectorAll("td");
      if (celdas.length < 7) return;
      var registro = {
        id: celdas[0].textContent.trim(),
        fechaConsulta: celdas[1].textContent.trim(),
        paciente: celdas[2].textContent.trim(),
        medico: celdas[3].textContent.trim(),
        diagnostico: celdas[4].textContent.trim(),
        proxima: celdas[5].textContent.trim(),
      };
      expedientes.push(registro);
      var numero = parseInt(registro.id.replace(/[^0-9]/g, ""), 10);
      if (!isNaN(numero) && numero > consecutivo) consecutivo = numero;
      setRowData(fila, registro);
    });
  }

  function renderizar() {
    cuerpo.innerHTML = "";
    expedientes.forEach(function (exp) {
      var fila = document.createElement("tr");
      fila.dataset.id = exp.id;
      setRowData(fila, exp);
      fila.innerHTML =
        "<td>" +
        exp.id +
        "</td><td>" +
        exp.fechaConsulta +
        "</td><td>" +
        exp.paciente +
        "</td><td>" +
        exp.medico +
        "</td><td>" +
        exp.diagnostico +
        "</td><td>" +
        exp.proxima +
        "</td><td>" +
        '<button class="boton boton-sm boton-principal boton-icono" title="Ver Detalle">' +
        '<i class="fas fa-eye"></i></button>' +
        '<button class="boton boton-sm boton-advertencia boton-icono" title="Editar">' +
        '<i class="fas fa-edit"></i></button>' +
        '<button class="boton boton-sm boton-exito boton-icono" title="Descargar PDF">' +
        '<i class="fas fa-file-pdf"></i></button>' +
        "</td>";
      cuerpo.appendChild(fila);
    });
  }

  leerIniciales();

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    var datos = {
      paciente: form.paciente.value.trim(),
      medico: form.medico.value.trim(),
      fechaConsulta: form.fechaConsulta.value,
      proximaCita: form.proximaCita.value,
      sintomas: form.sintomas.value.trim(),
      diagnostico: form.diagnostico.value.trim(),
      tratamiento: form.tratamiento.value.trim(),
      receta: form.receta.value.trim(),
      notas: form.notas.value.trim(),
    };

    if (!datos.paciente) {
      showAlert("error", "Selecciona un paciente");
      return;
    }
    if (!datos.medico) {
      showAlert("error", "Selecciona un medico");
      return;
    }
    if (!datos.fechaConsulta) {
      showAlert("error", "Ingresa la fecha de consulta");
      return;
    }
    if (!datos.diagnostico) {
      showAlert("error", "Ingresa un diagnostico");
      return;
    }

    var registro = {
      id: editando || "",
      paciente: datos.paciente,
      medico: datos.medico,
      fechaConsulta: formatDateTime(
        datos.fechaConsulta.split("T")[0],
        datos.fechaConsulta.split("T")[1]
      ),
      diagnostico: datos.diagnostico,
      proxima: datos.proximaCita
        ? formatDateTime(
            datos.proximaCita.split("T")[0],
            datos.proximaCita.split("T")[1]
          )
        : "-",
      sintomas: datos.sintomas,
      tratamiento: datos.tratamiento,
      receta: datos.receta,
      notas: datos.notas,
    };

    if (editando) {
      expedientes = expedientes.map(function (item) {
        if (item.id === editando) {
          Object.assign(item, registro);
        }
        return item;
      });
      showAlert("success", "Expediente actualizado");
    } else {
      consecutivo += 1;
      registro.id = "#EXP-" + String(consecutivo).padStart(3, "0");
      expedientes.push(registro);
      showAlert("success", "Expediente guardado");
    }

    renderizar();
    closeModal("modalExpediente");
    resetForm(form);
    animateRow(cuerpo.querySelector('tr[data-id="' + registro.id + '"]'));
    editando = null;
  });

  cuerpo.addEventListener("click", function (evento) {
    var boton = evento.target.closest("button");
    if (!boton) return;
    var fila = boton.closest("tr");
    if (!fila) return;
    var data = getRowData(fila);
    var accion = (boton.title || "").toLowerCase();

    if (accion.indexOf("ver") !== -1) {
      var detalle =
        "Paciente: " +
        data.paciente +
        "\nMedico: " +
        data.medico +
        "\nFecha: " +
        data.fechaConsulta +
        "\nDiagnostico: " +
        data.diagnostico +
        (data.tratamiento ? "\nTratamiento: " + data.tratamiento : "");
      showAlert("info", detalle, "Expediente");
      return;
    }

    if (accion.indexOf("editar") !== -1) {
      editando = data.id;
      form.paciente.value = data.paciente;
      form.medico.value = data.medico;
      var partesFecha = data.fechaConsulta.split(" ");
      form.fechaConsulta.value =
        formatDateToInput(partesFecha[0]) +
        "T" +
        splitDateTime(data.fechaConsulta).hora;
      form.proximaCita.value =
        data.proxima && data.proxima !== "-"
          ? formatDateToInput(data.proxima.split(" ")[0]) +
            "T" +
            splitDateTime(data.proxima).hora
          : "";
      form.sintomas.value = data.sintomas || "";
      form.diagnostico.value = data.diagnostico || "";
      form.tratamiento.value = data.tratamiento || "";
      form.receta.value = data.receta || "";
      form.notas.value = data.notas || "";
      openModal("modalExpediente");
      return;
    }

    if (accion.indexOf("pdf") !== -1) {
      showAlert("success", "Descargando reporte...", "PDF listo");
    }
  });
}

function setupPagos() {
  var cuerpo = document.getElementById("cuerpoPagosTabla");
  var form = document.getElementById("formularioPago");
  if (!cuerpo || !form) return;

  var pagos = [];
  var consecutivo = 0;

  function leerIniciales() {
    Array.from(cuerpo.querySelectorAll("tr")).forEach(function (fila) {
      var celdas = fila.querySelectorAll("td");
      if (celdas.length < 9) return;
      var registro = {
        id: celdas[0].textContent.trim(),
        fecha: celdas[1].textContent.trim(),
        paciente: celdas[2].textContent.trim(),
        concepto: celdas[3].textContent.trim(),
        monto: parseMoneyText(celdas[4].textContent),
        metodo: celdas[5].textContent.trim(),
        estado: celdas[6].textContent.trim(),
        referencia: celdas[7].textContent.trim(),
      };
      pagos.push(registro);
      var numero = parseInt(registro.id.replace(/[^0-9]/g, ""), 10);
      if (!isNaN(numero) && numero > consecutivo) consecutivo = numero;
      setRowData(fila, registro);
    });
  }

  function badgeMetodo(texto) {
    var clase = "insignia-principal";
    var lower = texto.toLowerCase();
    if (lower.indexOf("tarjeta") !== -1) clase = "insignia-secundario";
    if (lower.indexOf("transfer") !== -1) clase = "insignia-advertencia";
    return '<span class="insignia ' + clase + '">' + texto + "</span>";
  }

  function badgeEstado(texto) {
    var clase = "insignia-advertencia";
    var lower = texto.toLowerCase();
    if (lower.indexOf("pagado") !== -1) clase = "insignia-exito";
    if (lower.indexOf("cancel") !== -1) clase = "insignia-peligro";
    return '<span class="insignia ' + clase + '">' + texto + "</span>";
  }

  function renderizar() {
    cuerpo.innerHTML = "";
    pagos.forEach(function (pago) {
      var fila = document.createElement("tr");
      fila.dataset.id = pago.id;
      setRowData(fila, pago);
      fila.innerHTML =
        "<td>" +
        pago.id +
        "</td><td>" +
        pago.fecha +
        "</td><td>" +
        pago.paciente +
        "</td><td>" +
        pago.concepto +
        '</td><td class="fw-bold">' +
        formatMoney(pago.monto) +
        "</td><td>" +
        badgeMetodo(pago.metodo) +
        "</td><td>" +
        badgeEstado(pago.estado) +
        "</td><td>" +
        (pago.referencia || "-") +
        "</td><td>" +
        '<button class="boton boton-sm boton-principal boton-icono" title="Ver Recibo">' +
        '<i class="fas fa-file-invoice"></i></button>' +
        (pago.estado.toLowerCase().indexOf("pendiente") !== -1
          ? '<button class="boton boton-sm boton-advertencia boton-icono" title="Confirmar">' +
            '<i class="fas fa-check"></i></button>'
          : '<button class="boton boton-sm boton-exito boton-icono" title="Imprimir">' +
            '<i class="fas fa-print"></i></button>') +
        "</td>";
      cuerpo.appendChild(fila);
    });
  }

  leerIniciales();

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    var cita = form.cita.value.trim();
    var paciente = form.paciente.value.trim();
    var monto = parseFloat(form.monto.value);
    var metodo = form.metodoPago.value.trim();
    var estado = form.estadoPago.value.trim();
    var referencia = form.referencia.value.trim();
    var concepto = cita ? "Cita " + cita : "Servicio";

    if (!cita) {
      showAlert("error", "Selecciona la cita");
      return;
    }
    if (!monto || monto <= 0) {
      showAlert("error", "Ingresa un monto valido");
      return;
    }
    if (!metodo) {
      showAlert("error", "Selecciona metodo de pago");
      return;
    }

    consecutivo += 1;
    var registro = {
      id: "#PAG-" + String(consecutivo).padStart(3, "0"),
      fecha: new Date().toLocaleString(),
      paciente: paciente || "Paciente",
      concepto: concepto,
      monto: monto,
      metodo: metodo.charAt(0).toUpperCase() + metodo.slice(1),
      estado: estado.charAt(0).toUpperCase() + estado.slice(1),
      referencia: referencia,
    };
    pagos.push(registro);
    renderizar();
    closeModal("modalPago");
    resetForm(form);
    showAlert("success", "Pago registrado");
    animateRow(cuerpo.querySelector('tr[data-id="' + registro.id + '"]'));
  });

  cuerpo.addEventListener("click", function (evento) {
    var boton = evento.target.closest("button");
    if (!boton) return;
    var fila = boton.closest("tr");
    if (!fila) return;
    var data = getRowData(fila);
    var accion = (boton.title || "").toLowerCase();

    if (accion.indexOf("recibo") !== -1) {
      var texto =
        "Paciente: " +
        data.paciente +
        "\nConcepto: " +
        data.concepto +
        "\nMonto: " +
        formatMoney(data.monto) +
        "\nMetodo: " +
        data.metodo;
      showAlert("info", texto, "Recibo");
      return;
    }

    if (accion.indexOf("confirm") !== -1) {
      showConfirm({ text: "Confirmar pago?" }).then(function (si) {
        if (!si) return;
        data.estado = "Pagado";
        pagos = pagos.map(function (item) {
          if (item.id === data.id) {
            item.estado = "Pagado";
          }
          return item;
        });
        renderizar();
        showAlert("success", "Pago confirmado");
      });
      return;
    }

    if (accion.indexOf("imprimir") !== -1) {
      showAlert("success", "Imprimiendo recibo...");
    }
  });
}

function setupTarifas() {
  var cuerpo = document.getElementById("cuerpoTarifasTabla");
  var form = document.getElementById("formularioTarifa");
  if (!cuerpo || !form) return;

  var tarifas = [];
  var consecutivo = 0;
  var editando = null;

  function leerIniciales() {
    Array.from(cuerpo.querySelectorAll("tr")).forEach(function (fila) {
      var celdas = fila.querySelectorAll("td");
      if (celdas.length < 7) return;
      var registro = {
        id: celdas[0].textContent.trim(),
        descripcion: celdas[1].textContent.trim(),
        especialidad: celdas[2].textContent.trim(),
        costo: parseMoneyText(celdas[3].textContent),
        estado: celdas[4].textContent.trim(),
        actualizacion: celdas[5].textContent.trim(),
      };
      tarifas.push(registro);
      var numero = parseInt(registro.id.replace(/[^0-9]/g, ""), 10);
      if (!isNaN(numero) && numero > consecutivo) consecutivo = numero;
    });
  }

  function badgeEstado(estado) {
    var clase =
      estado.indexOf("Activo") !== -1 ? "insignia-exito" : "insignia-peligro";
    return '<span class="insignia ' + clase + '">' + estado + "</span>";
  }

  function renderizar() {
    cuerpo.innerHTML = "";
    tarifas.forEach(function (tarifa) {
      var fila = document.createElement("tr");
      fila.dataset.id = tarifa.id;
      setRowData(fila, tarifa);
      fila.innerHTML =
        "<td>" +
        tarifa.id +
        "</td><td>" +
        tarifa.descripcion +
        "</td><td>" +
        tarifa.especialidad +
        '</td><td class="fw-bold">' +
        formatMoney(tarifa.costo) +
        "</td><td>" +
        badgeEstado(tarifa.estado) +
        "</td><td>" +
        tarifa.actualizacion +
        "</td><td>" +
        '<button class="boton boton-sm boton-advertencia boton-icono" title="Editar">' +
        '<i class="fas fa-edit"></i></button>' +
        '<button class="boton boton-sm boton-peligro boton-icono" title="Eliminar">' +
        '<i class="fas fa-trash"></i></button>' +
        "</td>";
      cuerpo.appendChild(fila);
    });
  }

  leerIniciales();

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    var descripcion = form.descripcion.value.trim();
    var costo = parseFloat(form.costo.value);
    var especialidad = form.especialidad.value
      ? form.especialidad.options[form.especialidad.selectedIndex].text
      : "General";
    var estado = form.estatus.value === "1" ? "Activo" : "Inactivo";

    if (!descripcion) {
      showAlert("error", "Describe el servicio");
      return;
    }
    if (!costo || costo <= 0) {
      showAlert("error", "Ingresa un costo valido");
      return;
    }

    if (editando) {
      tarifas = tarifas.map(function (item) {
        if (item.id === editando) {
          item.descripcion = descripcion;
          item.costo = costo;
          item.especialidad = especialidad;
          item.estado = estado;
          item.actualizacion = new Date().toLocaleDateString();
        }
        return item;
      });
      showAlert("success", "Tarifa actualizada");
    } else {
      consecutivo += 1;
      tarifas.push({
        id: "#" + String(consecutivo).padStart(3, "0"),
        descripcion: descripcion,
        especialidad: especialidad,
        costo: costo,
        estado: estado,
        actualizacion: new Date().toLocaleDateString(),
      });
      showAlert("success", "Tarifa guardada");
    }

    renderizar();
    closeModal("modalTarifa");
    resetForm(form);
    editando = null;
  });

  cuerpo.addEventListener("click", function (evento) {
    var boton = evento.target.closest("button");
    if (!boton) return;
    var fila = boton.closest("tr");
    if (!fila) return;
    var data = getRowData(fila);
    var accion = (boton.title || "").toLowerCase();

    if (accion.indexOf("editar") !== -1) {
      editando = data.id;
      form.descripcion.value = data.descripcion;
      form.costo.value = data.costo;
      form.especialidad.value = "";
      Array.from(form.especialidad.options).forEach(function (opt) {
        if (opt.textContent === data.especialidad) {
          form.especialidad.value = opt.value;
        }
      });
      form.estatus.value = data.estado.indexOf("Activo") !== -1 ? "1" : "0";
      openModal("modalTarifa");
      return;
    }

    if (accion.indexOf("eliminar") !== -1) {
      showConfirm({ text: "Eliminar tarifa " + data.descripcion + "?" }).then(
        function (si) {
          if (!si) return;
          tarifas = tarifas.filter(function (item) {
            return item.id !== data.id;
          });
          renderizar();
          showAlert("success", "Tarifa eliminada");
        }
      );
    }
  });
}

function setupBitacora() {
  var boton = document.getElementById("botonFiltrarBitacora");
  var grafico = document.getElementById("graficoActividadModulos");
  var tabla = document.getElementById("cuerpoBitacoraTabla");
  if (boton) {
    boton.addEventListener("click", function () {
      var usuario = document.getElementById("filtroUsuario").value;
      var modulo = document.getElementById("filtroModulo").value;
      var desde = document.getElementById("fechaDesdeBitacora").value;
      var hasta = document.getElementById("fechaHastaBitacora").value;
      if (!usuario && !modulo && !desde && !hasta) {
        showAlert("warning", "Define al menos un filtro");
        return;
      }
      showAlert("success", "Filtros aplicados");
    });
  }

  if (grafico && typeof Chart !== "undefined") {
    var modulos = {};
    Array.from(tabla.querySelectorAll("tr")).forEach(function (fila) {
      var modulo = fila.children[4].textContent.trim();
      modulos[modulo] = (modulos[modulo] || 0) + 1;
    });
    var ctx = grafico.getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(modulos),
        datasets: [
          {
            label: "Movimientos",
            data: Object.values(modulos),
            backgroundColor: "rgba(79,70,229,0.6)",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0,
            },
          },
        },
      },
    });
  }

  if (tabla) {
    tabla.addEventListener("click", function (evento) {
      var boton = evento.target.closest("button");
      if (!boton) return;
      showAlert("info", "Detalle disponible para la bitacora", "Detalle");
    });
  }
}

function setupReportes() {
  var form = document.getElementById("formularioGenerarReporte");
  var tabla = document.getElementById("cuerpoReportesTabla");
  if (form) {
    form.addEventListener("submit", function (evento) {
      evento.preventDefault();
      var tipo = document.getElementById("tipoReporte").value;
      var inicio = document.getElementById("fechaInicio").value;
      var fin = document.getElementById("fechaFin").value;
      if (!tipo || !inicio || !fin) {
        showAlert("error", "Completa los datos del reporte");
        return;
      }
      if (inicio > fin) {
        showAlert("error", "La fecha fin debe ser mayor a la inicial");
        return;
      }
      showAlert("success", "Reporte generado en formato seleccionado");
    });
  }

  if (tabla) {
    tabla.addEventListener("click", function (evento) {
      var boton = evento.target.closest("button");
      if (!boton) return;
      var accion = (boton.title || "").toLowerCase();
      if (accion.indexOf("descargar") !== -1) {
        showAlert("success", "Descargando reporte");
      } else if (accion.indexOf("ver") !== -1) {
        showAlert("info", "Vista previa del reporte", "Reporte");
      } else if (accion.indexOf("eliminar") !== -1) {
        showConfirm({ text: "Eliminar reporte seleccionado?" }).then(function (
          si
        ) {
          if (!si) return;
          boton.closest("tr").remove();
          showAlert("success", "Reporte eliminado");
        });
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initSessionInfo();
  initModals();
  animateCards();
  setupAgenda();
  setupPacientes();
  setupMedicos();
  setupEspecialidades();
  setupExpedientes();
  setupPagos();
  setupTarifas();
  setupBitacora();
  setupReportes();
});
