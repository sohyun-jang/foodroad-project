from flask import Blueprint, jsonify
from app.models.festival import Festival

event_bp = Blueprint("event", __name__)

@event_bp.route("/event-recommendations", methods=["GET"])
def get_festivals():
    festivals = Festival.query.all()
    return jsonify([f.to_dict() for f in festivals])