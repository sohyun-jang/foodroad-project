
import pandas as pd
import joblib
from google_api_features import extract_features

# 모델 로드
model = joblib.load("foodtruck_sales_model.pkl")

# 데이터 로드 (행사 리스트)
df = pd.read_csv("행사_샘플데이터_예상수익포함.csv")
df = df.dropna(subset=["공연/행사명", "event_lat", "event_lng"])
event_names = df["공연/행사명"].tolist()

# 사용자 입력
input_name = input("🎯 행사명을 입력하세요: ").strip()

# 해당 행사 찾기
matched = df[df["공연/행사명"].str.contains(input_name, case=False)]

if matched.empty:
    print(f"[오류] '{input_name}'와 일치하는 행사가 없습니다.")
else:
    row = matched.iloc[0]
    lat, lng = row["event_lat"], row["event_lng"]
    print(f"[행사명: {row['공연/행사명']} | 장소: {row['장소']}]")

    # feature 생성
    features = extract_features(lat, lng)
    feature_order = [
        "음식점_수", "카페_수", "관광지_수", "상점_수",
        "공원_수", "주차장_수", "지하철역_수",
        "POI_다양성", "지하철_거리", "교통접근성점수"
    ]
    x_input = [[features.get(col, 0) for col in feature_order]]

    # 예측
    predicted = model.predict(x_input)[0]
    print(f"💰 예측 수익: {int(predicted):,} 원")
