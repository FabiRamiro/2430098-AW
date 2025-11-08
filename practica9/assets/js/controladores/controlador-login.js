// Para las animaciones de entrada
document.addEventListener("DOMContentLoaded", function () {
  // Animamos el panel izquierdo
  anime({
    targets: ".contenido-izquierdo > *",
    translateY: [50, 0],
    opacity: [0, 1],
    delay: anime.stagger(200),
    duration: 1000,
    easing: "easeOutExpo",
  });

  // Animacion del formulario
  anime({
    targets: ".formulario-login",
    translateX: [100, 0],
    opacity: [0, 1],
    duration: 1000,
    easing: "easeOutExpo",
  });

  // Animacion de los circuloss
  anime({
    targets: ".decoracion-circulo",
    scale: [0, 1],
    opacity: [0, 1],
    delay: anime.stagger(300, { start: 500 }),
    duration: 1500,
    easing: "easeOutElastic(1, .5)",
  });
});

// Toggle para mostrar u ocultar la contraseña
const togglePassword = document.getElementById("togglePassword");
const contrasenaInput = document.getElementById("contrasena");

togglePassword.addEventListener("click", function () {
  const tipo =
    contrasenaInput.getAttribute("type") === "password" ? "text" : "password";
  contrasenaInput.setAttribute("type", tipo);

  const icono = this.querySelector("i");
  icono.classList.toggle("fa-eye");
  icono.classList.toggle("fa-eye-slash");
});

// Manejo del formulario de login
const formularioLogin = document.getElementById("formulario-login");

formularioLogin.addEventListener("submit", function (e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const contrasena = document.getElementById("contrasena").value;
  const recordarme = document.getElementById("recordarme").checked;

  // Validacion basica
  if (!usuario || !contrasena) {
    Swal.fire({
      icon: "warning",
      title: "Campos vacios",
      text: "Por favor, completa todos los campos",
      confirmButtonColor: "#00a0e3",
    });
    return;
  }

  // Mostrar loading
  Swal.fire({
    title: "Iniciando sesion",
    text: "Por favor espera",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  // Se supone que aqui iria la llamada al PHP

  setTimeout(function () {
    // Datos de ejemplo para enviar a PHP
    const datosLogin = {
      usuario: usuario,
      contrasena: contrasena,
      recordarme: recordarme,
    };

    console.log("Datos a enviar a PHP:", datosLogin);

    Swal.fire({
      icon: "success",
      title: "¡Bienvenido o bienvenida o bienvenide!",
      text: "Ingresando al sistema",
      timer: 1500,
      showConfirmButton: false,
      confirmButtonColor: "#00a0e3",
    }).then(() => {
      // Guardamos los datos de sesion
      sessionStorage.setItem("usuario", usuario);
      sessionStorage.setItem("sesionActiva", "true");

      // Redireccionamos al dashboard
      window.location.href = "vistas/dashboard.html";
    });
  }, 1500);
});

// Efectos de foco en los inputs
const inputs = document.querySelectorAll(".input-personalizado");

inputs.forEach((input) => {
  input.addEventListener("focus", function () {
    anime({
      targets: this,
      scale: [1, 1.02],
      duration: 300,
      easing: "easeOutQuad",
    });
  });

  input.addEventListener("blur", function () {
    anime({
      targets: this,
      scale: [1.02, 1],
      duration: 300,
      easing: "easeOutQuad",
    });
  });
});

// Efecto hover en el boton de ingresar
const btnIngresar = document.querySelector(".btn-principal");

btnIngresar.addEventListener("mouseenter", function () {
  anime({
    targets: this,
    scale: 1.05,
    duration: 300,
    easing: "easeOutQuad",
  });
});

btnIngresar.addEventListener("mouseleave", function () {
  anime({
    targets: this,
    scale: 1,
    duration: 300,
    easing: "easeOutQuad",
  });
});
