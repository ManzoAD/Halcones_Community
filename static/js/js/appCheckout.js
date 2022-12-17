
const miCarrito = document.querySelector('#mi-carrito');
const numeroProductos = document.querySelector('.barra .numero-productos');

const subtotalOrden = document.querySelector('#subtotal-orden');
const totalEnvio = document.querySelector('#total-envio');
const totalOrden = document.querySelector('#total-orden');

const realizarPedido = document.querySelector('.realizar-pedido');

//Selectores para el metodo de pago y Terminos y condiciones
const metodoTransferencia = document.querySelector('#transferencia');
const metodoOXXO = document.querySelector('#oxxo');
const metodoPaypal = document.querySelector('#paypal');
const terminosCondiciones = document.querySelector('#terminosyCondiciones');

const nombre = document.querySelector('#nombre');
const apellidos = document.querySelector('#apellidos');
const direccion = document.querySelector('#direccion');
const ciudad = document.querySelector('#ciudad');
const codigoPostal = document.querySelector('#codigo-postal');
const telefono = document.querySelector('#telefono');
const estado = document.querySelector('#estado');
const correoElectronico = document.querySelector('#correo-electronico');


// Arreglo para guardar los productos del carrito
carritoProductos = [];

cargarEventos();

function cargarEventos(){

    realizarPedido.addEventListener('click', verificarDatos );
    document.addEventListener('DOMContentLoaded', () => {
        // Cargar los productos de localStorage
        carritoProductos = JSON.parse(localStorage.getItem('Carrito')) || [];
        // Mostrar los productos en el carrito
        dibujarCarritoHTML();
        //Actualizar el numero de productos que hay en el carrito
        modificaCantidadProductos();
        // Genera calculo y lo muestra
        generarCalculo();
    })
}



function verificarDatos(e) {
    e.preventDefault();

    let metodoPago = "";

    if (nombre.value == ''){
        alert("Debes escribir tu(s) nombre(s)");
        nombre.focus();
    }else if (apellidos.value == ''){
        alert("Debes escribir tu(s) apellido(s)");
        apellidos.focus();
    }else if (direccion.value == ''){
        alert("Debes escribir tu dirección");
        direccion.focus();
    }else if (ciudad.value == '') {
        alert("Debes escribir la ciudad");
        ciudad.focus();
    }else if( codigoPostal.value == ''){
        alert("Debes escribir el Código Postal");
        codigoPostal.focus();   
    }else if (telefono.value == ''){
        alert("Debes escribir tu teléfono");
        telefono.focus(); 
    }else if (metodoTransferencia.checked || metodoOXXO.checked || metodoPaypal.checked) {
        //Almacenar el método de pago
        if (metodoTransferencia.checked)
            metodoPago = "Transferencia";
        else if (metodoOXXO.checked)
            metodoPago = "OXXO";
        else if (metodoPaypal.checked)
            metodoPago = "Paypal";
        //Verificar que Acepte Terminos y Condiciones
        if (terminosCondiciones.checked){
        //alert("El método de pago seleccionado es: " + metodoPago);
        //Comunicarnos con el servidor PHP
            alert("Enviando datos al servidor . . . solo falta realizar la conexion");
            enviarDatos();
        }
        else
            alert("Para continuar con su pedido debe aceptar los Términos y Condiciones");
    } else
        alert("Debe seleccionar un método de pago");
    
}



//Función que establece comunicación con el servidor, utilizando AJAX, Fetch Api
function enviarDatos() {
    const url = 'http://192.168.1.74:5000/ordenes';
    const data = new FormData(); //Datos de un formulario los puedo encapsular


    data.append('nombre', nombre.value);
    data.append('apellidos', apellidos.value);
    data.append('direccion', direccion.value);
    data.append('ciudad', ciudad.value);
    data.append('codigoPostal', codigoPostal.value);
    data.append('telefono', telefono.value);
    data.append('estado', estado.value);
    data.append('correo', correoElectronico.value);
    data.append('contenidoCarrito', JSON.stringify(carritoProductos));

    fetch(url, {
            method: 'POST',
            body: data,
            headers: new Headers()
        })
        .then(respuesta => {
            if (respuesta.ok) {
                // console.log(respuesta);
                // console.log(respuesta.text());
                return respuesta.text();
            } else
                throw "ERROR: en la llamada a generar ordenes";
        })
        .then(function(texto) {
            
            let respuesta = JSON.parse(texto);
            console.log(respuesta.mensaje);
            //mostrarResultado(texto);
            //Limpiar el Carrito
            borrarContenidoCarritoHTML();
            // Crear y Agregar boton del carrito
            const btnVerContenido = crearBotonVerContenido();
            miCarrito.appendChild(btnVerContenido);
            //Limpiar el arreglo
            carritoProductos = [];
            //Limpiar de LocalStorage
            localStorage.removeItem('Carrito');
            // Pintar o Dibujar el Numero de productos del Carrito
            modificaCantidadProductos();
            //Enviar Mensaje de confirmación de la Orden
            alert(JSON.parse(texto).mensaje);
            location.href = "/?salida=1";
        });
}


