<?php
// Configuramos para devolver JSON y capturar errores
error_reporting(E_ALL);
ini_set('display_errors', 0); // Que no muestre errores en el output
header('Content-Type: application/json; charset=utf-8');

try {
    // Incluimos la conexion
    require_once '../config/database.php';

    // Verificamos que lleguen datos por POST
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Metodo no permitido");
    }

    // Verificamos que la conexion existe
    if (!isset($conexion) || !$conexion) {
        throw new Exception("Error de conexion a la base de datos");
    }

    // Recibimos y validamos los datos del formulario
    $nombre = isset($_POST['nombreEspecialidad']) ? trim($_POST['nombreEspecialidad']) : '';
    $descripcion = isset($_POST['descripcionEspecialidad']) ? trim($_POST['descripcionEspecialidad']) : '';

    // Validamos los campos requeridos
    if (empty($nombre) || empty($descripcion)) {
        throw new Exception("Todos los campos obligatorios deben ser completados");
    }

    // Escapar datos para prevenir SQL injection
    $nombre = mysqli_real_escape_string($conexion, $nombre);
    $descripcion = mysqli_real_escape_string($conexion, $descripcion);

    // Verificamos si ya existe una especialidad con ese nombre
    $sqlCheck = "SELECT IdEspecialidad FROM Especialidades WHERE NombreEspecialidad = '$nombre'";
    $resultCheck = mysqli_query($conexion, $sqlCheck);

    if (mysqli_num_rows($resultCheck) > 0) {
        throw new Exception("Ya existe una especialidad registrada con ese nombre");
    }

    // Insertamos en la base de datos
    $sql = "INSERT INTO Especialidades 
            (NombreEspecialidad, Descripcion) 
            VALUES 
            ('$nombre', '$descripcion')";

    if (mysqli_query($conexion, $sql)) {
        $especialidadId = mysqli_insert_id($conexion);
        echo json_encode([
            "success" => true,
            "mensaje" => "Especialidad registrada exitosamente",
            "especialidadId" => $especialidadId
        ]);
    } else {
        throw new Exception("Error al registrar: " . mysqli_error($conexion));
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "mensaje" => $e->getMessage()
    ]);
} finally {
    if (isset($conexion) && $conexion) {
        mysqli_close($conexion);
    }
}
