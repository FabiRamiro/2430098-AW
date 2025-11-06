// Los usuarios que ya existen
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
    nombre: "Dr. García López",
  },
  {
    usuario: "recepcion",
    password: "rec123",
    rol: "recepcionista",
    nombre: "Ana Recepción",
  },
];

// Esperar a que todo cargue
document.addEventListener("DOMContentLoaded", function () {
  // Si ya esta logueado, redirigir al dashboard
  if (sessionStorage.getItem("usuarioActual")) {
    window.location.href = "dashboard.html";
    return;
  }

  // Animacion cuando carga la pagina
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
    .getElementById("formularioLogin")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      // Limpiar errores anteriores
      limpiarErrores();

      // Obtener los valores
      var usuario = document.getElementById("usuario").value;
      var password = document.getElementById("password").value;
      var rol = document.getElementById("rol").value;

      // Validar que no esten vacios
      var hayErrores = false;

      if (usuario === "") {
        mostrarError("errorUsuario", "El usuario es obligatorio");
        hayErrores = true;
      }

      if (password === "") {
        mostrarError("errorPassword", "La contraseña es obligatoria");
        hayErrores = true;
      }

      if (rol === "") {
        mostrarError("errorRol", "Debes seleccionar un rol");
        hayErrores = true;
      }

      if (hayErrores) {
        return;
      }

      // Buscar el usuario
      var usuarioEncontrado = null;
      for (var i = 0; i < usuariosValidos.length; i++) {
        if (usuariosValidos[i].usuario === usuario) {
          usuarioEncontrado = usuariosValidos[i];
          break;
        }
      }

      // Validar credenciales
      if (!usuarioEncontrado) {
        mostrarError("errorUsuario", "Usuario no existe");
        return;
      }

      if (usuarioEncontrado.password !== password) {
        mostrarError("errorPassword", "Contraseña incorrecta");
        return;
      }

      if (usuarioEncontrado.rol !== rol) {
        mostrarError("errorRol", "El rol no corresponde a este usuario");
        return;
      }

      // Login exitoso - guardar en sessionStorage
      sessionStorage.setItem(
        "usuarioActual",
        JSON.stringify(usuarioEncontrado)
      );

      // Animar y redirigir
      gsap.to(".tarjeta-login", {
        duration: 0.5,
        scale: 0.9,
        opacity: 0,
        ease: "power3.in",
        onComplete: function () {
          window.location.href = "dashboard.html";
        },
      });
    });

  // Validacion en tiempo real
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

// Funcion para mostrar errores
function mostrarError(idElemento, mensaje) {
  var elemento = document.getElementById(idElemento);
  elemento.textContent = mensaje;

  var input = elemento.previousElementSibling;
  if (input.classList.contains("input-con-icono")) {
    input = input.querySelector(".control-formulario");
  }
  input.classList.add("error");

  // Animar el error
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

// Funcion para limpiar errores
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
