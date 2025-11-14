<?php
// Configuramos para conectarse a la base de datos
$servidor = "localhost";    // Servidor
$usuario = "admin";          // Usuario
$password = "369b17803fdbd21da0680c8c51c297bd071c8ac9b9f72974";             // Contraseña
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
