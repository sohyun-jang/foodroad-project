# app/__init__.py

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__, 
                static_folder="../frontend/dist",
                template_folder="templates")

    CORS(app, origins=["http://localhost:3000"])  # 정확하게 여기에 적용

    # 환경 설정
    import os
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///db.sqlite3')
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    from app.routes.main_routes import main_bp
    from app.routes.auth_routes import auth_bp
    from app.routes.event_routes import event_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(event_bp, url_prefix="/events")

    with app.app_context():
        db.create_all()

    return app

__all__ = ["create_app", "db"]
