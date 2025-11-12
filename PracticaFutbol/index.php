<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro Varonil de Equipo de Futbol</title>
</head>

<body>
    <h1>Arriba el Machismo</h1>
    <p>Es que el sexo femenil no se guardara</p>

    <form id="formulario" action="ejecutar.php" method="post">
        <label>Ingresa tu nombre</label>
        <input type="text" id="nombre" name="nombre" placeholder="Ingresa tu nombre" required />
        <br>
        <label>Ingresa tu apellido</label>
        <input type="text" id="apellido" name="apellido" placeholder="Ingresa tu apellido" required />
        <br>
        <label>Ingresa tu correo</label>
        <input type="email" id="correo" name="correo" placeholder="Ingresa tu correo electronico" required />
        <br>
        <label>Ingresa tu sexo</label>
        <select id="sexo" name="sexo" required>
            <option>Masculino</option>
            <option>Femenino</option>
        </select>
        <br>
        <label>Ingresa tu numero de telefono</label>
        <input type="tel" id="numeroTelefono" name="numeroTelefono" placeholder="Ingresa tu numero de telefono" required />
        <br>
        <label>Ingresa tu numero de dorsal</label>
        <input type="number" id="numeroDorsal" name="numeroDorsal" placeholder="Ingresa tu nombre de dorsal" required />
        <br>
        <label>Selecciona tu equipo</label>
        <select id="equipo" name="equipo" required>
            <option>Chivas</option>
            <option>Monterrey</option>
            <option>Toluca</option>
            <option>Tigres</option>
            <option>Correcaminos</option>
        </select>
        <br>
        <br>
        <input type="submit" placeholder="Enviar" />
    </form>
</body>

</html>