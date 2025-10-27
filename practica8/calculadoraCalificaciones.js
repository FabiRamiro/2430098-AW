// Obtener el contenedor donde generaremos los campos para ingresar las calificaciones
const calificacionesContenedor = document.getElementById(
  "calificacionesContenedor"
);
// Obtener el contenedor donde generaremos los campos de resultados
const resultadosDiv = document.getElementById("resultados");

// Vamos a generar dinamicamente los campos de entrada, vamos cabron
function generarCampos() {
  // Limpiamos los campos anteriores
  calificacionesContenedor.innerHTML = "";
  resultadosDiv.innerHTML = "";

  // Obtenemos el numero de materias
  const numMaterias = parseInt(document.getElementById("numMaterias").value);

  if (isNaN(numMaterias) || numMaterias <= 0) {
    alert("Ingresa un numero valido de materias que es 1 por lo menos");
    return;
  }

  // Creamos los campos para cada materias
  for (let i = 0; i < numMaterias; i++) {
    const materiaDiv = document.createElement("div");
    materiaDiv.innerHTML = `
    <h3>Materia ${i + 1}</h3>
    <label>Nombre de la Materia: </label>
    <input type="text" id="materiaNombre_${i}" value="Material ${i + 1}"><br>
    <label>Calificacion Unidad 1: </label>
    <input type="number" id="calif_${i}_0" min="0" max="100" value="80"><br>
    <label>Calificacion Unidad 2: </label>
    <input type="number" id="calif_${i}_1" min="0" max="100" value="75"><br>
    <label>Calificacion Unidad 3: </label>
    <input type="number" id="calif_${i}_2" min="0" max="100" value="90"><br>
    <label>Calificacion Unidad 4: </label>
    <input type="number" id="calif_${i}_3" min="0" max="100" value="70"><br>
    <hr>
    `;

    calificacionesContenedor.appendChild(materiaDiv);
  }
}

// Calcular los promedios
function calcularPromedios() {
  resultadosDiv.innerHTML = "";
  const numMaterias = parseInt(document.getElementById("numMaterias").value);
  let resultadosHTML = "";
  let promedioGlobalTotal = 0;
  let materiasContadas = 0;

  for (let i = 0; i < numMaterias; i++) {
    const nombreMateria =
      document.getElementById(`materiaNombre_${i}`).value || `Materia ${i + 1}`;
    let calificaciones = [];
    let sumaCalificaciones = 0;
    let minimaEsMenorA70 = false;
    let esValido = true;

    // Vamos a obtener los 4 calificaciones de la materia actual
    for (let j = 0; j < 4; j++) {
      const input = document.getElementById(`calif_${i}_${j}`);
      const calificacion = parseFloat(input.value);

      if (isNaN(calificacion) || calificacion < 0 || calificacion > 100) {
        resultadosHTML += `<p><strong>${nombreMateria}: </strong> No es valida la calificacion de la unidad ${
          j + 1
        }</p>`;
        esValido = false;
        break;
      }

      calificaciones.push(calificacion);
      sumaCalificaciones += calificacion;

      // Comprobamos la regla de la calificacion minima
      if (calificacion < 70) {
        minimaEsMenorA70 = true;
      }
    }

    // Si ocurre un error pasara a la siguiente materia
    if (!esValido) continue;

    let promedioMateria;
    let estado;

    if (minimaEsMenorA70) {
      // Si una unidad es < 70 el promedio es 60
      promedioMateria = 60;
      estado = "No aprobado";
    } else {
      // Calculamos el promedio normalmente
      promedioMateria = sumaCalificaciones / 4;
      // Redondeamos a dos decimales
      promedioMateria = Math.round(promedioMateria * 100) / 100;

      if (promedioMateria >= 70) {
        estado = "Aprobado";
      } else {
        estado = "No aprobado";
      }
    }

    // Acumulamos para el promedio global
    promedioGlobalTotal += promedioMateria;
    materiasContadas++;

    // Muestra el resultado de la materia
    resultadosHTML += `
    <h3>${nombreMateria}</h3>
    <p><strong>Promedio:</strong> ${promedioMateria}</p>
    <p><strong>Estado:</strong> ${estado}</p>
    `;
  }

  // Calcula y muestra el promedio global
  if (materiasContadas > 0) {
    const promedioGlobal = promedioGlobalTotal / materiasContadas;
    const promedioRedondeado = Math.round(promedioGlobal * 100) / 100;
    resultadosHTML += `<hr><h2>Promedio General del Alumno: ${promedioRedondeado}</h2>`;
  }

  resultadosDiv.innerHTML = resultadosHTML;
}

// Inicializa los campos
window.onload = generarCampos;
