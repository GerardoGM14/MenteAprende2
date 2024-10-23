from flask import Blueprint, jsonify
from models.game_model import GameModel

api = Blueprint('game_api', __name__)

@api.route('/', methods=['GET'])
def get_games():
    games = GameModel.get_all_games()
    if games:
        return jsonify(games), 200
    return jsonify({"message": "No se encontraron juegos"}), 404
