

const nombre = document.querySelector('#nombre_usuario');
const correo = document.querySelector('#correo');
const claveUno = document.querySelector('#clave');
const claveDos = document.querySelector('#clave1');
const terminos = document.querySelector('#chk-terminos')
const est = document.querySelector('#rd_est')
const prof = document.querySelector('#rd_prof')

const btnRegistrarUsuario = document.querySelector('#registrar_usuario');
const miForm = document.querySelector('#registerForm');

cargarEventos();

function cargarEventos(){
    btnRegistrarUsuario.addEventListener('click', validarDatos);
    nombre.addEventListener('blur', validarNombre);
}

//función para Validar Nombre
function validarNombre(){
    console.log('Validando el nombre');
}

function validarDatos(evt){
    evt.preventDefault();
    //console.log(claveUno.value, claveDos.value);
    if(nombre.value === ""){
        alert("El nombre no puede ir vacio");
    }
    else{
        if (correo.value === ""){
            alert("El correo no puede ir vacio");
        }
        else{
            if(correo.value.includes("@" && correo.value.includes(".com"))){
                if (claveUno.value === claveDos.value){
                if (claveUno.value.length < 8){
                    alert("La Contraseña debe ser al menos de 8 caracteres");
                    claveUno.focus();
                }
                else{
                    if(!terminos.checked){
                        alert("Debes aceptar los términos y condiciones")
                    }
                    else{
                        if(!est.checked && !prof.checked){
                            alert("Debes seleccionar tipo de usuario")
                        }
                        else{
                            miForm.submit();
                        }
                    }
                }

            }
            else{
                alert('Las contraseñas deben ser iguales');
            }
            }
            else{
                alert("formato de correo incorrecto")
            }
        }
    }
}