function dibujarCarritoHTML(){
    // Analizar el carrito de compras en la plantilla para ver su estructura
    borrarContenidoCarritoHTML();
    // Recorre el arreglo, por cada elemento crear el div y despues colgarlo al padre DIV
    carritoProductos.forEach( p => { // cada elemento del arreglo esta en p
        //console.log(p.imagen);
        p.imagen = p.imagen.replace('"', '');
        p.imagen = p.imagen.replace('"', '');
        const divHTML = document.createElement('div'); // Crear un elemento DIV
        divHTML.innerHTML = `<div class="dropdown-item d-flex align-items-start">
                                <div class="img" style="background-image: ${p.imagen};"></div>
                                <div class="text pl-3">
                                    <h4>${p.nombre}</h4>
                                    <p class="mb-0">
                                        <a href="#" class="price">${p.precio}</a>
                                        <span class="quantity ml-3">Cantidad: ${p.cantidad}</span>
                                    </p>
                                </div>
                            </div>`;
        miCarrito.appendChild(divHTML);
    });
    // Observe que se repiten los elementos, habria que limpiar el DIV al inicio, crear la funcion
    // Como eliminamos TODO hay que crear el botón que eliminamos del carrito, para ello crear la funcion que genere y 
    // regrese el elemento <A> y dentro <SPAN>, como esta en la plantilla
    const btnVerContenido = crearBotonVerContenido();
    miCarrito.appendChild(btnVerContenido);
}

// Método para limpiar el carrito
function borrarContenidoCarritoHTML(){
    while (miCarrito.firstChild) // Mientras haya hijos eliminarlos
        miCarrito.removeChild(miCarrito.firstChild);
}

// Método para crear el btn VerContenido
function crearBotonVerContenido(){
    const elementoA = document.createElement('a');
    elementoA.setAttribute('class', 'dropdown-item text-center btn-link d-block w-100' );
    elementoA.setAttribute('href',"/carrito");
    elementoA.textContent= "Ver todos los productos";

    const elementoSPAN = document.createElement('span');
    elementoSPAN.setAttribute('class', 'ion-ios-arrow-round-forward');

    elementoA.appendChild(elementoSPAN);
    return elementoA;
}

//función que modifica el numero de producto seleccionados
function modificaCantidadProductos() {
    const numP = carritoProductos.length;
    numeroProductos.textContent = numP;
}

function generarCalculo(){
    let Total = 0;
    let envio = 0;
    carritoProductos.forEach( prod => {
        let precio = prod.precio.replace("$",'');
        precio = precio.replace(",",'');
        let subt = parseFloat(precio)  * parseInt(prod.cantidad);
        Total += subt;
    });
    if (Total < 2000 && carritoProductos.length > 0)
            envio = 360;
    // Desplegar los subtotales
    subtotalOrden.textContent = formatoMoneda(Total);
    totalEnvio.textContent = formatoMoneda(envio);
    let granTotal = Total + envio;
    totalOrden.textContent = formatoMoneda(granTotal);

}

// Funcion para dar formato a numeros
function formatoMoneda(cantidad) {
    let valor = (cantidad).toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
    });
    return valor;
}


function verificarDatosFormulario(){

    if (nombre.value == ''){
        alert("Debes escribir tu(s) nombre(s)");
        nombre.focus();
    }else if (apellidos.value == ''){
        alert("Debes escribir tu(s) apellido(s)");
        apellidos.focus();
    }else if (direccion.value == ''){
        alert("Debes escribir tu dirección");
        direccion.focus();
    }else if (ciudad.value == '') {
        alert("Debes escribir la ciudad");
        ciudad.focus();
    }else if( codigoPostal.value == ''){
        alert("Debes escribir el Código Postal");
        codigoPostal.focus();   
    }else if (telefono.value == ''){
        alert("Debes escribir tu teléfono");
        telefono.focus(); 
    }

}
