# El archivo __init__ es constructor del módulo de categorias
from flask import Blueprint

# Definir el Blueprint
login = Blueprint('login', __name__, url_prefix='/iniciar_sesion', template_folder='templates')

# Le estamos diciendo al blueprint que tiene rutas definidas
from . import routes