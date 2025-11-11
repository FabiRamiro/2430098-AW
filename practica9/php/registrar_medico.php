<?php
// COnfiguramos para devolver JSON y capturar errores
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
    $nombre = isset($_POST['nombreMedico']) ? trim($_POST['nombreMedico']) : '';
    $apellidos = isset($_POST['apellidosMedico']) ? trim($_POST['apellidosMedico']) : '';
    $cedula = isset($_POST['cedulaMedico']) ? trim($_POST['cedulaMedico']) : '';
    $especialidad = isset($_POST['especialidadMedico']) ? trim($_POST['especialidadMedico']) : '';
    $telefono = isset($_POST['telefonoMedico']) ? trim($_POST['telefonoMedico']) : '';
    $email = isset($_POST['emailMedico']) ? trim($_POST['emailMedico']) : '';
    $fechaIngreso = isset($_POST['fechaIngresoMedico']) ? trim($_POST['fechaIngresoMedico']) : '';
    $direccion = isset($_POST['direccionMedico']) ? trim($_POST['direccionMedico']) : '';
    $observaciones = isset($_POST['observacionesMedico']) ? trim($_POST['observacionesMedico']) : '';

    // Validamos los campos requeridos
    if (
        empty($nombre) || empty($apellidos) || empty($cedula) || empty($especialidad) ||
        empty($telefono) || empty($email) || empty($fechaIngreso)
    ) {
        throw new Exception("Todos los campos obligatorios deben ser completados");
    }

    // Escapar datos para prevenir SQL injection
    $nombre = mysqli_real_escape_string($conexion, $nombre);
    $apellidos = mysqli_real_escape_string($conexion, $apellidos);
    $cedula = mysqli_real_escape_string($conexion, $cedula);
    $especialidad = mysqli_real_escape_string($conexion, $especialidad);
    $telefono = mysqli_real_escape_string($conexion, $telefono);
    $email = mysqli_real_escape_string($conexion, $email);
    $fechaIngreso = mysqli_real_escape_string($conexion, $fechaIngreso);
    $direccion = mysqli_real_escape_string($conexion, $direccion);
    $observaciones = mysqli_real_escape_string($conexion, $observaciones);

    // Unimos nombre y apellidos
    $nombreCompleto = $nombre . " " . $apellidos;

    // Verificamos si ya existe un medico con esa cedula
    $sqlCheck = "SELECT IdMedico FROM ControlMedicos WHERE CedulaProfesional = '$cedula'";
    $resultCheck = mysqli_query($conexion, $sqlCheck);

    if (mysqli_num_rows($resultCheck) > 0) {
        throw new Exception("Ya existe un medico registrado con esa cedula profesional");
    }

    // Insertamos en la base de datos
    $sql = "INSERT INTO ControlMedicos 
            (NombreCompleto, CedulaProfesional, EspecialidadId, Telefono, 
             CorreoElectronico, FechaIngreso, Estatus) 
            VALUES 
            ('$nombreCompleto', '$cedula', '$especialidad', '$telefono', 
             '$email', '$fechaIngreso', 1)";

    if (mysqli_query($conexion, $sql)) {
        $medicoId = mysqli_insert_id($conexion);
        echo json_encode([
            "success" => true,
            "mensaje" => "Medico registrado exitosamente",
            "medicoId" => $medicoId
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
