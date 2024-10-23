from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.ranking_model import RankingModel

class GameController:
    
    @staticmethod
    @jwt_required()
    def guardar_puntaje():
        # Extraer el user_id del token JWT
        user_id = get_jwt_identity()

        # Extraer el puntaje de la solicitud JSON
        datos = request.get_json()
        puntaje = datos.get('puntaje')

        if not puntaje:
            return jsonify({"message": "Puntaje no proporcionado"}), 400

        try:
            # Guardar el puntaje en la base de datos
            RankingModel.guardar_puntaje(user_id, puntaje)
            return jsonify({"message": "Puntaje guardado con éxito"}), 201
        except Exception as e:
            return jsonify({"message": f"Error al guardar el puntaje: {str(e)}"}), 500
