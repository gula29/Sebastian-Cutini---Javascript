const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const confirmarPedidoBtn = document.querySelector("#confirmar-carrito");
const listaProductos = document.querySelector("#lista-productos");
const contenedorProductos = document.querySelector(".contenedorProductos");
const pino = document.querySelector("#pino");
const fibro = document.querySelector("#fibro-facil");
const contadorCarrito = document.querySelector("#contadorCarrito");

let articulosCarrito = [];

cargarEventListeners();

// Realiza todos los eventos
function cargarEventListeners() {
  listaProductos.addEventListener("click", agregarProducto);
  carrito.addEventListener("click", eliminarProducto);
  carrito.addEventListener("click", cantidadbtnMas);
  carrito.addEventListener("click", cantidadbtnMenos);
  vaciarCarritoBtn.addEventListener("click", () => {
    localStorage.removeItem(`articulosCarrito`);
    articulosCarrito = [];

    limpiarHTML();
  });
  pino.addEventListener("click", () => {
    limpiarLista();
    pintarpino();
  });
  fibro.addEventListener("click", () => {
    limpiarLista();
    pintarFibro();
  });
  confirmarPedidoBtn.addEventListener("click", () => {
    comprarProductos();
  });
}

// Carga los productos de json y los pinta en el HTML
fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((producto) => {
      pintarHtml(producto);
    });
  });

//Filtra los productos en el HTMl segun su categoria

function pintarpino() {
  fetch("data.json")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((producto) => {
        if (producto.categoria === "pino") {
          pintarHtml(producto);
        }
      });
    });
}
function pintarFibro() {
  fetch("data.json")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((producto) => {
        if (producto.categoria === "fibro facil") {
          pintarHtml(producto);
        }
      });
    });
}

function pintarHtml(producto) {
  const listado = document.createElement("div");

  listado.innerHTML = `
  
  <div class="card producto" style="width: 13rem ">
  <img src=${producto.img}  class="card-img-top" alt= "">
  <div class="card-body">
  <h3 class="card-title">${producto.nombre.toUpperCase()}</h3>
  <h5 class="fabricacion">${producto.categoria.toUpperCase()}</h5>
  <h4 class="precio">$ <span>${producto.precio}</h4>
  </div>
  <a href="#" id="${
    producto.id
  }" class="btn btn-primary agregar-carrito ">Elegir<i class="fas fa-shopping-cart"></i></a>
 </div> 
 </div> `;
  listaProductos.append(listado);
}

function limpiarLista() {
  listaProductos.innerHTML = ``;
}

// Captura los datos de los productos elegidos para agregar al carrito
function agregarProducto(e) {
  e.preventDefault();

  if (e.target.classList.contains("agregar-carrito")) {
   // ventana emergente al seleccionar el producto 
    Toastify({
      text: "SE AGREGO AL CARRITO",
      duration: 3000,
      gravity: "bottom",
      position: "left",
    }).showToast();

    const productoSeleccionado = e.target.parentElement;

    leerDatosProducto(productoSeleccionado);
  }
  
}

// Elimina el producto que fue agragado al carro 

function eliminarProducto(e) {
  e.preventDefault();

  if (e.target.classList.contains("borrar-producto")) {
    const productoID = e.target.getAttribute("id");

    articulosCarrito = articulosCarrito.filter(
      (producto) => producto.id !== productoID
    );

    addLocalStorage();

    carritoHTML();
  }
}
// Recopila los datos del producto elegido para ser utilizados por el DOM

function leerDatosProducto(producto) {
  const infoProducto = {
    imagen: producto.querySelector("img").src,
    titulo: producto.querySelector(".card-title").innerText,
    precio: producto.querySelector("h4").innerText,
    valor: producto.querySelector("span").innerText,
    id: producto.querySelector("a").getAttribute("id"),
    cantidad: 1,
  };
  cantidadCarrito(infoProducto);

  addLocalStorage();

  carritoHTML();
}

// Revisa si el producto ya fue elegido , para no duplicarlo y aumentar su cantidad

function cantidadCarrito(infoProducto) {
  const existe = articulosCarrito.some(
    (producto) => producto.id === infoProducto.id
  );
  if (existe) {
    const productos = articulosCarrito.map((producto) => {
      if (producto.id === infoProducto.id) {
        producto.cantidad++;
        return producto;
      } else {
        return producto;
      }
    });

    articulosCarrito = [...productos];
  } else {
    articulosCarrito = [...articulosCarrito, infoProducto];
  }
}

// Realiza el aumento de la cantidad del producto , al apretar el + en cantidad

