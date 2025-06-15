# flask-server/app.py

from app import create_app, db
from flask_cors import CORS

app = create_app()

# CORS는 create_app 안에서 처리했으면 여기서 다시 안 해도 괜찮음.
# CORS(app)

if __name__ == "__main__":
    # db 테이블이 자동으로 안 만들어졌다면 여기에 추가 가능
    with app.app_context():
        db.create_all()
    
    app.run(debug=True, host='0.0.0.0', port=5000)
