<?php
$servidor = "localhost";
$usuario = "root";
$pass = "";
$db = "yabasta";

$conexion = mysqli_connect($servidor, $usuario, $pass, $db);

if (!$conexion) {
    die("Error al conectar a la base de datos");
}

mysqli_set_charset($conexion, "utf8");
