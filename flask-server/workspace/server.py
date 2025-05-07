import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


def create_app():
    """
    Factory to create and configure the Flask application.
    """
    app = Flask(
        __name__,
        static_folder="../frontend/dist",   
        template_folder="templates"         
    )

    # Configuration
    app.config.from_mapping(
        SECRET_KEY="your-secret-key",
        SQLALCHEMY_DATABASE_URI="sqlite:///db.sqlite3",
        SQLALCHEMY_TRACK_MODIFICATIONS=False
    )

    # Initialize database and other extensions
    db.init_app(app)

    # Register Blueprints (modules)
    from app.routes.main_routes import main_bp
    from app.routes.auth_routes import auth_bp
    from app.routes.event_routes import event_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(event_bp, url_prefix="/events")

    return app


if __name__ == '__main__':
    # Create app and run server
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)