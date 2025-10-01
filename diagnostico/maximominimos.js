const numeros = document.getElementById("numeros");
const botonEnviar = document.getElementById("enviar");

// Jalamos el div donde vamos a mostrar el resultado
let resultadoDiv = document.getElementById("resultado");

//Verificamos si existe el elemento en el DOM y si no es asi crea donde se mostrara el resultado
if (!resultadoDiv) {
  resultadoDiv = document.createElement("div");
  resultadoDiv.id = "resultado";
  document.body.appendChild(resultadoDiv);
}

botonEnviar.addEventListener("click", () => {
  // Jalamos el texto del input y lo convertimos en un array de números
  const ingresados = numeros.value;
  const numerosArray = ingresados
    .split(",")
    .map((num) => parseFloat(num.trim()))
    .filter((n) => !isNaN(n)); // Verificamos que sean numeros

  // Si no son numeros vamos a mostrar el mensaje
  if (numerosArray.length === 0) {
    resultadoDiv.textContent = "Ingresa al menos un número válido";
    return;
  }

  // Calculamos el máximo y mínimo
  const max = Math.max(...numerosArray);
  const min = Math.min(...numerosArray);

  // Mostramos el resultado en el div
  resultadoDiv.textContent = `Máximo: ${max}, Mínimo: ${min}`;
});
