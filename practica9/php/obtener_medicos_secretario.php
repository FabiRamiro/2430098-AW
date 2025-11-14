<?php
// Configuramos para devolver JSON y capturar errores
error_reporting(E_ALL);
ini_set('display_errors', 0);
header('Content-Type: application/json; charset=utf-8');

try {
    // Incluimos la conexion
    require_once '../config/database.php';

    // Verificamos que lleguen datos por GET
    if ($_SERVER["REQUEST_METHOD"] != "GET") {
        throw new Exception("Metodo no permitido");
    }

    // Verificamos que la conexion existe
    if (!isset($conexion) || !$conexion) {
        throw new Exception("Error de conexion a la base de datos");
    }

    // Recibimos el ID del secretario
    $idSecretario = isset($_GET['idSecretario']) ? intval($_GET['idSecretario']) : 0;

    if ($idSecretario <= 0) {
        throw new Exception("ID de secretario no valido");
    }

    // Consulta para obtener los médicos asignados al secretario
    $sql = "SELECT 
                cm.IdMedico,
                cm.NombreCompleto,
                cm.CedulaProfesional,
                e.NombreEspecialidad,
                cm.Telefono,
                cm.CorreoElectronico,
                sm.FechaAsignacion,
                cm.Estatus
            FROM SecretariosMedicos sm
            INNER JOIN ControlMedicos cm ON sm.IdMedico = cm.IdMedico
            INNER JOIN Especialidades e ON cm.EspecialidadId = e.IdEspecialidad
            WHERE sm.IdSecretario = $idSecretario
            AND sm.Estatus = 1
            ORDER BY cm.NombreCompleto ASC";

    $resultado = mysqli_query($conexion, $sql);

    if (!$resultado) {
        throw new Exception("Error en la consulta: " . mysqli_error($conexion));
    }

    $medicos = array();

    while ($fila = mysqli_fetch_assoc($resultado)) {
        $medicos[] = array(
            'idMedico' => $fila['IdMedico'],
            'nombreCompleto' => $fila['NombreCompleto'],
            'cedulaProfesional' => $fila['CedulaProfesional'],
            'especialidad' => $fila['NombreEspecialidad'],
            'telefono' => $fila['Telefono'],
            'correoElectronico' => $fila['CorreoElectronico'],
            'fechaAsignacion' => $fila['FechaAsignacion'],
            'estatus' => $fila['Estatus'] == 1 ? 'Activo' : 'Inactivo'
        );
    }

    echo json_encode([
        "success" => true,
        "medicos" => $medicos,
        "total" => count($medicos)
    ]);
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
