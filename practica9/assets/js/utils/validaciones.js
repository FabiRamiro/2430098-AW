// Utilidades para las validaciones
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarTelefono(telefono) {
  const regex = /^[0-9]{10}$/;
  return regex.test(telefono);
}

function validarCampoVacio(valor) {
  return valor.trim() !== "";
}

function validarCampoNumerico(valor) {
  return !isNaN(valor) && valor.trim() !== "";
}

function validarFecha(fecha) {
  const fechaObj = new Date(fecha);
  return fechaObj instanceof Date && !isNaN(fechaObj);
}

function validarFormulario(formulario) {
  const campos = formulario.querySelectorAll("[required]");
  let valido = true;
  let mensajes = [];

  campos.forEach((campo) => {
    if (!validarCampoVacio(campo.value)) {
      valido = false;
      mensajes.push(`El campo ${campo.name || campo.id} es requerido`);
      campo.classList.add("is-invalid");
    } else {
      campo.classList.remove("is-invalid");
    }
  });

  return { valido, mensajes };
}

function mostrarError(mensaje) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: mensaje,
    confirmButtonColor: "#00a0e3",
  });
}

function mostrarExito(mensaje) {
  Swal.fire({
    icon: "success",
    title: "Exito",
    text: mensaje,
    confirmButtonColor: "#00a0e3",
  });
}

function mostrarAdvertencia(mensaje) {
  Swal.fire({
    icon: "warning",
    title: "Advertencia",
    text: mensaje,
    confirmButtonColor: "#00a0e3",
  });
}

function mostrarCargando(mensaje = "Procesando bro, wait a moment") {
  Swal.fire({
    title: mensaje,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

function cerrarCargando() {
  Swal.close();
}

function confirmarAccion(titulo, texto) {
  return Swal.fire({
    title: titulo,
    text: texto,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#00a0e3",
    cancelButtonColor: "#dc3545",
    confirmButtonText: "Continuar",
    cancelButtonText: "Cancelar",
  });
}

function formatearFecha(fecha) {
  const fechaObj = new Date(fecha);
  const dia = String(fechaObj.getDate()).padStart(2, "0");
  const mes = String(fechaObj.getMonth() + 1).padStart(2, "0");
  const anio = fechaObj.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

function formatearMoneda(cantidad) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(cantidad);
}
