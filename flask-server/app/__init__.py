#app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__, 
                static_folder="../frontend/dist",   # 프론트엔드 빌드 파일이 있다면
                template_folder="templates")

    # 예시 설정 (ENV나 .env 파일로 분리해도 좋음)
    app.config['SECRET_KEY'] = 'your-secret-key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # DB 초기화
    db.init_app(app)

    # Blueprint 등록
    from app.routes.main_routes import main_bp
    from app.routes.auth_routes import auth_bp
    from app.routes.event_routes import event_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(event_bp, url_prefix="/events")

    return app

# 이 두 개를 export해야 외부에서 `from app import create_app, db`를 쓸 수 있음
__all__ = ["create_app", "db"]
