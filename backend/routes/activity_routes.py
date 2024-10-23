from flask import Blueprint, jsonify
from models.activity_model import ActivityModel

api = Blueprint('activity_api', __name__)

@api.route('/', methods=['GET'])
def get_activities():
    activities = ActivityModel.get_all_activities()
    if activities:
        return jsonify(activities), 200
    return jsonify({"message": "No se encontraron actividades"}), 404
