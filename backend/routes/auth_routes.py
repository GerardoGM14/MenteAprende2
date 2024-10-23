from flask import Blueprint, request, jsonify
from controllers.auth_controller import AuthController
from flask_jwt_extended import jwt_required

api = Blueprint('auth', __name__)

@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    nombre = data.get('nombre')
    correo = data.get('correo')
    contraseña = data.get('contraseña')
    edad = data.get('edad')
    return AuthController.register(nombre, correo, contraseña, edad)

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    correo = data.get('correo')
    contraseña = data.get('contraseña')
    return AuthController.login(correo, contraseña)
# Ruta para cambiar la contraseña
@api.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    return AuthController.change_password()

    
@api.route('/logout', methods=['POST'])
@jwt_required()  # Requiere el token JWT para que el usuario pueda cerrar sesión
def logout():
    return AuthController.logout()