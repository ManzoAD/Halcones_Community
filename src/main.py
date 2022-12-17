from src import create_app

app = create_app()

# Ruta principal
@app.route('/')
def index():
    return 'OK'

if __name__ == '__main__':
    app.run()