function cantidadbtnMas(e) {
  e.preventDefault();

  if (e.target.classList.contains("aumentar-cantidad")) {
    const productoID = e.target.getAttribute("id");

    const existe = articulosCarrito.some(
      (producto) => producto.id === productoID
    );
    if (existe) {
      const productos = articulosCarrito.map((producto) => {
        if (producto.id === productoID) {
          producto.cantidad++;

          return producto;
        } else {
          return producto;
        }
      });

      articulosCarrito = [...productos];
    } else {
      articulosCarrito = [...articulosCarrito, productoID];
    }
  }
  addLocalStorage();
  carritoHTML();
}

//Realiza la resta  de la cantidad del producto , al apretar el - en cantidad

function cantidadbtnMenos(e) {
  e.preventDefault();

  if (e.target.classList.contains("disminuir-cantidad")) {
    const productoID = e.target.getAttribute("id");

    const existe = articulosCarrito.some(
      (producto) => producto.id === productoID
    );
    if (existe) {
      const productos = articulosCarrito.map((producto) => {
        if (producto.id === productoID && producto.cantidad != 0) {
          producto.cantidad--;

          return producto;
        } else {
          return producto;
        }
      });
      articulosCarrito = [...productos];
    } else {
      articulosCarrito = [...articulosCarrito, productoID];
    }
  }
  addLocalStorage();
  carritoHTML();
}

//  pinta todos los productos seleccionados y los totales  en el contenedor del carrito 

function carritoHTML() {
 
  limpiarHTML();

  articulosCarrito.forEach((producto) => {
    const row1 = document.createElement("tr");

    row1.innerHTML = `<img src=${producto.imagen} style="width: 4rem"> 
    <td>${producto.titulo}</td>
    <td>$ <span>${producto.valor}</span></td>
    <td><span>${producto.cantidad}</span> 
    <button class="btn btn-info btn-sm aumentar-cantidad" id="${producto.id}">
    +
    </button>
    <button class="btn btn-danger btn-sm disminuir-cantidad"id="${producto.id}">
    -
    </button></td>
    <td>$<span>${producto.valor * producto.cantidad}</span></td>
    <td><a href="" class="borrar-producto" id="${producto.id}">x</a>
    </td>`;
    contenedorCarrito.appendChild(row1);
  });
  const cantidadCarrito = articulosCarrito.reduce(
    (acc, articulosCarrito) => (acc += parseFloat(articulosCarrito.cantidad)),
    0
  );
  const valorCarrito = articulosCarrito.reduce(
    (acc, articulosCarrito) =>
      (acc += parseFloat(articulosCarrito.cantidad * articulosCarrito.valor)),
    0
  );

  contadorCarrito.innerText = cantidadCarrito;

  const row2 = document.createElement("tr");

  row2.innerHTML = `<td></td>
  <td>TOTAL COMPRADO</td>
  <td> Cant: </td>
  <td>${cantidadCarrito}</td>
  <td class="total-Comprado">$<span>${valorCarrito}</span> </td>`;

  contenedorCarrito.appendChild(row2);
}

function limpiarHTML() {
  contenedorCarrito.innerHTML = "";
}

// realiza las funciones para luego ser utilizadas por sweetAlert

function totalComprado() {
  const totalCarrito = articulosCarrito.reduce(
    (acc, articulosCarrito) =>
      (acc += parseFloat(articulosCarrito.cantidad * articulosCarrito.valor)),
    0
  );

  return totalCarrito;
}
    // captura todos los datos ingresasdos en el formulario 


function obtenerNombre() {
  const nombre = document.querySelector("#nombre").value;
  return nombre;
}
function obtenerTelefono() {
  const telefono = document.querySelector("#telefono").value;
  return telefono;
}
function obtenerCorreo() {
  const correo = document.querySelector("#correo").value;
  return correo;
}
   // finaliza el pedido , mostrando un alert de los datos ingresados 


function comprarProductos() {
  const nombreAsignado = obtenerNombre().toUpperCase();
  const telefonoAsignado = obtenerTelefono();
  const correoAsignado = obtenerCorreo();
  const valorPedido = parseFloat(totalComprado());

  swal(`SR/A : ${nombreAsignado.toUpperCase()} ,
    SU PEDIDO TIENE UN VALOR TOTAL DE $ ${valorPedido};
 nos contactaremos al telefono ${telefonoAsignado}
 o al email ${correoAsignado} para coordinar el pago y el envio de su mercaderia MUCHAS GRACIAS K'ARMI`).then(
    (value) => {
      swal("GRACIAS POR SU COMPRA");
    }
  );
  limpiarHTML();
  articulosCarrito = [];
  contadorCarrito.innerText = 0
  localStorage.removeItem(`articulosCarrito`);
}

// localStorage 

function addLocalStorage() {
  localStorage.setItem("articulosCarrito", JSON.stringify(articulosCarrito));
}

window.onload = function () {
  const storage = JSON.parse(localStorage.getItem("articulosCarrito"));
  if (storage) {
    articulosCarrito = storage;
    carritoHTML();
  }
};
