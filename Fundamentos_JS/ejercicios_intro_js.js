
// ===================== Fundamentos =====================

// 1. Hola Mundo
console.log("Hola Mundo");

// 2. Variables
let nombre = "Dr. Mario";
const edad = 25;
console.log(nombre, edad);

// 3. Operaciones básicas
let a = 10, b = 3;
console.log(a + b, a - b, a * b, a / b);

// 4. Resto
console.log(10 % 3); // 1

// 5. Conversión
let numero = 42;
console.log(numero.toString());
console.log(parseInt("123"));

// 6. Prompt y saludo (activar en navegador)
// let usuario = prompt("Ingresa tu nombre:");
// console.log("Hola " + usuario);

// 7. Tipo de variable
console.log(typeof 123); // number
console.log(typeof "Hola"); // string

// 8. Operadores lógicos
console.log(true && false); // false
console.log(true || false); // true

// 9. Comparación
console.log(5 == "5");  // true
console.log(5 === "5"); // false

// 10. Condición booleana
let mayorEdad = edad >= 18;
console.log(mayorEdad);

// ===================== Condicionales =====================

// 11. Par o impar
let num = 7;
if (num % 2 === 0) console.log("Par"); else console.log("Impar");

// 12. Mayor de edad
let edad2 = 20;
if (edad2 >= 18) console.log("Mayor de edad");

// 13. Contraseña
let pass = "1234";
if (pass === "1234") console.log("Correcta");

// 14. Mayor de dos números
let x = 15, y = 9;
console.log(x > y ? x : y);

// 15. Descuento
let total = 600;
if (total > 500) total *= 0.16;
console.log(total);

// ===================== Bucles =====================

// 16. Números 1 al 10
for (let i = 1; i <= 10; i++) console.log(i);

// 17. Pares 1 al 20
let i = 1;
while (i <= 20) {
  if (i % 2 === 0) console.log(i);
  i++;
}

// 18. Suma primeros 10 números
let suma = 0;
for (let j = 1; j <= 10; j++) suma += j;
console.log(suma);

// 19. Tabla de multiplicar
let n = 5;
for (let k = 1; k <= 10; k++) console.log(`${n} x ${k} = ${n * k}`);

// 20. Factorial
let fact = 1, num2 = 5;
for (let j = 1; j <= num2; j++) fact *= j;
console.log(fact);

// ===================== Funciones =====================

// 21. Cuadrado
function cuadrado(n) { return n * n; }
console.log(cuadrado(4));

// 22. Celsius a Fahrenheit
function cToF(c) { return (c * 9/5) + 32; }
console.log(cToF(30));

// 23. Mayor de tres números
function mayor3(a, b, c) { return Math.max(a, b, c); }
console.log(mayor3(5, 9, 2));

// 24. Palíndromo
function esPalindromo(palabra) {
  let invertida = palabra.split("").reverse().join("");
  return palabra === invertida;
}
console.log(esPalindromo("mario"));

// 25. Sumar arreglo
function sumarArray(arr) {
  return arr.reduce((acc, val) => acc + val, 0);
}
console.log(sumarArray([1, 2, 3, 4]));

// ===================== Arreglos y Objetos =====================

// 26. Arreglo
let nombres = ["Ana", "Luis", "Pedro", "Marta", "Sofía"];
console.log(nombres);

// 27. Recorrer arreglo
for (let n of nombres) console.log(n);

// 28. push y pop
let nums = [1, 2, 3];
nums.push(4);
console.log(nums);
nums.pop();
console.log(nums);

// 29. includes
console.log(nums.includes(2));

// 30. Objeto
let persona = { nombre: "Dr. Mario", edad: 30, ciudad: "Cd Victoria" };
console.log(persona.nombre, persona.edad, persona.ciudad);

// ===================== Prácticos =====================

// 31. Calculadora simple
function calculadora(a, b, op) {
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") return a / b;
}
console.log(calculadora(5, 3, "+"));

// 32. Números primos hasta N
function primosHasta(n) {
  for (let i = 2; i <= n; i++) {
    let esPrimo = true;
    for (let j = 2; j < i; j++) {
      if (i % j === 0) { esPrimo = false; break; }
    }
    if (esPrimo) console.log(i);
  }
}
primosHasta(20);

// 33. Adivinar número (activar en navegador)
// let secreto = Math.floor(Math.random() * 100) + 1;
// let intento;
// do {
//   intento = parseInt(prompt("Adivina el número:"));
//   if (intento > secreto) console.log("Muy alto");
//   else if (intento < secreto) console.log("Muy bajo");
// } while (intento !== secreto);
// console.log("¡Correcto!");

// 34. Reloj digital
//setInterval(() => {
//  let hora = new Date().toLocaleTimeString();
//  console.log(hora);
//}, 1000);

// 35. Lista de tareas
let tareas = [];
function agregarTarea(t) { tareas.push(t); }
function eliminarTarea() { tareas.pop(); }
agregarTarea("Estudiar");
agregarTarea("Practicar JS");
console.log(tareas);
eliminarTarea();
console.log(tareas);
