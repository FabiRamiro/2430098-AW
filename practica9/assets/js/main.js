// Aqui estan las funciones globales y utilidadess del sistema

// Configuraciones globales
const CONFIG = {
  nombreSistema: "Clinica Lo Mismo Pero Mas Barato - Doctor Simi",
  version: "1.0.0",
  colores: {
    principal: "#00a0e3",
    secundario: "#0077be",
    exito: "#28a745",
    peligro: "#dc3545",
    advertencia: "#ffc107",
  },
};

// Pasamos a la moneda MX porque VIVA MEXICO CARAJOOO
function formatearMoneda(cantidad) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(cantidad);
}

// Formateamos la fecha
function formatearFecha(fecha, formato = "completo") {
  const fechaObj = new Date(fecha);
  const opciones = {
    completo: { year: "numeric", month: "long", day: "numeric" },
    corto: { year: "numeric", month: "2-digit", day: "2-digit" },
    hora: { hour: "2-digit", minute: "2-digit" },
  };

  return fechaObj.toLocaleDateString(
    "es-MX",
    opciones[formato] || opciones.completo
  );
}

// Calculamos la edad a partir de la fecha de nacimiento
function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
}

// Generamos un folio unico
function generarFolio(prefijo = "FOL") {
  const fecha = new Date();
  const timestamp = fecha.getTime();
  const random = Math.floor(Math.random() * 1000);
  return `${prefijo}-${timestamp}${random}`;
}

// Validamos el CURP
function validarCURP(curp) {
  const regex = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$/;
  return regex.test(curp);
}

// Descargar el archivo
function descargarArchivo(contenido, nombreArchivo, tipo = "text/plain") {
  const blob = new Blob([contenido], { type: tipo });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// DISQUE obtenemos los datos del usuario actual
function obtenerUsuarioActual() {
  return {
    usuario: sessionStorage.getItem("usuario") || "Usuario",
    rol: sessionStorage.getItem("rol") || "admin",
    nombre: sessionStorage.getItem("nombreCompleto") || "Usuario del Sistema",
  };
}

// DISQUE para registrar las acciones a la bitacora
function registrarAccion(accion, modulo, descripcion, detalles = {}) {
  const usuario = obtenerUsuarioActual();
  const registro = {
    usuario: usuario.usuario,
    accion: accion,
    modulo: modulo,
    descripcion: descripcion,
    detalles: JSON.stringify(detalles),
    fecha: new Date().toISOString(),
    ip: "cliente",
  };

  console.log("Accion registrada:", registro);
}

// Para las busquedas
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Imprimir la pagina
function imprimirPagina() {
  window.print();
}

// Toast personalizada
function mostrarToast(mensaje, tipo = "info") {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: tipo,
    title: mensaje,
  });
}

// Exportamos para uso global
window.utils = {
  formatearMoneda,
  formatearFecha,
  calcularEdad,
  generarFolio,
  validarCURP,
  copiarAlPortapapeles,
  descargarArchivo,
  obtenerUsuarioActual,
  registrarAccion,
  debounce,
  imprimirPagina,
  toggleModoOscuro,
  cargarPreferencias,
  mostrarToast,
};

// Inicializamos al cargar
document.addEventListener("DOMContentLoaded", function () {
  cargarPreferencias();
});
