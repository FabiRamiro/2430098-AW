<?php
// Configuramos para devolver JSON y capturar errores
error_reporting(E_ALL);
ini_set('display_errors', 0); // Que no muestre  errores en el output
header('Content-Type: application/json; charset=utf-8');

try {
    // Incluimos la conexion
    require_once '../config/database.php';

    // Verificamos que lleguen datos por POST
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Metodo no permitido");
    }

    // verificamos que la conexion existe
    if (!isset($conexion) || !$conexion) {
        throw new Exception("Error de conexion a la base de datos");
    }

    // Recibimos y validamos los datos del formulario
    $nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
    $apellidos = isset($_POST['apellidos']) ? trim($_POST['apellidos']) : '';
    $fechaNacimiento = isset($_POST['fechaNacimiento']) ? trim($_POST['fechaNacimiento']) : '';
    $genero = isset($_POST['genero']) ? trim($_POST['genero']) : '';
    $curp = isset($_POST['curp']) ? trim($_POST['curp']) : '';
    $telefono = isset($_POST['telefono']) ? trim($_POST['telefono']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $direccion = isset($_POST['direccion']) ? trim($_POST['direccion']) : '';
    $tipoSangre = isset($_POST['tipoSangre']) ? trim($_POST['tipoSangre']) : '';
    $alergias = isset($_POST['alergias']) ? trim($_POST['alergias']) : '';
    $observaciones = isset($_POST['observaciones']) ? trim($_POST['observaciones']) : '';

    // Validamos los campos requeridos
    if (
        empty($nombre) || empty($apellidos) || empty($fechaNacimiento) ||
        empty($genero) || empty($telefono) || empty($curp)
    ) {
        throw new Exception("Todos los campos obligatorios deben ser completados");
    }

    // Escapar datos para prevenir SQL injection
    $nombre = mysqli_real_escape_string($conexion, $nombre);
    $apellidos = mysqli_real_escape_string($conexion, $apellidos);
    $fechaNacimiento = mysqli_real_escape_string($conexion, $fechaNacimiento);
    $genero = mysqli_real_escape_string($conexion, $genero);
    $curp = mysqli_real_escape_string($conexion, $curp);
    $telefono = mysqli_real_escape_string($conexion, $telefono);
    $email = mysqli_real_escape_string($conexion, $email);
    $direccion = mysqli_real_escape_string($conexion, $direccion);
    $tipoSangre = mysqli_real_escape_string($conexion, $tipoSangre);
    $alergias = mysqli_real_escape_string($conexion, $alergias);
    $observaciones = mysqli_real_escape_string($conexion, $observaciones);

    // Unimos nombre y apellidos
    $nombreCompleto = $nombre . " " . $apellidos;

    // Verificamos si ya existe un paciente con ese CURP
    if (!empty($curp)) {
        $sqlCheck = "SELECT IdPaciente FROM ControlPacientes WHERE CURP = '$curp'";
        $resultCheck = mysqli_query($conexion, $sqlCheck);

        if (mysqli_num_rows($resultCheck) > 0) {
            throw new Exception("Ya existe un paciente registrado con ese CURP");
        }
    }

    // Insertamos en la base de datos
    $sql = "INSERT INTO ControlPacientes 
            (NombreCompleto, CURP, FechaNacimiento, Sexo, Telefono, 
             CorreoElectronico, Direccion, Alergias, AntecedentesMedicos, 
             FechaRegistro, Estatus) 
            VALUES 
            ('$nombreCompleto', '$curp', '$fechaNacimiento', '$genero', '$telefono', 
             '$email', '$direccion', '$alergias', '$observaciones', 
             NOW(), 1)";

    if (mysqli_query($conexion, $sql)) {
        $pacienteId = mysqli_insert_id($conexion);
        echo json_encode([
            "success" => true,
            "mensaje" => "Paciente registrado exitosamente",
            "pacienteId" => $pacienteId
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
