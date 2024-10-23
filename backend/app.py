from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from settings.config import Config
from routes.profile_routes import api as profile_api
from routes.auth_routes import api as auth_api
from utils.db_config import create_connection
from routes.ranking_routes import ranking_bp


# Crear la aplicación de Flask
app = Flask(__name__)

# Configuración de la aplicación
app.config.from_object(Config)

# Habilitar CORS (Cross-Origin Resource Sharing)
CORS(app)

# Inicializar el manejador de JWT
jwt = JWTManager(app)
app.register_blueprint(profile_api, url_prefix="/")

# Registrar el Blueprint
app.register_blueprint(auth_api, url_prefix='/auth')

# Registra Blueprints
app.register_blueprint(ranking_bp, url_prefix='/api')


# Importar y registrar las rutas (blueprints)
from routes.auth_routes import api as auth_api
from routes.activity_routes import api as activity_api
from routes.game_routes import api as game_api
from routes.profile_routes import api as profile_api
from routes.results_routes import api as results_api

app.register_blueprint(auth_api, url_prefix='/api/auth')
app.register_blueprint(activity_api, url_prefix='/api/activities')
app.register_blueprint(game_api, url_prefix='/api/games')
app.register_blueprint(profile_api, url_prefix='/api/profile')
app.register_blueprint(results_api, url_prefix='/api/results')

# Función para verificar si un token ha sido revocado
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    connection = create_connection()
    try:
        with connection.cursor() as cursor:
            query = "SELECT * FROM RevokedTokens WHERE jti = %s"
            cursor.execute(query, (jti,))
            result = cursor.fetchone()
            return result is not None  # Si el token está en la base de datos, está revocado
    except Exception as e:
        print(f"Error al verificar si el token está revocado: {e}")
        return True  # Por seguridad, si hay un error, consideramos el token revocado
    finally:
        connection.close()

# Ejecutar la aplicación
if __name__ == "__main__":
    app.run(debug=True)
