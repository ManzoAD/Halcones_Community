from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    # Configura las referencias cruzadas, cuando se hacen peticiones de otros dominios
    CORS(app)

    app.config.from_object('configuracion.DevConfig')

    # Registramos los Blueprints

    from .registro import registro
    app.register_blueprint(registro)

    from .login import login
    app.register_blueprint(login)

    from .evaluacion import Evaluacion
    app.register_blueprint(Evaluacion)

    return app
