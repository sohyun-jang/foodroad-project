from flask import Blueprint, jsonify

event_bp = Blueprint('event', __name__)

@event_bp.route('/')
def list_events():
    # 이벤트 목록 반환
    return jsonify(events=[])