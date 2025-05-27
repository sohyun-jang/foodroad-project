
import pandas as pd
import time
from google_api_features import extract_features

API_KEY = "AIzaSyAmhmwIdTR2qKMxs4GP4cnqtDBOeQDG55g"

# 1. 행사 데이터 로드
df = pd.read_csv("행사_샘플데이터_예상수익포함.csv", encoding="utf-8-sig")

# 2. 결과 저장용 리스트
feature_rows = []

# 3. 각 행사별로 feature 추출
for i, row in df.iterrows():
    lat = row["event_lat"]
    lng = row["event_lng"]
    try:
        features = extract_features(lat, lng, API_KEY)
        feature_rows.append(features)
        print(f"[{i}] ✅ feature 추출 완료")
    except Exception as e:
        print(f"[경고] feature 추출 실패 (index={i}): {e}")
        feature_rows.append({
            "카페_개수": -1,
            "식당_개수": -1,
            "편의점_개수": -1,
            "편의시설_개수": -1,
            "지하철_거리평균_m": -1
        })
    time.sleep(0.5)  # API 쿼터 대응

# 4. 기존 데이터프레임에 추가
features_df = pd.DataFrame(feature_rows)
df_final = pd.concat([df.reset_index(drop=True), features_df], axis=1)

# 5. 저장
df_final.to_csv("행사_입력데이터_완성.csv", index=False, encoding="utf-8-sig")
