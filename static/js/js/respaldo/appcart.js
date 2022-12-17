//Variables
const carrito = document.querySelector('#miCarrito');
const numeroProductos = document.querySelector('.barra .numero-productos');
const contenidoCarrito = document.querySelector('.contenido-carrito tbody');
const miCarrito = document.querySelector('.contenido-carrito tbody');
let productosCarrito = []; // Declaracion del arreglo para guardar los productos del cliente


cargarEventListeners();

function cargarEventListeners() {

    document.addEventListener('DOMContentLoaded', () => {
        //Sincronizar el Carrito con los productos que estsán en Local Storage
        productosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        //Pintar los Renglones con los productos
        dibujarRenglonesProductos();
        // Pintar o Dibujar el Carrito
        dibujarCarritoHTML();
        // Pintar o Dibujar el Numero de productos del Carrito
        modificaCantidadProductos();
    });

    miCarrito.addEventListener('click', eliminarProductoCarrito);
}

function eliminarProductoCarrito(e) {
    e.preventDefault();
    if (e.target.classList.contains('quitar-producto-carrito')) {
        //Necesito saber cual es el ID del producto seleccionado
        const productoEliminar = e.target.getAttribute('data-id');
        //Eliminar el producto del arreglo que coincida con el data-id
        productosCarrito = productosCarrito.filter(producto => producto.id !== productoEliminar);
        // Dibujar nuevamente el carrito parte superior derecha
        dibujarCarritoHTML();
        //Actualizar el numero de productos que hay en el carrito
        modificaCantidadProductos();
    }
    //console.log('Dentro de eliminar producto del carrito');
}

function dibujarRenglonesProductos() {
    productosCarrito.forEach(producto => {
        let img = producto.imagen;
        img = img.replace('"', '');
        img = img.replace('"', '');
        //Calcular el Subtotal
        let precio = producto.precio;
        precio = precio.replace("$", "");
        precio = precio.replace(",", "");
        let subTotal = parseFloat(precio) * parseInt(producto.cantidad);

        const codigoHTML = document.createElement(`tr`);
        codigoHTML.setAttribute('class', 'alert');
        codigoHTML.setAttribute('role', 'alert');



        codigoHTML.innerHTML = `<td>
						    	</td>
						    	<td>
						    		<div class="img" style="background-image: ${img};"></div>
						    	</td>
                                <td>
                                    <div class="email">
                                        <span>${producto.nombre}</span>
                                        <span>Fugiat voluptates quasi nemo, ipsa perferendis</span>
                                    </div>
                                </td>
						        <td>${producto.precio}</td>
						        <td class="quantity">
					        	    <div class="input-group">
				             	        <input type="text" name="quantity" class="quantity form-control input-number" value="${producto.cantidad}" min="1" max="100">
				          	        </div>
				                </td>
				                <td>${formatoMoneda(subTotal)}</td>
                                <td>
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true"><i class="fa fa-close quitar-producto-carrito" data-id="${producto.id}"></i></span>
                                    </button>
                                </td>`;
        contenidoCarrito.appendChild(codigoHTML);
    });
}


function formatoMoneda(cantidad) {
    let valor = (cantidad).toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
    });
    return valor;
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