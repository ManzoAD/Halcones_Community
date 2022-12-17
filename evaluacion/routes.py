from flask import render_template, request
from . import Evaluacion
from src.db.conf import vars
from ..db.mongodb import PyMongo
@Evaluacion.route('/', methods=['GET', 'POST'])
def index_evaluacion():
    i=0
    dicc = request.form.to_dict()
    if request.method == 'POST':
        filtro={
            'id_evaluacion':"eva01"
        }

        campos={
            "_id":0,
            "respuestas":1,
            "Comentarios":1
        }
        print(dicc)
        obj_PyMongo = PyMongo(vars)
        obj_PyMongo.conectar_mongodb()
        evaluacion = obj_PyMongo.consulta_mongodb('evaluacion', filtro,campos)
        print(evaluacion)
        dicc.popitem()
        for respuesta in dicc:
            if dicc[respuesta]=="1":
                DatoNuevo={"$set":{f"respuestas.{str(i)}.opcion1":(evaluacion["resultado"][0]["respuestas"][i]["opcion1"]+1)}}
                obj_PyMongo.actualizar("evaluacion",filtro,DatoNuevo)
            i+=1
        i=0
        obj_PyMongo.desconectar_mongodb()
    return render_template("evaluacion/index.html")