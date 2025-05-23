# app/routes/event_routes.py

from flask import Blueprint, jsonify
import pandas as pd

event_bp = Blueprint('event', __name__)

# CSV에서 불러오고 전처리 (혹은 DB에서 조회할 수도 있음)
df = pd.read_csv("flask-server/data/festival_data.csv")# 파일 경로는 실제 위치에 맞게 수정

df_filtered = (
    df[df['FSTVL_BEGIN_DE'].astype(str).str.startswith('2025')]
    .loc[:, ['FCLTY_NM', 'RDNMADR_NM', 'FSTVL_BEGIN_DE', 'FSTVL_END_DE', 'HMPG_ADDR', 'MNNST_NM', 'TEL_NO']]
    .dropna(subset=['HMPG_ADDR', 'RDNMADR_NM'])
    .sort_values(by='FSTVL_BEGIN_DE')
    .reset_index(drop=True)
)

df_filtered = df_filtered.rename(columns={
    'FCLTY_NM': '기관명',
    'RDNMADR_NM': '주소',
    'FSTVL_BEGIN_DE': '시작일',
    'FSTVL_END_DE': '종료일',
    'HMPG_ADDR': '홈페이지 주소',
    'MNNST_NM': '담당기관',
    'TEL_NO': '전화번호'
})
# CSV 파일로 저장 (필요시)
df_filtered.to_csv("flask-server/data/festival_data_filtered.csv", index=False, encoding='utf-8-sig')

@event_bp.route('/festival-data', methods=['GET'])
def get_festival_data():
    return jsonify(df_filtered.to_dict(orient='records'))