import bcrypt
from flask import render_template, request, flash, redirect, session
import requests

from . import registro
from src.db.conf import vars
from ..db.mongodb import PyMongo

HOST = 'http://127.0.0.1:5000'

# Crear los endpoints
# Ruta: http://127.0.0.1:5000/clientes
@registro.route('/', methods=['GET', 'POST'])
def registrar_usuario():
    if request.method == 'POST':
        if verificar_datos(request.form.to_dict()):
            dicc = request.form.to_dict()
            contrasena = dicc["clave"]

            insert = {
                "correo": dicc["correo"],
                "rol": dicc["rol"],
                "activo": True,
                "id_usuario": consultar_ultimo_idusuario(),
                "nombre_usuario": dicc["nombre_usuario"],
                "avatar": "foto"+dicc["nombre_usuario"].split(" ")[0]+".jpg",
                "data-asesorias":[{"id_asesoria": "", "nombre_asesoria": ""}],
                "clave": cifrar_contraseña(contrasena)
            }

            obj_PyMongo = PyMongo(vars)
            obj_PyMongo.conectar_mongodb()
            obj_PyMongo.insertar('usuarios', insert)
            obj_PyMongo.desconectar_mongodb()

    return render_template('registro/registro.html')

def verificar_datos(datos):
    for indice, valor in datos.items():
        if valor == '' or valor == None:
            return False
    return True

def cifrar_contraseña(contrasena):
    salt = bcrypt.gensalt()
    contrasena_cifrada = bcrypt.hashpw(contrasena.encode('utf-8'), salt)
    return contrasena_cifrada.decode()

def consultar_ultimo_idusuario():
    obj_PyMongo = PyMongo(vars)
    obj_PyMongo.conectar_mongodb()

    lista_usuarios = obj_PyMongo.consulta_mongodb("usuarios",{})
    obj_PyMongo.desconectar_mongodb()

    i = 0
    a = ""
    for a in lista_usuarios["resultado"]:
        if a != "":
            i = a["id_usuario"][2:]
        else:
            return "us01"
    print(i)
    i = int(i)
    if i <= 10:
        return "us0" + str((i+1))
    return "us" + str((i+1))
