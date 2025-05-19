from flask import Blueprint, request, jsonify

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    # 로그인 처리 로직
    return jsonify({"message": "로그인 성공"})