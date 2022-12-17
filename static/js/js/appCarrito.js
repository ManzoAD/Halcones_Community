
const contenidoCarrito = document.querySelector('#contenido-carrito');
const miCarrito = document.querySelector('#mi-carrito');
const numeroProductos = document.querySelector('.numero-productos');
const quitarProductoCarrito = document.querySelector('.quitar-producto-carrito');
const subtotalOrden = document.querySelector('#subtotal-orden');
const totalEnvio = document.querySelector('#total-envio');
const totalOrden = document.querySelector('#total-orden');

const revisarProceder = document.querySelector('.revisar-proceder');

// Arreglo para guardar los productos del carrito
carritoProductos = [];


cargarEventos();


function cargarEventos(){

    document.addEventListener('DOMContentLoaded', () => {
        // Cargar los productos de localStorage
        carritoProductos = JSON.parse(localStorage.getItem('Carrito')) || [];
        // Mostrar los productos en el carrito
        dibujarRenglonesTabla();
        // Mostrar los productos en el carrito
        dibujarCarritoHTML();
        //Actualizar el numero de productos que hay en el carrito
        modificaCantidadProductos();

    });

    //revisarProceder.addEventListener('click', verificar_usuario);
}


function eliminarProductoCarrito(prod){
    //Necesito saber cual es el ID del producto seleccionado
    //const productoEliminar = e.target.getAttribute('data-id');
    //Eliminar el producto del arreglo que coincida con el data-id
    carritoProductos = carritoProductos.filter(producto => producto.id != prod);
    // Dibujar nuevamente el carrito parte superior derecha
    dibujarCarritoHTML();
    //Dibujar los renglones de la tabla
    dibujarRenglonesTabla()
    // Calcular y mostrar datos
    generarCalculo();
    //Actualizar el numero de productos que hay en el carrito
    modificaCantidadProductos();

}

function dibujarRenglonesTabla(){
    // 0. limpiamos la tabla
    while (contenidoCarrito.firstChild)
        contenidoCarrito.removeChild(contenidoCarrito.firstChild);
    //1. Por cada producto necesito un renglon con todas las celdas
    let Total = 0;
    /*   let envio = 0; */
    carritoProductos.forEach( prod => {
        let precio = prod.precio.replace("$",'');
        precio = precio.replace(",",'');
        let subt = parseFloat(precio)  * parseInt(prod.cantidad);
        Total += subt;
        
        const elementoTR = document.createElement('tr');
        elementoTR.setAttribute('class','alert');
        elementoTR.setAttribute('role','alert');

        elementoTR.innerHTML = `<td>
                                </td>
                                <td>
                                    <div class="img" style="background-image: ${prod.imagen};"></div>
                                </td>
                                <td>
                                    <div class="email">
                                        <span>${prod.nombre}</span>
                                        <span></span>
                                    </div>
                                </td>
                                <td>${prod.precio}</td>
                                <td class="quantity">
                                    <div class="input-group">
                                        <input type="text" readonly="readonly" name="quantity" class="quantity form-control input-number" value="${prod.cantidad}" min="1" max="5">
                                    </div>
                                </td>
                                <td>${formatoMoneda(subt)}</td>
                                <td>
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick="eliminarProductoCarrito(${prod.id});">
                                        <span aria-hidden="true"><i class="fa fa-close quitar-producto-carrito" data-id="${prod.id}"></i></span>
                                    </button>
                                </td>`;
        contenidoCarrito.appendChild(elementoTR);
    });
    generarCalculo();
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

    // Sicronizar con localStorage
    sincronizarLocalStorage();
}

// Método para sincronizar con LocalStorage
function sincronizarLocalStorage(){
    localStorage.setItem('Carrito', JSON.stringify(carritoProductos));
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