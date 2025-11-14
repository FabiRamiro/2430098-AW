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

    // Consulta para obtener secretarios con sus datos de usuario
    $sql = "SELECT 
                cs.IdSecretario,
                cs.NombreCompleto,
                cs.Telefono,
                cs.CorreoElectronico,
                cs.Direccion,
                cs.FechaIngreso,
                cs.Estatus,
                us.Usuario,
                us.Rol,
                us.Activo,
                us.UltimoAcceso,
                COUNT(DISTINCT sm.IdMedico) as TotalMedicos
            FROM ControlSecretarios cs
            LEFT JOIN UsuariosSistema us ON cs.IdUsuario = us.IdUsuario
            LEFT JOIN SecretariosMedicos sm ON cs.IdSecretario = sm.IdSecretario AND sm.Estatus = 1
            GROUP BY cs.IdSecretario
            ORDER BY cs.NombreCompleto ASC";

    $resultado = mysqli_query($conexion, $sql);

    if (!$resultado) {
        throw new Exception("Error en la consulta: " . mysqli_error($conexion));
    }

    $secretarios = array();

    while ($fila = mysqli_fetch_assoc($resultado)) {
        $secretarios[] = array(
            'idSecretario' => $fila['IdSecretario'],
            'nombreCompleto' => $fila['NombreCompleto'],
            'telefono' => $fila['Telefono'],
            'correoElectronico' => $fila['CorreoElectronico'],
            'direccion' => $fila['Direccion'],
            'fechaIngreso' => $fila['FechaIngreso'],
            'estatus' => $fila['Estatus'] == 1 ? 'Activo' : 'Inactivo',
            'usuario' => $fila['Usuario'],
            'rol' => $fila['Rol'],
            'activo' => $fila['Activo'],
            'ultimoAcceso' => $fila['UltimoAcceso'],
            'totalMedicos' => $fila['TotalMedicos']
        );
    }

    echo json_encode([
        "success" => true,
        "secretarios" => $secretarios,
        "total" => count($secretarios)
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
