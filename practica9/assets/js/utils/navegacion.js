// Para la navegacion y alguna que otra funcionalidad comun

// Para el toggle del menu lateral en mobile
const btnToggleMenu = document.getElementById("btnToggleMenu");
const btnCerrarLateral = document.getElementById("btnCerrarLateral");
const navegacionLateral = document.getElementById("navegacionLateral");
const overlay = document.getElementById("overlay");

if (btnToggleMenu) {
  btnToggleMenu.addEventListener("click", function () {
    navegacionLateral.classList.add("abierta");
    overlay.classList.add("activo");

    anime({
      targets: ".navegacion-lateral",
      translateX: ["-280px", "0px"],
      duration: 300,
      easing: "easeOutQuad",
    });
  });
}

if (btnCerrarLateral) {
  btnCerrarLateral.addEventListener("click", cerrarMenuLateral);
}

if (overlay) {
  overlay.addEventListener("click", cerrarMenuLateral);
}

function cerrarMenuLateral() {
  anime({
    targets: ".navegacion-lateral",
    translateX: ["0px", "-280px"],
    duration: 300,
    easing: "easeOutQuad",
    complete: function () {
      navegacionLateral.classList.remove("abierta");
      overlay.classList.remove("activo");
    },
  });
}

// Cerrar la sesion
const btnCerrarSesion = document.getElementById("btnCerrarSesion");

if (btnCerrarSesion) {
  btnCerrarSesion.addEventListener("click", function () {
    Swal.fire({
      title: "¿Cerrar la seison?",
      text: "¿Estas seguro de que deseas salir?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#00a0e3",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Limpiar la sesion
        sessionStorage.clear();

        Swal.fire({
          icon: "success",
          title: "Sesion cerrada my friend",
          text: "Ya vete bro",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "../index.html";
        });
      }
    });
  });
}

// Marcamos como activo el enlace en la navegacion
function marcarEnlaceActivo() {
  const paginaActual = window.location.pathname.split("/").pop();

  // Barra inferior de la navegacion
  document.querySelectorAll(".enlace-menu").forEach((enlace) => {
    const href = enlace.getAttribute("href");
    if (href === paginaActual) {
      enlace.classList.add("activo");
    } else {
      enlace.classList.remove("activo");
    }
  });

  // Navegacion lateral
  document.querySelectorAll(".enlace-menu-lateral").forEach((enlace) => {
    const href = enlace.getAttribute("href");
    if (href === paginaActual) {
      enlace.classList.add("activo");
    } else {
      enlace.classList.remove("activo");
    }
  });
}

marcarEnlaceActivo();
