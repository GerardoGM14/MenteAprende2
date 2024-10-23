from flask import Blueprint, jsonify

api = Blueprint('results_api', __name__)

@api.route('/', methods=['GET'])
def get_results():
    # Lógica para obtener los resultados del usuario
    return jsonify({"message": "Resultados del usuario"}), 200
