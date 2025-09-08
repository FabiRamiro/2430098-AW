<?php
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'p1';
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die('Ocurrio un error al conectar a la base de datos' . $conn->connect_error);
}

$num_Estudiantes = isset($_POST['num_Estudiantes']) ? invtal($_POST['num_Estudiantes']) : 0;
