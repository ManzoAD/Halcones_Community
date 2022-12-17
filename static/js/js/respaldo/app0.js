//Variables
const listaProductos = document.querySelector('#lista-productos');
const carrito = document.querySelector('#miCarrito');
const numeroProductos = document.querySelector('.barra .numero-productos');
const buscadorProductos = document.querySelector('#txtBuscador');
const selectCategoria = document.querySelector('#productosporcategoria');


let productosCarrito = []; // Declaracion del arreglo para guardar los productos del cliente


cargarEventListeners();

function cargarEventListeners() {
    listaProductos.addEventListener('click', agregarProducto);

    document.addEventListener('DOMContentLoaded', () => {
        //Sincronizar el Carrito con los productos que estsán en Local Storage
        productosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        // Pintar o Dibujar el Carrito
        dibujarCarritoHTML();
        // Pintar o Dibujar el Numero de productos del Carrito
        modificaCantidadProductos();
    });
    buscadorProductos.addEventListener('input', buscarProductos);
    selectCategoria.addEventListener('change', buscarProductosPorCategoria);
}

function buscarProductosPorCategoria(e) {
    //console.log(e.target.value);
    const url = 'regresaProductos.php';
    const data = new FormData(); //Datos de un formulario los puedo encapsular

    data.append('categoria', e.target.value);

    fetch(url, {
            method: 'POST',
            body: data
        })
        .then(respuesta => {
            if (respuesta.ok) {

                //console.log(respuesta.text());
                return respuesta.json();
            } else
                throw "ERROR: en la llamada al archivo pedidos.php";
        })
        .then(function(texto) {
            //console.log(texto);
            dibujarProductos(texto);
        });

}

function buscarProductos(e) {
    //console.log(e.target.value);
    const url = 'regresaProductos.php';
    const data = new FormData(); //Datos de un formulario los puedo encapsular

    data.append('cadena', e.target.value);

    fetch(url, {
            method: 'POST',
            body: data
        })
        .then(respuesta => {
            if (respuesta.ok) {

                //console.log(respuesta.text());
                return respuesta.json();
            } else
                throw "ERROR: en la llamada al archivo pedidos.php";
        })
        .then(function(texto) {
            //console.log(texto);
            dibujarProductos(texto);
        });
}

function dibujarProductos(productosJSON) {
    //console.log(productosJSON);
    //Limpiar el area de los productos
    listaProductos.innerHTML = ''; //Forma lenta
    /* ftco-animate */
    productosJSON.forEach(producto => {
        //Verificar si el producto esta de oferta
        mensajePrecioOferta = "";
        mensajePrecioNormal = "";
        if (producto.precioConDescuento != producto.precioNormal) {
            mensajePrecioOferta = "<span class='sale'>Oferta</span>";
            mensajePrecioNormal = "<span class='price price-sale'>$" + producto.precioNormal + "</span> ";
        }
        const codigoHTML = `<div class="col-md-4 d-flex">
    <div class="product  imagen-producto"> 
        <div id="img-producto" class="img d-flex align-items-center justify-content-center imagen-producto" style="background-image: url(img/productos/${producto.imagen});">
            <div class="desc">
                <p class="meta-prod d-flex">
                    <a href="#" class="d-flex align-items-center justify-content-center" data-id="${producto.idProducto}">
                        <span class="flaticon-shopping-bag agregar-carrito"></span>
                    </a>
                    <!-- <a href="#" class="d-flex align-items-center justify-content-center"><span class="flaticon-heart"></span></a>
                    <a href="#" class="d-flex align-items-center justify-content-center"><span class="flaticon-visibility"></span></a> -->
                </p>
            </div>
        </div>
        <div class="text text-center info-producto">
            ${mensajePrecioOferta}                                   
            <span class="category">${producto.categoria}</span>
            <h2>${producto.nombreCorto}</h2> <!-- Nombre del producto -->
            <p class="mb-0">
                ${mensajePrecioNormal}
                <span class="price precio">${producto.precioConDescuento}</span>
            </p>
        </div>
    </div>
</div>
   `;
        listaProductos.innerHTML += codigoHTML;
    });

}

function agregarProducto(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const productoSeleccionado = e.target.parentElement.parentElement.parentElement.parentElement.parentElement;
        leerDatosProducto(productoSeleccionado);
    }
}

function leerDatosProducto(producto) {
    //Crear el Objeto en JavaScript
    const infoProducto = {
            imagen: producto.children[0].style.backgroundImage,
            nombre: producto.querySelector('.info-producto h2').textContent,
            precio: producto.querySelector('.info-producto .precio').textContent,
            id: producto.querySelector('.imagen-producto a').getAttribute('Data-id'),
            cantidad: 1
        }
        //Verificar si existe el producto en arreglo
    const existe = productosCarrito.some(producto => producto.id === infoProducto.id);
    if (existe) {
        const tmpProductos = productosCarrito.map(producto => {
            if (producto.id === infoProducto.id) {
                producto.cantidad++;
                return producto;
            } else
                return producto;
        });
        productosCarrito = [...tmpProductos];
    } else {
        //Si no existe inserto el elemento
        productosCarrito = [...productosCarrito, infoProducto];
    }
    // Pintar el Numero de productos
    modificaCantidadProductos();

    dibujarCarritoHTML();
    //console.log(productosCarrito);
}

function dibujarCarritoHTML() {
    limpiarHTML();
    productosCarrito.forEach(producto => {
        let img = producto.imagen;
        img = img.replace('"', '');
        img = img.replace('"', '');
        const codigoHTML = document.createElement(`div`);
        codigoHTML.innerHTML = `<div class="dropdown-item d-flex align-items-start" href="#">
                                <div class="img" style="background-image: ${img};"></div>
                                    <div class="text pl-3">
                                        <h4>${producto.nombre}</h4>
                                        <p class="mb-0">
                                            <a href="#" class="price">${producto.precio}</a>
                                            <span class="quantity ml-3">Cantidad: ${producto.cantidad} </span>
                                        </p>
                                    </div>
                            </div>`;
        carrito.appendChild(codigoHTML);
    });
    carrito.appendChild(agregarPieCarrito());
    //Sincroniza con Local Storage
    sincronizarConStorage();
}

//Función que Sincroniza el Carrito con Local Storage
function sincronizarConStorage() {
    localStorage.setItem('carrito', JSON.stringify(productosCarrito));
}

//Función que agrega un elemento al carrito
function agregarPieCarrito() {
    const codigoSpan = document.createElement('span'); //CReatste un elemento SPAN
    codigoSpan.setAttribute('class', 'ion-ios-arrow-round-forward'); // Creaste el atributo CLASS y su VALOR

    const codigoA = document.createElement('a');
    codigoA.setAttribute('class', 'dropdown-item text-center btn-link d-block w-100');
    codigoA.setAttribute('href', 'cart.php');
    codigoA.textContent = 'Ver contenido del carrito';

    codigoA.appendChild(codigoSpan);

    return codigoA;
}

//Función para limpiar el carrito de HTML
function limpiarHTML() {
    //Forma lenta
    /*  carrito.innerHTML = ''; */
    //Forma rápida
    while (carrito.firstChild) {
        carrito.removeChild(carrito.firstChild);
    }
}

//Función 
function modificaCantidadProductos() {
    const numP = productosCarrito.length;
    numeroProductos.textContent = numP;
}

/* Hacer el pie del carrito */


/* LocalStorage */
/* 1. Cómo guardar
2. Cómo sacar
3.  */