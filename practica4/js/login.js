// Array para almacenar usuarios registrados
let usuarios = [];

// Funcion para registrar a los usuario
if (document.getElementById("registerForm")) {
  document
    .getElementById("registerForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("emailRegister").value;
      const password = document.getElementById("passwordRegister").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const errorMessage = document.getElementById("errorMessage");
      const successMessage = document.getElementById("successMessage");

      // Limpiamos los mensajes
      errorMessage.classList.add("d-none");
      successMessage.classList.add("d-none");

      // Validamos que las contraseñas coincidan
      if (password !== confirmPassword) {
        errorMessage.textContent = "Las contraseñas no coinciden";
        errorMessage.classList.remove("d-none");
        return;
      }

      // Verificamos si el usuario ya existe
      const usuarioExiste = usuarios.find((u) => u.email === email);
      if (usuarioExiste) {
        errorMessage.textContent = "El correo ya está registrado";
        errorMessage.classList.remove("d-none");
        return;
      }

      // Registramos al usuario
      usuarios.push({ email: email, password: password });

      // Guardamos en el localStorage
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      successMessage.textContent =
        "Ha sido exitoso si registro, lo redirigiremos al login...";
      successMessage.classList.remove("d-none");

      // Redirigimos despues de 2 segundos
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    });
}

// Funcion para iniciar sesion
if (document.getElementById("loginForm")) {
  // Cargamos a los usuarios del localStorage
  const usuariosGuardados = localStorage.getItem("usuarios");
  if (usuariosGuardados) {
    usuarios = JSON.parse(usuariosGuardados);
  }

  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    errorMessage.classList.add("d-none");

    // Buscamos al usuario
    const usuario = usuarios.find(
      (u) => u.email === email && u.password === password
    );

    if (usuario) {
      // Guardamos la sesion
      localStorage.setItem("usuarioActivo", email);
      // Redirigimos a la pagina de bienvenida
      window.location.href = "index.html";
    } else {
      errorMessage.textContent = "Correo o contraseña incorrectos";
      errorMessage.classList.remove("d-none");
    }
  });
}

// La pagina de bienvenida
if (document.getElementById("userEmail")) {
  const usuarioActivo = localStorage.getItem("usuarioActivo");

  if (!usuarioActivo) {
    // Si no hay sesion activa redirigimos al login
    window.location.href = "login.html";
  } else {
    // Mostramos el correo del usuario
    document.getElementById("userEmail").textContent = usuarioActivo;
  }

  // Boton para cerrar sesion
  document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "login.html";
  });
}
