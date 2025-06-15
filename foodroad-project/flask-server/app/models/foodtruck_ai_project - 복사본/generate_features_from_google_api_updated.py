import pandas as pd
from google_api_features_extended_updated import extract_features
import time

# 입력 CSV 파일
INPUT_CSV = "flask-server/data/trimmed_20_events.csv"
OUTPUT_CSV = "flask-server/data/최종_예측.csv"
API_KEY = "AIzaSyAmhmwIdTR2qKMxs4GP4cnqtDBOeQDG55g"

# CSV 불러오기
df = pd.read_csv(INPUT_CSV)

# 결과를 저장할 리스트
features_list = []

for index, row in df.iterrows():
    try:
        lat, lng = row["event_lat"], row["event_lng"]
        features = extract_features(lat, lng, API_KEY)
        features["행사명"] = row["공연/행사명"]
        features["장소"] = row["장소"]
        features["event_lat"] = lat
        features["event_lng"] = lng
        features["최종_예상수익"] = row["최종_예상수익"]
        features_list.append(features)
        print(f"[{index}] ✔ {row['공연/행사명']} 처리 완료")
    except Exception as e:
        print(f"[{index}] ⚠ {row['공연/행사명']} 처리 실패: {e}")
    time.sleep(0.5)  # API 쿼터 제한 대응

# DataFrame으로 변환 후 저장
df_out = pd.DataFrame(features_list)
df_out.to_csv(OUTPUT_CSV, index=False, encoding="utf-8-sig")
print(f"✅ 저장 완료: {OUTPUT_CSV}")
