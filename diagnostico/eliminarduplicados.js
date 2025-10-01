const numeros = document.getElementById("numeros");
const botonEnviar = document.getElementById("enviar");

// Jalamos el div donde vamos a mostrar el resultado
const resultadoDiv = document.getElementById("resultado");

botonEnviar.addEventListener("click", () => {
  // Jalamos  el texto del input y lo convertimos en un array de números
  const input = numeros.value;
  const numerosArray = input.split(",").map((num) => parseFloat(num.trim()));

  // Quitamos los duplicados usando Set
  const sinDuplicados = [...new Set(numerosArray)];

  // Mostramos el resultado en el div
  resultadoDiv.textContent = `Números sin duplicados: ${sinDuplicados.join(
    ", "
  )}`;
});
