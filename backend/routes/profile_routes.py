from flask import Blueprint, jsonify, request
from controllers.profile_controller import ProfileController

# Definir un Blueprint para las rutas del perfil
api = Blueprint('profile_api', __name__)

# Ruta para obtener el perfil del usuario
@api.route('/profile', methods=['GET'])
def get_profile():
    correo = request.args.get('correo')  # Obtener el correo desde los parámetros de la URL
    return ProfileController.get_profile_by_email(correo)

# Ruta para actualizar el perfil del usuario
@api.route('/profile', methods=['PUT'])
def update_profile():
    correo = request.args.get('correo')  # Obtener el correo desde los parámetros de la URL
    data = request.get_json()            # Obtener los datos del cuerpo de la solicitud
    return ProfileController.update_profile_by_email(correo, data)

