
import pandas as pd
from math import radians, cos, sin, sqrt, atan2

# 1. 행사 데이터 로드 (utf-8-sig 인코딩)
csv_file = "서울시 문화행사 정보_UTF8.csv"
df_events = pd.read_csv(csv_file, encoding="utf-8-sig")

print("📋 CSV 컬럼 목록:")
print(df_events.columns.tolist())

# 2. 좌표 컬럼 자동 탐지 및 표준화
lat_col = next((c for c in df_events.columns if "위도" in c), None)
lng_col = next((c for c in df_events.columns if "경도" in c), None)

if not lat_col or not lng_col:
    raise KeyError("❗ 위도/경도 열을 찾을 수 없습니다.")

df_events.rename(columns={lat_col: "event_lat", lng_col: "event_lng"}, inplace=True)
df_events["event_lat"] = pd.to_numeric(df_events["event_lat"], errors="coerce")
df_events["event_lng"] = pd.to_numeric(df_events["event_lng"], errors="coerce")
df_events = df_events.dropna(subset=["event_lat", "event_lng"]).reset_index(drop=True)

# 3. 수익 데이터 로드
df_places = pd.read_csv("120개_장소별_예상수익.csv")
df_places = df_places[df_places["예상수익"] > 0].reset_index(drop=True)

# 4. 거리 계산 함수
def haversine(lat1, lng1, lat2, lng2):
    R = 6371
    lat1, lng1, lat2, lng2 = map(radians, [lat1, lng1, lat2, lng2])
    dlat = lat2 - lat1
    dlng = lng2 - lng1
    a = sin(dlat/2)**2 + cos(lat1)*cos(lat2)*sin(dlng/2)**2
    return 2 * R * atan2(sqrt(a), sqrt(1 - a)) * 1000

# 5. 가장 가까운 장소의 수익 라벨링
def find_closest_revenue(lat, lng):
    min_dist = float("inf")
    closest_revenue = 0
    for _, row in df_places.iterrows():
        d = haversine(lat, lng, row["위도"], row["경도"])
        if d < min_dist:
            min_dist = d
            closest_revenue = row["예상수익"]
    return closest_revenue

df_events["최종_예상수익"] = df_events.apply(
    lambda row: find_closest_revenue(row["event_lat"], row["event_lng"]), axis=1
)

# 6. 저장
df_events.to_csv("행사_샘플데이터_예상수익포함.csv", index=False, encoding="utf-8-sig")
