const correo = document.querySelector('#correo');
const clave = document.querySelector('#clave');
const est = document.querySelector('#rd_est')
const prof = document.querySelector('#rd_prof')

const btnIniciarUsuario = document.querySelector('#iniciar_usuario');
const miForm = document.querySelector('#loginForm');

cargarEventos();

function cargarEventos(){
    btnIniciarUsuario.addEventListener('click', validarDatos);
}

//función para Validar Nombre
function validarNombre(){
    console.log('Validando el nombre');
}

function validarDatos(evt){
    evt.preventDefault();
    //console.log(claveUno.value, claveDos.value);
    if(correo.value === ""){
        alert("El correo no puede ir vacío")
    }
    else{
        if(correo.value.includes("@") && correo.value.includes(".com")){
            if(clave.value === ""){
                alert("La contraseña no puede ir vacía")
            }
            else{
                if(!est.checked && !prof.checked){
                    alert("Debes seleccionar el tipo de usuario")
                }
                else{
                    miForm.submit();
                }
            }
        }
        else{
            alert("Inserta un correo válido")
        }
    }
}