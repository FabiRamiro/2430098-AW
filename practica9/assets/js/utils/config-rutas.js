// Configuracion centralizada de rutas de imagenes
const RUTAS_IMAGENES = {
  logoSimi: "../assets/img/logo-simi.png",
};

// Funcion para obtener la ruta del logo
function obtenerRutaLogo() {
  return RUTAS_IMAGENES.logoSimi;
}

// Exportamos para uso global
window.RUTAS_IMAGENES = RUTAS_IMAGENES;
window.obtenerRutaLogo = obtenerRutaLogo;
