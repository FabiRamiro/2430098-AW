// Array para almacenar usuarios registrados
let usuarios = [];

// Cargamos los usuarios existentes
const usuariosGuardados = localStorage.getItem("usuarios");
if (usuariosGuardados) {
  usuarios = JSON.parse(usuariosGuardados);
}

// Creamos el admin por defecto si no existe
const adminExiste = usuarios.find((u) => u.correo === "admin@gmail.com");
if (!adminExiste) {
  usuarios.push({
    correo: "admin@gmail.com",
    contrasena: "123",
    esAdmin: true,
  });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// ===== REGISTRO DE USUARIOS =====
if (document.getElementById("formularioRegistro")) {
  document
    .getElementById("formularioRegistro")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const correo = document.getElementById("correoRegistro").value;
      const contrasena = document.getElementById("contrasenaRegistro").value;
      const confirmarContrasena = document.getElementById(
        "confirmarContrasena"
      ).value;
      const mensajeError = document.getElementById("mensajeError");
      const mensajeExito = document.getElementById("mensajeExito");

      // Limpiamos los mensajes
      mensajeError.classList.add("d-none");
      mensajeExito.classList.add("d-none");

      // Validamos que las contraseñas coincidan
      if (contrasena !== confirmarContrasena) {
        mensajeError.textContent = "Las contraseñas no coinciden";
        mensajeError.classList.remove("d-none");
        return;
      }

      // Verificamos si el usuario ya existe
      const usuarioExiste = usuarios.find((u) => u.correo === correo);
      if (usuarioExiste) {
        mensajeError.textContent = "El correo ya está registrado";
        mensajeError.classList.remove("d-none");
        return;
      }

      // Registramos al usuario sin permisos de admin
      usuarios.push({ correo: correo, contrasena: contrasena, esAdmin: false });

      // Guardamos en el localStorage
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      mensajeExito.textContent =
        "Ha sido exitoso su registro, lo redirigiremos al login...";
      mensajeExito.classList.remove("d-none");

      // Redirigimos después de 2 segundos
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    });
}

// ===== INICIO DE SESION =====
if (document.getElementById("formularioLogin")) {
  document
    .getElementById("formularioLogin")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const correo = document.getElementById("correo").value;
      const contrasena = document.getElementById("contrasena").value;
      const mensajeError = document.getElementById("mensajeError");

      mensajeError.classList.add("d-none");

      // Buscamos al usuario
      const usuario = usuarios.find(
        (u) => u.correo === correo && u.contrasena === contrasena
      );

      if (usuario) {
        // Guardamos la sesión
        localStorage.setItem("usuarioActivo", correo);
        // Guardamos si es admin
        localStorage.setItem("esAdmin", usuario.esAdmin ? "true" : "false");
        // Redirigimos a la página de bienvenida
        window.location.href = "index.html";
      } else {
        mensajeError.textContent = "Correo o contraseña incorrectos";
        mensajeError.classList.remove("d-none");
      }
    });
}

// ===== VERIFICACION EN LA BIENVENIDA =====
if (document.getElementById("correoUsuario")) {
  const usuarioActivo = localStorage.getItem("usuarioActivo");

  if (!usuarioActivo) {
    // Si no hay sesión activa redirigimos al login
    window.location.href = "login.html";
  } else {
    // Mostramos el correo del usuario
    document.getElementById("correoUsuario").textContent = usuarioActivo;
  }

  // Botón para cerrar sesión
  document
    .getElementById("btnCerrarSesion")
    .addEventListener("click", function () {
      localStorage.removeItem("usuarioActivo");
      localStorage.removeItem("esAdmin");
      window.location.href = "login.html";
    });
}
