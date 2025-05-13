# scripts/import_festivals.py

import pandas as pd
from app import create_app, db
from app.models.festival import Festival

app = create_app()

with app.app_context():
    # CSV 읽기
    df = pd.read_csv('data/festival_data.csv')

    # 데이터 전처리
    df_filtered = (
        df[df['FSTVL_BEGIN_DE'].astype(str).str.startswith('2025')]
        .loc[:, ['FCLTY_NM', 'RDNMADR_NM', 'FSTVL_BEGIN_DE', 'FSTVL_END_DE', 'HMPG_ADDR', 'MNNST_NM', 'TEL_NO']]
        .dropna(subset=['HMPG_ADDR', 'RDNMADR_NM'])
        .sort_values(by='FSTVL_BEGIN_DE')
        .reset_index(drop=True)
    )

    # DB 초기화 (필요한 경우만)
    db.create_all()

    # DF → 모델 객체 리스트로 변환
    for _, row in df_filtered.iterrows():
        festival = Festival(
            fclty_nm=row['FCLTY_NM'],
            rdnmadr_nm=row['RDNMADR_NM'],
            fstvl_begin_de=row['FSTVL_BEGIN_DE'],
            fstvl_end_de=row['FSTVL_END_DE'],
            hmpg_addr=row['HMPG_ADDR'],
            mnnst_nm=row['MNNST_NM'],
            tel_no=row['TEL_NO']
        )
        db.session.add(festival)

    db.session.commit()
    print("🎉 데이터베이스에 성공적으로 저장되었습니다.")
