# El archivo __init__ es constructor del módulo de categorias
from flask import Blueprint

# Definir el Blueprint
registro = Blueprint('registro', __name__, url_prefix='/registros', template_folder='templates')

# Le estamos diciendo al blueprint que tiene rutas definidas
from . import routes