<?php
// Configuramos para devolver JSON
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

    // Consulta para obtener las especialidades
    $sql = "SELECT 
                e.IdEspecialidad,
                e.NombreEspecialidad,
                e.Descripcion,
                COUNT(DISTINCT m.IdMedico) as TotalMedicos,
                COUNT(DISTINCT p.IdPaciente) as TotalPacientes
            FROM Especialidades e
            LEFT JOIN ControlMedicos m ON e.IdEspecialidad = m.EspecialidadId AND m.Estatus = 1
            LEFT JOIN ControlAgenda a ON m.IdMedico = a.IdMedico
            LEFT JOIN ControlPacientes p ON a.IdPaciente = p.IdPaciente
            GROUP BY e.IdEspecialidad
            ORDER BY e.NombreEspecialidad ASC";

    $resultado = mysqli_query($conexion, $sql);

    if (!$resultado) {
        throw new Exception("Error al obtener especialidades: " . mysqli_error($conexion));
    }

    $especialidades = [];
    while ($fila = mysqli_fetch_assoc($resultado)) {
        $especialidades[] = [
            'id' => $fila['IdEspecialidad'],
            'nombre' => $fila['NombreEspecialidad'],
            'descripcion' => $fila['Descripcion'],
            'totalMedicos' => $fila['TotalMedicos'],
            'totalPacientes' => $fila['TotalPacientes']
        ];
    }

    echo json_encode([
        "success" => true,
        "especialidades" => $especialidades
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
