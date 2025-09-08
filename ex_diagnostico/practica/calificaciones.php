<?php
//Iniciar la sesion
session_start();

//Encargado de limpiar la sesion
if (isset($_GET['limpiar']) && $_GET['limpiar'] === 'true') {
    $_SESSION['estudiantes'] = [];
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
}

//Inicializar el array de estudiantes
if (!isset($_SESSION['estudiantes'])) {
    $_SESSION['estudiantes'] = [];
}

$num_Estudiantes = isset($_POST['num_Estudiantes']) ? intval($_POST['num_Estudiantes']) : 0;
$datos_Ingresados = isset($_POST['nombres']) && isset($_POST['calificaciones']);

if ($datos_Ingresados) {
    $nombres = $_POST['nombres'];
    $calificaciones = $_POST['calificaciones'];

    for ($i = 0; $i < count($nombres); $i++) {
        if (!empty($nombres[$i]) && is_numeric($calificaciones[$i])) {
            $_SESSION['estudiantes'][] = [
                'nombre' => trim($nombres[$i]),
                'calificacion' => floatval($calificaciones[$i])
            ];
        }
    }
}

function calcEstad($estudiantes)
{
    if (empty($estudiantes)) return null;

    $calificaciones = array_column($estudiantes, 'calificacion');
    $promedio = array_sum($calificaciones) / count($calificaciones);

    // Encontrar calificación más alta y más baja con nombres
    $maxCalif = max($calificaciones);
    $minCalif = min($calificaciones);

    $estudianteMax = '';
    $estudianteMin = '';

    foreach ($estudiantes as $estudiante) {
        if ($estudiante['calificacion'] == $maxCalif && $estudianteMax == '') {
            $estudianteMax = $estudiante['nombre'];
        }
        if ($estudiante['calificacion'] == $minCalif && $estudianteMin == '') {
            $estudianteMin = $estudiante['nombre'];
        }
    }

    // Ordenar estudiantes de mayor a menor calificación
    $estudiantesOrdenados = $estudiantes;
    usort($estudiantesOrdenados, function ($a, $b) {
        return $b['calificacion'] <=> $a['calificacion'];
    });

    return [
        'promedio' => round($promedio, 2),
        'maxCalif' => $maxCalif,
        'minCalif' => $minCalif,
        'estudianteMax' => $estudianteMax,
        'estudianteMin' => $estudianteMin,
        'estudiantesOrdenados' => $estudiantesOrdenados
    ];
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calificaciones</title>
</head>

<body>
    <h1>Calificaciones</h1>

    <?php if ($num_Estudiantes == 0 && !$datos_Ingresados): ?>
        <form method="post" id="formEstudiantes">
            <label>¿Cuantos estudiantes ingresara?</label>
            <input type="number" name="num_Estudiantes" id="numEstudiantes" min="1" max="50" required>
            <button type="submit">Continuar</button>
        </form>

    <?php elseif (!$datos_Ingresados): ?>
        <form method="post" id="formCalificaciones">
            <input type="hidden" name="num_Estudiantes" value="<?php echo $num_Estudiantes; ?>">
            <div id="estudiantes-con">
                <?php for ($i = 0; $i < $num_Estudiantes; $i++): ?>
                    <div class="form-estudiante">
                        <h3>Estudiante <?php echo $i + 1; ?></h3>
                        <label>Nombre:</label>
                        <input type="text" name="nombres[]" required>
                        <label>Calificación (0-100):</label>
                        <input type="number" name="calificaciones[]" min="0" max="100" step="0.01" required>
                    </div>
                <?php endfor; ?>
            </div>
            <button type="submit">Guardar Calificaciones</button>
            <button type="button" onclick="limpiarFormulario()">Limpiar</button>
        </form>
    <?php endif; ?>

    <h2>Resultados</h2>

    <?php if (!empty($_SESSION['estudiantes'])): ?>
        <?php $stats = calcEstad($_SESSION['estudiantes']); ?>

        <h3>Estadísticas de la Clase</h3>

        <p><strong>Promedio general de la clase:</strong> <?php echo $stats['promedio']; ?></p>

        <p><strong>Calificación más alta:</strong> <?php echo $stats['maxCalif']; ?>
            (Estudiante: <?php echo htmlspecialchars($stats['estudianteMax']); ?>)</p>

        <p><strong>Calificación más baja:</strong> <?php echo $stats['minCalif']; ?>
            (Estudiante: <?php echo htmlspecialchars($stats['estudianteMin']); ?>)</p>

        <h3>Lista de estudiantes ordenada de mayor a menor calificación:</h3>
        <div id="lista-estudiantes">
            <?php foreach ($stats['estudOrdenados'] as $estudiante): ?>
                <div class="estudiante">
                    <strong><?php echo htmlspecialchars($estudiante['nombre']); ?></strong> -
                    Calificación: <?php echo $estudiante['calificacion']; ?>
                </div>
            <?php endforeach; ?>
        </div>

        <br>
        <button onclick="limpiarTodo()">Limpiar Todo</button>

    <?php else: ?>
        <p>No hay estudiantes registrados aún.</p>
    <?php endif; ?>

    <script>
        // Se encarga de validar el formulario de numero de estudiantes a ingresar
        document.addEventListener('DOMContentLoaded', function() {
            const formNum = document.getElementById('formEstudiantes');
            if (formNum) {
                formNum.addEventListener('submit', function(e) {
                    const num = parseInt(document.getElementById('numEstudiantes').value);
                    if (num > 50) {
                        alert('Por favor ingresa un número menor a 50 estudiantes');
                        e.preventDefault();
                    }
                });
            }

            // Se encarga de validar que en el formulario de calificaciones no ocurra algun error como el nombre vacio o que la calificaciones pase los limites admitidos
            const formCalif = document.getElementById('formCalificaciones');
            if (formCalif) {
                formCalif.addEventListener('submit', function(e) {
                    const nombres = document.querySelectorAll('input[name="nombres[]"]');
                    const calificaciones = document.querySelectorAll('input[name="calificaciones[]"]');

                    let valido = true;
                    let mensaje = '';

                    for (let i = 0; i < nombres.length; i++) {
                        if (nombres[i].value.trim() === '') {
                            valido = false;
                            mensaje += `El nombre del estudiante ${i + 1} no puede estar vacío.\n`;
                        }

                        const calif = parseFloat(calificaciones[i].value);
                        if (isNaN(calif) || calif < 0 || calif > 100) {
                            valido = false;
                            mensaje += `La calificación del estudiante ${i + 1} debe estar entre 0 y 100.\n`;
                        }
                    }

                    if (!valido) {
                        alert(mensaje);
                        e.preventDefault();
                    }
                });
            }
        });

        // Funcion para poder limpiar el formulario de los estudiantes y no se empalmen
        function limpiarFormulario() {
            const nombres = document.querySelectorAll('input[name="nombres[]"]');
            const calificaciones = document.querySelectorAll('input[name="calificaciones[]"]');

            nombres.forEach(input => input.value = '');
            calificaciones.forEach(input => input.value = '');
        }

        // Función para limpiar todos los datos que hay
        function limpiarTodo() {
            if (confirm('¿Estás seguro de que quieres eliminar todos los datos?')) {
                window.location.href = '?limpiar=true';
            }
        }
    </script>
</body>

</html>