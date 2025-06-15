from flask import Blueprint, request, jsonify

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    # 실제 인증 로직 필요 (DB 조회 등)
    if username == "admin" and password == "password":
        return jsonify({"message": "Login successful", "user": username}), 200
    return jsonify({"message": "Invalid credentials"}), 401

@auth_bp.route("/logout", methods=["POST"])
def logout():
    return jsonify({"message": "Logout successful"}), 200

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    # 실제 회원가입 로직 필요 (DB 저장 등)
    if username and password:
        return jsonify({"message": "Registration successful", "user": username}), 201
    return jsonify({"message": "Invalid registration data"}), 400
