document.addEventListener("DOMContentLoaded", () => {
  let productos = [];
  let dataTable;

  const form = document.getElementById("formularioProductos");

  dataTable = new DataTable("#productosTable", {
    language: {
      url: "https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-MX.json",
    },

    responsive: true,
    pagingType: "simple_numbers",

    columns: [
      { data: "Nombre" },
      { data: "Precio" },
      { data: "Cantidad" },
      { data: "Subtotal" },
    ],
  });

  const guardarEnLocalStorage = () => {
    localStorage.setItem("productos", JSON.stringify(productos));
  };

  const cargarDesdeLocalStorage = () => {
    const productosGuardados = localStorage.getItem("productos");
    if (productosGuardados) {
      productos = JSON.parse(productosGuardados);

      dataTable.clear();
      dataTable.rows.add(productos);
      dataTable.draw();
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombreProducto").value.trim();
    const precio = parseFloat(document.getElementById("precioUnitario").value);
    const cantidad = parseInt(document.getElementById("cantidad").value);

    if (!nombre || nombre === "") {
      alert("El nombre del producto es obligatorio");
      return;
    }

    if (isNaN(precio) || precio <= 0) {
      alert("El precio debe ser un número mayor a 0");
      return;
    }

    if (isNaN(cantidad) || cantidad <= 0) {
      alert("La cantidad debe ser un número mayor a 0");
      return;
    }

    const subtotal = precio * cantidad;

    const nuevoProducto = {
      Nombre: nombre,
      Precio: `$${precio.toFixed(2)}`,
      Cantidad: cantidad,
      Subtotal: `$${subtotal.toFixed(2)}`,
    };

    productos.push(nuevoProducto);

    guardarEnLocalStorage();

    dataTable.row.add(nuevoProducto).draw();

    form.reset();
  });

  cargarDesdeLocalStorage();
});
