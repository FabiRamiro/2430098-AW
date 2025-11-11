<?php
// Configuramos para conectarse a la base de datos
$servidor = "localhost";    // Servidor
$usuario = "root";          // Usuario
$password = "";             // Contraseña
$basedatos = "db_Simi";     // Nombre de la base de datos

// Creamos la conexion
$conexion = mysqli_connect($servidor, $usuario, $password, $basedatos);

// Verificamos que sea exitosa la conexion
if (!$conexion) {
    die(json_encode([
        "success" => false,
        "mensaje" => "Error de conexión: " . mysqli_connect_error()
    ]));
}

// Configuramos el charset a UTF-8
mysqli_set_charset($conexion, "utf8");
