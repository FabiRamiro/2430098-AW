// Control de acceso del sistema
var usuariosValidos = [
  {
    usuario: "admin",
    password: "admin123",
    rol: "admin",
    nombre: "Fabi Ramiro",
  },
  {
    usuario: "doctor",
    password: "doc123",
    rol: "medico",
    nombre: "Dr. Garcia Lopez",
  },
  {
    usuario: "recepcion",
    password: "rec123",
    rol: "recepcionista",
    nombre: "Ana Recepcion",
  },
];

document.addEventListener("DOMContentLoaded", function () {
  if (sessionStorage.getItem("usuarioActual")) {
    window.location.href = "dashboard.html";
    return;
  }

  if (typeof gsap !== "undefined") {
    gsap.fromTo(
      ".tarjeta-login",
      { y: -50, opacity: 0 },
      { duration: 0.8, y: 0, opacity: 1, ease: "power3.out" }
    );
  }

  if (typeof anime !== "undefined") {
    document.querySelectorAll(".input-con-icono").forEach(function (grupo) {
      var icono = grupo.querySelector("i");
      var input = grupo.querySelector(".control-formulario");
      if (!icono || !input) return;
      input.addEventListener("focus", function () {
        anime({
          targets: icono,
          scale: [1, 1.15, 1],
          duration: 350,
          easing: "easeOutQuad",
        });
      });
    });
  }

  var formulario = document.getElementById("formularioLogin");
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limpiarErrores();

    var usuario = document.getElementById("usuario").value.trim();
    var password = document.getElementById("password").value;
    var rol = document.getElementById("rol").value;

    var errores = [];

    if (!usuario) {
      mostrarError("errorUsuario", "El usuario es obligatorio");
      errores.push("Ingresa tu usuario");
    }

    if (!password) {
      mostrarError("errorPassword", "La contrasena es obligatoria");
      errores.push("Ingresa tu contrasena");
    }

    if (!rol) {
      mostrarError("errorRol", "Debes seleccionar un rol");
      errores.push("Selecciona un rol");
    }

    if (errores.length) {
      showAlert("error", errores[0]);
      return;
    }

    var usuarioEncontrado = usuariosValidos.find(function (item) {
      return item.usuario === usuario;
    });

    if (!usuarioEncontrado) {
      mostrarError("errorUsuario", "Usuario no existe");
      showAlert("error", "Usuario no encontrado");
      return;
    }

    if (usuarioEncontrado.password !== password) {
      mostrarError("errorPassword", "Contrasena incorrecta");
      showAlert("error", "Contrasena incorrecta");
      return;
    }

    if (usuarioEncontrado.rol !== rol) {
      mostrarError("errorRol", "El rol no corresponde a este usuario");
      showAlert("warning", "Selecciona el rol asignado");
      return;
    }

    sessionStorage.setItem("usuarioActual", JSON.stringify(usuarioEncontrado));

    var saludo = usuarioEncontrado.nombre.split(" ")[0];

    showAlert("success", "Bienvenido " + saludo).then(function () {
      if (typeof gsap !== "undefined") {
        gsap.to(".tarjeta-login", {
          duration: 0.45,
          scale: 0.9,
          opacity: 0,
          ease: "power3.in",
          onComplete: function () {
            window.location.href = "dashboard.html";
          },
        });
      } else {
        window.location.href = "dashboard.html";
      }
    });
  });

  document.getElementById("usuario").addEventListener("input", function () {
    if (this.value.length > 0) {
      this.classList.remove("error");
      this.classList.add("exito");
      document.getElementById("errorUsuario").textContent = "";
    }
  });

  document.getElementById("password").addEventListener("input", function () {
    if (this.value.length > 0) {
      this.classList.remove("error");
      this.classList.add("exito");
      document.getElementById("errorPassword").textContent = "";
    }
  });

  document.getElementById("rol").addEventListener("change", function () {
    if (this.value !== "") {
      this.classList.remove("error");
      this.classList.add("exito");
      document.getElementById("errorRol").textContent = "";
    }
  });
});

function mostrarError(idElemento, mensaje) {
  var elemento = document.getElementById(idElemento);
  elemento.textContent = mensaje;

  var input = elemento.previousElementSibling;
  if (input && input.classList.contains("input-con-icono")) {
    input = input.querySelector(".control-formulario");
  }
  if (input) {
    input.classList.add("error");
  }

  if (typeof gsap !== "undefined") {
    gsap.fromTo(
      "#" + idElemento,
      { x: -12, opacity: 0 },
      { duration: 0.3, x: 0, opacity: 1, ease: "power2.out" }
    );
  }
}

function limpiarErrores() {
  document.querySelectorAll(".error-mensaje").forEach(function (item) {
    item.textContent = "";
  });
  document.querySelectorAll(".control-formulario").forEach(function (input) {
    input.classList.remove("error");
    input.classList.remove("exito");
  });
}
