<?php

require_once 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = mysqli_escape_string($conexion, $_POST['nombre']);
    $apellido = mysqli_escape_string($conexion, $_POST['apellido']);
    $correo = mysqli_escape_string($conexion, $_POST['correo']);
    $sexo = mysqli_escape_string($conexion, $_POST['sexo']);
    $numeroTelefono = mysqli_escape_string($conexion, $_POST['numeroTelefono']);
    $numeroDorsal = mysqli_escape_string($conexion, $_POST['numeroDorsal']);
    $equipo = mysqli_escape_string($conexion, $_POST['equipo']);

    if ($sexo == 'Femenino') {
        echo "No se permite el registro de sexo femenino. Por favor, selecciona Masculino.";
        return;
    }

    $sql = "INSERT INTO varonil (nombre, apellido, correo, sexo, numeroTelefono, numeroDorsal, nombreEquipo)
        VALUES ('$nombre', '$apellido', '$correo', '$sexo', '$numeroTelefono', '$numeroDorsal', '$equipo')";

    if (mysqli_query($conexion, $sql)) {
        echo "Registro guardado exitosamente";
    } else {
        echo "Ha ocurrido un error tio, intentalo de nuevo";
        return;
    }
}
