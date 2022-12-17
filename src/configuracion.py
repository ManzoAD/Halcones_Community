class BaseConfig:
    # Base de las configuraciones
    SECRET_KEY = "ClaveSecreta"
    DEBUG = True
    TESTING = True

class DevConfig(BaseConfig):
    # Clase que deriva de la clase BaseConfig
    # Si no queremos configurar nada y heredamos lo que ya está BaseConfig
    pass

class ProdConfig(BaseConfig):
    DEBUG =  False
    TESTING = False