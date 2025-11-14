<?php
// Configuramos para devolver JSON y capturar errores
error_reporting(E_ALL);
ini_set('display_errors', 0);
header('Content-Type: application/json; charset=utf-8');

try {
    // Incluimos la conexion
    require_once '../config/database.php';

    // Verificamos que la conexion existe
    if (!isset($conexion) || !$conexion) {
        throw new Exception("Error de conexion a la base de datos");
    }

    // Consulta para obtener todos los médicos activos con su especialidad
    $sql = "SELECT 
                cm.IdMedico,
                cm.NombreCompleto,
                cm.CedulaProfesional,
                e.NombreEspecialidad,
                cm.Telefono,
                cm.CorreoElectronico,
                cm.HorarioAtencion,
                cm.Estatus
            FROM ControlMedicos cm
            INNER JOIN Especialidades e ON cm.EspecialidadId = e.IdEspecialidad
            WHERE cm.Estatus = 1
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
            'horarioAtencion' => $fila['HorarioAtencion'],
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
