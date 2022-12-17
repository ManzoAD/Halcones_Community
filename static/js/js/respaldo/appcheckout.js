//Variables
const carrito = document.querySelector('#miCarrito');
const numeroProductos = document.querySelector('.barra .numero-productos');
const contenidoCarrito = document.querySelector('.contenido-carrito tbody');
const miCarrito = document.querySelector('.contenido-carrito tbody');
const sub_Total = document.querySelector('#sub-Total');
const gastos_Envio = document.querySelector('#gastosEnvio');
const gran_Total = document.querySelector('#granTotal');
//Selectores para el metodo de pago y Terminos y condiciones
const metodoTransferencia = document.querySelector('#transferencia');
const metodoOXXO = document.querySelector('#oxxo');
const metodoPaypal = document.querySelector('#paypal');
const terminosCondiciones = document.querySelector('#terminosyCondiciones');
//Selector del boton de Generar Pedido
const botonPedido = document.querySelector('.realizarPedido');


let productosCarrito = []; // Declaracion del arreglo para guardar los productos del cliente


cargarEventListeners();

function cargarEventListeners() {
    botonPedido.addEventListener('click', verificarDatos);

    document.addEventListener('DOMContentLoaded', () => {
        //Sincronizar el Carrito con los productos que estsán en Local Storage
        productosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        // Pintar o Dibujar el Carrito
        dibujarCarritoHTML();
        // Pintar o Dibujar el Numero de productos del Carrito
        modificaCantidadProductos();
        // Pintar subtotales
        dibujaSubtotales();
    });
}

function verificarDatos(e) {
    e.preventDefault();
    let metodoPago = "";
    if (metodoTransferencia.checked || metodoOXXO.checked || metodoPaypal.checked) {
        //Almacenar el método de pago
        if (metodoTransferencia.checked)
            metodoPago = "Transferencia";
        else if (metodoOXXO.checked)
            metodoPago = "OXXO";
        else if (metodoPaypal.checked)
            metodoPago = "Paypal";
        //Verificar que Acepte Terminos y Condiciones
        if (terminosCondiciones.checked)
        //alert("El método de pago seleccionado es: " + metodoPago);
        //Comunicarnos con el servidor PHP
            enviarDatos();
        else
            alert("Para continuar con su pedido debe aceptar los Términos y Condiciones");
    } else
        alert("Debe seleccionar un método de pago");
    console.log(metodoTransferencia.checked);
}

//Funciòn que establece comunicaciòn con el servidor de PHP, utilizando AJAX, Fetch Api
function enviarDatos() {
    const url = 'generarOrden.php';
    const data = new FormData(); //Datos de un formulario los puedo encapsular

    data.append('idCliente', 1000);
    data.append('idDomicilio', 10);
    data.append('metodoPago', 5000);
    data.append('contenidoCarrito', JSON.stringify(productosCarrito)); //Contenido del Carrito

    fetch(url, {
            method: 'POST',
            body: data
        })
        .then(respuesta => {
            if (respuesta.ok) {
                // console.log(respuesta);
                // console.log(respuesta.text());
                return respuesta.text();
            } else
                throw "ERROR: en la llamada al archivo pedidos.php";
        })
        .then(function(texto) {
            //console.log(texto);
            mostrarResultado(texto);
            //Limpiar el Carrito
            limpiarHTML();
            //Limpiar el arreglo
            productosCarrito = [];
            //Limpiar de LocalStorage
            localStorage.removeItem('carrito');
            // Pintar o Dibujar el Numero de productos del Carrito
            modificaCantidadProductos();
            //Enviar Mensaje de confirmación de la Orden
            alert("Orden generada");
            location.href = "product.php";
        });
}

//Función que muestra el resultado de la pagina pedidos.php
function mostrarResultado(txt) {
    const txtResultado = document.querySelector('#mensaje');
    txtResultado.innerHTML = txt;
}

function dibujaSubtotales() {
    let subTotal = 0;
    let Total = 0;
    let envio = 0;
    productosCarrito.forEach(producto => {
        //Calcular el Subtotal
        let precio = producto.precio;
        precio = precio.replace("$", "");
        precio = precio.replace(",", "");
        subTotal = parseFloat(precio) * parseInt(producto.cantidad);
        Total = Total + subTotal;
    });
    //console.log(Total);
    //console.log(sub_Total);
    sub_Total.textContent = formatoMoneda(Total);

    //Calcular gastos de envio
    if (Total < 1000)
        envio = 200;
    //console.log(Total < 1000);
    gastos_Envio.textContent = formatoMoneda(envio);
    //Imprimir el Gran Total
    gran_Total.textContent = formatoMoneda(Total + envio);
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