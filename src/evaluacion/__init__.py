from flask import Blueprint
Evaluacion = Blueprint('Evaluacion', __name__, url_prefix='/evaluacion', template_folder='templates') #

# Le estamos diciendo Blueprint que tiene rutas definidas
from . import  routes