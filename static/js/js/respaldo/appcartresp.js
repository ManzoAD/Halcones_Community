//Variables
const carrito = document.querySelector('#miCarrito');
const miCarrito = document.querySelector('.contenido-carrito tbody');
const productoSeleccionado = document.querySelector('.quitar-producto-carrito'); //Producto a eliminar
const numeroProductos = document.querySelector('.barra .numero-productos'); //Numero de Productos en el carrito
const totalPedido = document.querySelector('.total-compra .subtotal-carrito');
const totalDeDescuento = document.querySelector('#total-descuento');
const granTotal = document.querySelector('#gran-total');

productosCarrito = [];

cargarEventListeners();

function cargarEventListeners() {

    document.addEventListener('DOMContentLoaded', () => {
        productosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        //dibuja los renglones del carrito
        dibujaRenglonesCarritoHTML();
        //dibuja el Carrito y sus productos
        dibujarContenidoCarritoHTML();
        //Colocar el No. de Productos que hay en carrito
        modificarCantidadProductos(cuentaProductosCarrito());
    });
    miCarrito.addEventListener('click', eliminarProducto);
}

function dibujaRenglonesCarritoHTML() {
    let totalCarrito = 0;
    let totalDescuento = 0;
    productosCarrito.forEach(producto => {
        //Reemplazar las comillas en la imagen
        let img = producto.imagen;
        img = img.replace('"', '');
        img = img.replace('"', '');

        //Reemplazar el signo de pesos y la coma en el PrecioSinDescuento
        let precioSD = producto.precioSinDescuento.replace('$', '');
        precioSD = precioSD.replace(',', '');
        let subTotal = parseFloat(precioSD) * parseInt(producto.cantidad);

        //Reemplazar el signo de pesos y la coma en el PrecioSinDescuento
        let precioCD = producto.precioConDescuento.replace('$', '');
        precioCD = precioCD.replace(",", "");
        //console.log(precioCD);

        totalCarrito = totalCarrito + subTotal;
        totalDescuento = totalDescuento + (parseFloat(precioCD) * parseInt(producto.cantidad));
        //console.log(totalDescuento);

        const codigoHTML = document.createElement(`tr`);
        codigoHTML.setAttribute('class', 'alert');
        codigoHTML.setAttribute('role', 'alert');
        codigoHTML.innerHTML = `<!-- <td>
                                    <label class="checkbox-wrap checkbox-primary">
                                        <input type="checkbox" checked>
                                        <span class="checkmark"></span>
                                    </label>
                                </td> -->
                                <td>
                                    <div class="img" style="background-image: ${img};"></div>
                                </td>
                                <td>
                                    <div class="email">
                                        <span>${producto.nombre}</span>
                                        <span>Fugiat voluptates quasi nemo, ipsa perferendis</span>
                                    </div>
                                </td>
                                <td>${producto.precioSinDescuento}</td>
                                <td class="quantity">
                                    <div class="input-group">
                                        <input type="text" name="quantity" class="quantity form-control input-number" value="${producto.cantidad}" min="1" max="100">
                                    </div>
                                </td>
                                <td>$${subTotal}</td>
                                <td>
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true"><i class="fa fa-close quitar-producto-carrito" data-id="${producto.id}"></i></span>
                                    </button>
                                </td>`;
        miCarrito.appendChild(codigoHTML);
    });
    //Actualizarb el SubTotal y el totalDescuento
    totalPedido.textContent = '$' + (totalCarrito).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    totalDeDescuento.textContent = '$' + (totalDescuento).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    granTotal.textContent = '$' + (totalCarrito - totalDescuento).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

//Funcion para eliminar un producto
function eliminarProducto(e) {
    e.preventDefault();
    if (e.target.classList.contains('quitar-producto-carrito')) {
        const productoEliminar = e.target;
        console.log(productoEliminar.getAttribute('Data-id'));
    }

}

function dibujarContenidoCarritoHTML() {
    //console.log(productosCarrito);
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
                                            <a href="#" class="price">${producto.precioSinDescuento}</a>
                                            <span class="quantity ml-3">Cantidad: ${producto.cantidad} </span>
                                        </p>
                                    </div>
                            </div>`;
        carrito.appendChild(codigoHTML);
    });
    carrito.appendChild(agregarPieCarrito());
}

function agregarPieCarrito() {
    const codigoSpan = document.createElement('span'); //CReatste un elemento SPAN
    codigoSpan.setAttribute('class', 'ion-ios-arrow-round-forward'); // Creaste el atributo CLASS y su VALOR

    const codigoA = document.createElement('a');
    codigoA.setAttribute('class', 'dropdown-item text-center btn-link d-block w-100');
    codigoA.setAttribute('href', 'cart.html');
    codigoA.textContent = 'Ver contenido del carrito';

    codigoA.appendChild(codigoSpan);

    return codigoA;
}
//Funcion que pinta el numero de productos en el carrito
function modificarCantidadProductos(numP) {
    numeroProductos.textContent = numP;
}

//Funcion que cuenta el Numero de productos en el carrito
function cuentaProductosCarrito() {
    return productosCarrito.length;
}