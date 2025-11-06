// Lista de usuarios registrados
var usuariosRegistrados = ["admin", "doctor", "recepcion"];

// Esperar a que todo cargue
document.addEventListener("DOMContentLoaded", function () {
  // Animacion cuando carga - FIJA
  gsap.fromTo(
    ".tarjeta-login",
    {
      y: -50,
      opacity: 0,
    },
    {
      duration: 0.8,
      y: 0,
      opacity: 1,
      ease: "power3.out",
    }
  );

  // Cuando se envia el formulario
  document
    .getElementById("formularioRegistro")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      limpiarErrores();

      // Obtener valores
      var nombre = document.getElementById("nombreCompleto").value;
      var usuario = document.getElementById("usuarioRegistro").value;
      var email = document.getElementById("email").value;
      var password = document.getElementById("passwordRegistro").value;
      var confirmar = document.getElementById("confirmarPassword").value;
      var rol = document.getElementById("rolRegistro").value;

      var hayErrores = false;

      // Validar nombre
      if (nombre === "" || nombre.length < 3) {
        mostrarError(
          "errorNombre",
          "El nombre debe tener al menos 3 caracteres"
        );
        hayErrores = true;
      }

      // Validar usuario
      if (usuario === "" || usuario.length < 4) {
        mostrarError(
          "errorUsuarioReg",
          "El usuario debe tener al menos 4 caracteres"
        );
        hayErrores = true;
      } else if (usuariosRegistrados.indexOf(usuario) !== -1) {
        mostrarError("errorUsuarioReg", "Este usuario ya existe");
        hayErrores = true;
      }

      // Validar email
      if (email === "") {
        mostrarError("errorEmail", "El email es obligatorio");
        hayErrores = true;
      } else if (!validarEmail(email)) {
        mostrarError("errorEmail", "El email no es válido");
        hayErrores = true;
      }

      // Validar password
      if (password === "" || password.length < 6) {
        mostrarError(
          "errorPasswordReg",
          "La contraseña debe tener al menos 6 caracteres"
        );
        hayErrores = true;
      }

      // Validar confirmacion
      if (confirmar === "") {
        mostrarError("errorConfirmar", "Debes confirmar tu contraseña");
        hayErrores = true;
      } else if (password !== confirmar) {
        mostrarError("errorConfirmar", "Las contraseñas no coinciden");
        hayErrores = true;
      }

      // Validar rol
      if (rol === "") {
        mostrarError("errorRolReg", "Debes seleccionar un rol");
        hayErrores = true;
      }

      if (hayErrores) {
        return;
      }

      // Registro exitoso
      var mensaje = document.createElement("div");
      mensaje.className = "mensaje-exito";
      mensaje.innerHTML =
        '<i class="fas fa-check-circle me-2"></i>¡Registro exitoso! Redirigiendo al login...';

      var form = document.getElementById("formularioRegistro");
      form.parentNode.insertBefore(mensaje, form);

      // Animar mensaje
      gsap.fromTo(
        ".mensaje-exito",
        {
          y: -20,
          opacity: 0,
        },
        {
          duration: 0.5,
          y: 0,
          opacity: 1,
          ease: "power2.out",
        }
      );

      // Esperar y redirigir
      setTimeout(function () {
        window.location.href = "login.html";
      }, 2000);
    });

  // Validaciones en tiempo real
  document
    .getElementById("usuarioRegistro")
    .addEventListener("input", function () {
      if (this.value.length >= 4) {
        if (usuariosRegistrados.indexOf(this.value) === -1) {
          this.classList.remove("error");
          this.classList.add("exito");
          document.getElementById("errorUsuarioReg").textContent = "";
        }
      }
    });

  document.getElementById("email").addEventListener("input", function () {
    if (validarEmail(this.value)) {
      this.classList.remove("error");
      this.classList.add("exito");
      document.getElementById("errorEmail").textContent = "";
    }
  });

  document
    .getElementById("passwordRegistro")
    .addEventListener("input", function () {
      if (this.value.length >= 6) {
        this.classList.remove("error");
        this.classList.add("exito");
        document.getElementById("errorPasswordReg").textContent = "";
      }
    });

  document
    .getElementById("confirmarPassword")
    .addEventListener("input", function () {
      var password = document.getElementById("passwordRegistro").value;
      if (this.value === password && this.value.length > 0) {
        this.classList.remove("error");
        this.classList.add("exito");
        document.getElementById("errorConfirmar").textContent = "";
      }
    });
});

// Validar formato de email
function validarEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Mostrar error
function mostrarError(idElemento, mensaje) {
  var elemento = document.getElementById(idElemento);
  elemento.textContent = mensaje;

  var input = elemento.previousElementSibling.querySelector(
    ".control-formulario"
  );
  input.classList.add("error");

  gsap.fromTo(
    "#" + idElemento,
    {
      x: -10,
      opacity: 0,
    },
    {
      duration: 0.3,
      x: 0,
      opacity: 1,
      ease: "power2.out",
    }
  );
}

// Limpiar errores
function limpiarErrores() {
  var errores = document.querySelectorAll(".error-mensaje");
  for (var i = 0; i < errores.length; i++) {
    errores[i].textContent = "";
  }

  var inputs = document.querySelectorAll(".control-formulario");
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].classList.remove("error");
    inputs[i].classList.remove("exito");
  }
}
