<?php
// Configuramos para devolver JSON y capturar errores
error_reporting(E_ALL);
ini_set('display_errors', 0);
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

    // Recibimos y validamos los datos
    $idSecretario = isset($_POST['idSecretario']) ? intval($_POST['idSecretario']) : 0;
    $idMedico = isset($_POST['idMedico']) ? intval($_POST['idMedico']) : 0;

    if ($idSecretario <= 0 || $idMedico <= 0) {
        throw new Exception("IDs no validos");
    }

    // Verificar que el secretario existe
    $sqlCheckSecretario = "SELECT IdSecretario FROM ControlSecretarios WHERE IdSecretario = $idSecretario";
    $resultCheck = mysqli_query($conexion, $sqlCheckSecretario);

    if (mysqli_num_rows($resultCheck) == 0) {
        throw new Exception("El secretario no existe");
    }

    // Verificar que el médico existe
    $sqlCheckMedico = "SELECT IdMedico FROM ControlMedicos WHERE IdMedico = $idMedico";
    $resultCheck = mysqli_query($conexion, $sqlCheckMedico);

    if (mysqli_num_rows($resultCheck) == 0) {
        throw new Exception("El medico no existe");
    }

    // Verificar si ya existe la asignación
    $sqlCheckAsignacion = "SELECT IdRelacion, Estatus 
                           FROM SecretariosMedicos 
                           WHERE IdSecretario = $idSecretario 
                           AND IdMedico = $idMedico";
    $resultCheck = mysqli_query($conexion, $sqlCheckAsignacion);

    if (mysqli_num_rows($resultCheck) > 0) {
        // Si existe pero está inactiva, la reactivamos
        $row = mysqli_fetch_assoc($resultCheck);
        if ($row['Estatus'] == 0) {
            $sqlUpdate = "UPDATE SecretariosMedicos 
                         SET Estatus = 1, FechaAsignacion = NOW() 
                         WHERE IdRelacion = " . $row['IdRelacion'];

            if (!mysqli_query($conexion, $sqlUpdate)) {
                throw new Exception("Error al reactivar la asignacion: " . mysqli_error($conexion));
            }

            echo json_encode([
                "success" => true,
                "mensaje" => "Medico reasignado exitosamente"
            ]);
        } else {
            throw new Exception("Este medico ya esta asignado a este secretario");
        }
    } else {
        // Insertar nueva asignación
        $sqlInsert = "INSERT INTO SecretariosMedicos 
                     (IdSecretario, IdMedico, FechaAsignacion, Estatus) 
                     VALUES 
                     ($idSecretario, $idMedico, NOW(), 1)";

        if (!mysqli_query($conexion, $sqlInsert)) {
            throw new Exception("Error al asignar medico: " . mysqli_error($conexion));
        }

        echo json_encode([
            "success" => true,
            "mensaje" => "Medico asignado exitosamente",
            "relacionId" => mysqli_insert_id($conexion)
        ]);
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
