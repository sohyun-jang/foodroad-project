#open_festival.py

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pandas as pd
from app import create_app, db
from app.models.festival import Festival

app = create_app()

with app.app_context():
    # 데이터 폴더에 있는 CSV를 절대 경로로 읽기
    csv_path = os.path.join(os.path.dirname(__file__), "..", "data", "festival_data.csv")
    df = pd.read_csv(csv_path)

    # 2025년에 시작하는 축제만 필터링(예시)
    df_filtered = (
        df[df['FSTVL_BEGIN_DE'].astype(str).str.startswith('2025')]
          .loc[:, ['FCLTY_NM','RDNMADR_NM','FSTVL_BEGIN_DE','FSTVL_END_DE','HMPG_ADDR','MNNST_NM','TEL_NO']]
          .dropna(subset=['HMPG_ADDR','RDNMADR_NM'])
          .sort_values(by='FSTVL_BEGIN_DE')
          .reset_index(drop=True)
    )

    # DB 테이블 생성 (없으면 생성)
    db.create_all()

    # DataFrame → DB 레코드로 변환 후 저장
    for _, row in df_filtered.iterrows():
        fest = Festival(
            fclty_nm=row['FCLTY_NM'],
            rdnmadr_nm=row['RDNMADR_NM'],
            fstvl_begin_de=row['FSTVL_BEGIN_DE'],
            fstvl_end_de=row['FSTVL_END_DE'],
            hmpg_addr=row['HMPG_ADDR'],
            mnnst_nm=row['MNNST_NM'],
            tel_no=row['TEL_NO']
        )
        db.session.add(fest)

    db.session.commit()
    print("🎉 데이터베이스에 성공적으로 저장되었습니다.")
