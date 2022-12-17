from flask import render_template
from src import create_app

from src.db.mongodb import PyMongo
from src.db.conf import vars

app = create_app()

# Ruta principal
@app.route('/')
def index():
    return 'OK'

if __name__ == '__main__':
    app.run()