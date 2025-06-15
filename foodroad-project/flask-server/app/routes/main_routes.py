from flask import Blueprint

main_bp = Blueprint('main', __name__)

# Add your route handlers here
@main_bp.route('/')
def index():
    return "Hello from main_bp!"