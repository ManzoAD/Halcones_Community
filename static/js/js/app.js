const listaProductos = document.querySelector('#lista-productos');
const miCarrito = document.querySelector('#mi-carrito');
const numeroProductos = document.querySelector('.numero-productos');

// Arreglo para guardar los productos del carrito
carritoProductos = [];


cargarEventos();


function cargarEventos(){
    listaProductos.addEventListener('click', agregarProducto);

    document.addEventListener('DOMContentLoaded', () => {
        // Cargar los productos de localStorage
        carritoProductos = JSON.parse(localStorage.getItem('Carrito')) || [];
        // Mostrar los productos en el carrito
        dibujarCarritoHTML();
        //Actualizar el numero de productos que hay en el carrito
        modificaCantidadProductos();

    })
}

function agregarProducto(evt){
    evt.preventDefault();
    if (evt.target.classList.contains('agregar-carrito')){
        const productoSeleccionado = evt.target.parentElement.parentElement.parentElement.parentElement;
        leerDatodProductoSeleccionado(productoSeleccionado)
    }
}

// Obtener los datos del producto seleccionado
function leerDatodProductoSeleccionado(producto){
    // 1. Obtener los datos del producto
    console.log(producto);
    const infoProducto ={
        imagen: producto.children[0].style.backgroundImage, //Obtener la imagen que se encuentra en el primer hijo
        nombre: producto.querySelector('.info-producto h2').textContent, // Obtener el nombre
        precio: producto.querySelector('.info-producto .precio-producto').textContent, // Obtener el precio
        cantidad: 1, // la primera vez que cargue UN producto
        id: producto.querySelector('.mi-producto a').getAttribute('Data-id'),
    }
    //console.log(infoProducto);

    // 2. Verificar si el producto ya existe en el carrito
    const existe = carritoProductos.some( producto => producto.id === infoProducto.id);
    
    // 3. Si existe, le sumamos 1 a la cantidad. Para ello sacaremos una copia del arreglo con el Array Method map
    if(existe){
        const copiaCarrito = carritoProductos.map( producto => {
            if ( producto.id === infoProducto.id ){
                producto.cantidad++; // incrementamos la cantidad
                return producto; // regresamos el producto con la cantidad incrementada
            }else
                return producto; // solo regresamos el producto
        });
        carritoProductos = [...copiaCarrito];
    }else{
        carritoProductos = [...carritoProductos, infoProducto];  //agregamos al final el producto
    }
    console.log(carritoProductos);

    // 4. Dibujar el Carrito en HTML
    dibujarCarritoHTML();
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

    //Actualizar el numero de productos que hay en el carrito
    modificaCantidadProductos();

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