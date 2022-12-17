import bcrypt
from flask import render_template, request, flash, redirect, session
import requests

from . import login
from src.db.conf import vars
from ..db.mongodb import PyMongo

HOST = 'http://127.0.0.1:5000'

# Crear los endpoints
# Ruta: http://127.0.0.1:5000/clientes
@login.route('/', methods=['GET', 'POST'])
def verificar_usuario():
    # RUTA = '/api/clientes/registrar'
    # URL = HOST + RUTA
    # Saber cual es el método

    # print(request.form.to_dict())

    if request.method == 'POST':
        if verificar_datos(request.form.to_dict()):
            dicc = request.form.to_dict()

            print(f"sljhfvsgf{dicc}")

            # if dicc["registrar"] == "registrar":
            #     return redirect("/registros")

            obj_PyMongo = PyMongo(vars)
            obj_PyMongo.conectar_mongodb()
            lista_usuarios = obj_PyMongo.consulta_mongodb('usuarios', {})
            obj_PyMongo.desconectar_mongodb()

            for usuario in lista_usuarios["resultado"]:
                if dicc["correo"] == usuario["correo"]:
                    print("correo encontrado")
                    if verificar_contraseña(dicc["clave"], usuario["clave"]):
                        print("contraseña correcta")
                        if dicc["rol"] == usuario["rol"]:
                            print("sesión iniciada con exito")
                            return redirect(
                                "/registros")  # Cambiar esto... con esto te redirige a la página si logró iniciar sesión correctamente
                        else:
                            print("ha ocurrido un error al iniciar sesión")
                    else:
                        print("contraseña incorrecta")
                else:
                    print("correo no encontrado")

    return render_template('login/login.html')

def verificar_datos(datos):
    for indice, valor in datos.items():
        if valor == '' or valor == None:
            return False
    return True

def verificar_contraseña(contrasena, contrasena_cifrada):
    # print(contrasena)
    # print(contrasena_cifrada)
    return bcrypt.checkpw(contrasena.encode('utf-8'), contrasena_cifrada.encode('utf-8'))
