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
    $nombreCompleto = isset($_POST['nombreCompletoSecretario']) ? trim($_POST['nombreCompletoSecretario']) : '';
    $telefono = isset($_POST['telefonoSecretario']) ? trim($_POST['telefonoSecretario']) : '';
    $correo = isset($_POST['correoSecretario']) ? trim($_POST['correoSecretario']) : '';
    $direccion = isset($_POST['direccionSecretario']) ? trim($_POST['direccionSecretario']) : '';
    $usuario = isset($_POST['usuarioSecretario']) ? trim($_POST['usuarioSecretario']) : '';
    $contrasena = isset($_POST['contrasenaSecretario']) ? trim($_POST['contrasenaSecretario']) : '';
    $rol = isset($_POST['rolSecretario']) ? trim($_POST['rolSecretario']) : '';

    // Validamos los campos requeridos
    if (empty($nombreCompleto) || empty($usuario) || empty($contrasena) || empty($rol)) {
        throw new Exception("Los campos Nombre Completo, Usuario, Contrasena y Rol son obligatorios");
    }

    // Validamos que el rol sea Secretaria o Secretario
    if ($rol != 'Secretaria' && $rol != 'Secretario') {
        throw new Exception("Rol no valido. Solo se permite Secretaria o Secretario");
    }

    // Validamos que la contrasena tenga al menos 6 caracteres
    if (strlen($contrasena) < 6) {
        throw new Exception("La contrasena debe tener al menos 6 caracteres");
    }

    // Validamos el correo si se proporciono
    if (!empty($correo) && !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("El formato del correo electronico no es valido");
    }

    // Escapar datos para prevenir SQL injection
    $nombreCompleto = mysqli_real_escape_string($conexion, $nombreCompleto);
    $telefono = mysqli_real_escape_string($conexion, $telefono);
    $correo = mysqli_real_escape_string($conexion, $correo);
    $direccion = mysqli_real_escape_string($conexion, $direccion);
    $usuario = mysqli_real_escape_string($conexion, $usuario);
    $rol = mysqli_real_escape_string($conexion, $rol);

    // Verificamos si ya existe un usuario con ese nombre
    $sqlCheck = "SELECT IdUsuario FROM UsuariosSistema WHERE Usuario = '$usuario'";
    $resultCheck = mysqli_query($conexion, $sqlCheck);

    if (mysqli_num_rows($resultCheck) > 0) {
        throw new Exception("Ya existe un usuario registrado con ese nombre");
    }

    // Iniciamos transaccion para garantizar integridad
    mysqli_begin_transaction($conexion);

    try {
        // Hasheamos la contrasena para mayor seguridad
        $contrasenaHash = password_hash($contrasena, PASSWORD_DEFAULT);

        // Primero insertamos en UsuariosSistema
        $sqlUsuario = "INSERT INTO UsuariosSistema 
                (Usuario, ContrasenaHash, Rol, Activo, FechaCreacion) 
                VALUES 
                ('$usuario', '$contrasenaHash', '$rol', 1, NOW())";

        if (!mysqli_query($conexion, $sqlUsuario)) {
            throw new Exception("Error al crear el usuario: " . mysqli_error($conexion));
        }

        $idUsuario = mysqli_insert_id($conexion);

        // Luego insertamos en ControlSecretarios
        $sqlSecretario = "INSERT INTO ControlSecretarios 
                (NombreCompleto, Telefono, CorreoElectronico, Direccion, FechaIngreso, Estatus, IdUsuario) 
                VALUES 
                ('$nombreCompleto', '$telefono', '$correo', '$direccion', NOW(), 1, $idUsuario)";

        if (!mysqli_query($conexion, $sqlSecretario)) {
            throw new Exception("Error al registrar el secretario: " . mysqli_error($conexion));
        }

        $idSecretario = mysqli_insert_id($conexion);

        // Actualizamos el usuario con el IdSecretario
        $sqlUpdateUsuario = "UPDATE UsuariosSistema SET IdSecretario = $idSecretario WHERE IdUsuario = $idUsuario";

        if (!mysqli_query($conexion, $sqlUpdateUsuario)) {
            throw new Exception("Error al vincular usuario con secretario: " . mysqli_error($conexion));
        }

        // Asignar medicos si se seleccionaron
        $medicosAsignados = 0;
        if (isset($_POST['medicosAsignados']) && is_array($_POST['medicosAsignados'])) {
            foreach ($_POST['medicosAsignados'] as $idMedico) {
                $idMedico = intval($idMedico);
                if ($idMedico > 0) {
                    $sqlAsignar = "INSERT INTO SecretariosMedicos 
                            (IdSecretario, IdMedico, FechaAsignacion, Estatus) 
                            VALUES 
                            ($idSecretario, $idMedico, NOW(), 1)";

                    if (mysqli_query($conexion, $sqlAsignar)) {
                        $medicosAsignados++;
                    }
                }
            }
        }

        // Si todo salio bien, confirmamos la transaccion
        mysqli_commit($conexion);

        echo json_encode([
            "success" => true,
            "mensaje" => "Secretario/a registrado/a exitosamente" . ($medicosAsignados > 0 ? " con $medicosAsignados médico(s) asignado(s)" : ""),
            "secretarioId" => $idSecretario,
            "usuarioId" => $idUsuario,
            "medicosAsignados" => $medicosAsignados
        ]);
    } catch (Exception $e) {
        // Si hay error, revertimos todos los cambios
        mysqli_rollback($conexion);
        throw $e;
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
