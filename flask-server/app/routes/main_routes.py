from flask import Blueprint, render_template

# Blueprint 객체 생성 (이 이름을 app.py에서 import 합니다)
main_bp = Blueprint('main', __name__)

@main_bp.route("/")
def index():
    return render_template("index.html")  # 또는 그냥 문자열 리턴

@main_bp.route('/first')
def first():
    name = "첫 페이지"
    return render_template('index.html', data=name)

@main_bp.route('/log_in')
def log_in():
    return '로그인 페이지'

@main_bp.route('/sign_in')
def sign_in():
    return '회원가입 페이지'

@main_bp.route('/main_page')
def main_page():
    return '메인페이지'

@main_bp.route('/event_map')
def event_map():
    return '행사지도 페이지'

@main_bp.route('/mypage')
def mypage():
    return '마이 페이지'