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
    $usuario = isset($_POST['usuarioEnfermero']) ? trim($_POST['usuarioEnfermero']) : '';
    $contrasena = isset($_POST['contrasenaEnfermero']) ? trim($_POST['contrasenaEnfermero']) : '';
    $rol = isset($_POST['rolEnfermero']) ? trim($_POST['rolEnfermero']) : '';

    // Validamos los campos requeridos
    if (empty($usuario) || empty($contrasena) || empty($rol)) {
        throw new Exception("Todos los campos son obligatorios");
    }

    // Validamos que el rol sea enfermera o enfermero
    if ($rol != 'Enfermera' && $rol != 'Enfermero') {
        throw new Exception("Rol no valido. Solo se permite Enfermera o Enfermero");
    }

    // Validamos que la contrasena tenga al menos 6 caracteres
    if (strlen($contrasena) < 6) {
        throw new Exception("La contrasena debe tener al menos 6 caracteres");
    }

    // Escapar datos para prevenir SQL injection
    $usuario = mysqli_real_escape_string($conexion, $usuario);
    $rol = mysqli_real_escape_string($conexion, $rol);

    // Verificamos si ya existe un usuario con ese nombre
    $sqlCheck = "SELECT IdUsuario FROM UsuariosSistema WHERE Usuario = '$usuario'";
    $resultCheck = mysqli_query($conexion, $sqlCheck);

    if (mysqli_num_rows($resultCheck) > 0) {
        throw new Exception("Ya existe un usuario registrado con ese nombre");
    }

    // Hasheamos la contrasena para mayor seguridad
    $contrasenaHash = password_hash($contrasena, PASSWORD_DEFAULT);

    // Insertamos en la base de datos
    $sql = "INSERT INTO UsuariosSistema 
            (Usuario, ContrasenaHash, Rol, Activo, FechaCreacion) 
            VALUES 
            ('$usuario', '$contrasenaHash', '$rol', 1, NOW())";

    if (mysqli_query($conexion, $sql)) {
        $enfermeroId = mysqli_insert_id($conexion);
        echo json_encode([
            "success" => true,
            "mensaje" => "Enfermero registrado exitosamente",
            "enfermeroId" => $enfermeroId
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
