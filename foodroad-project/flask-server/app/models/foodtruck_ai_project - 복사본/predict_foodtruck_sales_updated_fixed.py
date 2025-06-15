
import pandas as pd
import joblib

# 모델 로드
model = joblib.load("foodroad-project/flask-server/data/foodtruck_sales_model_best.pkl")

# 예측에 사용할 컬럼명 정의
feature_cols = [
    "식당_개수", "카페_개수", "편의점_개수", "편의시설_개수",
    "관광지_수", "상점_수", "공원_수", "주차장_수", "지하철역_수",
    "POI_다양성", "교통접근성점수"
]

# 데이터 로드
df_1 = pd.read_csv("foodroad-project/flask-server/data/행사_입력값_예상수익_통합.csv")

# 특징 벡터 추출
x_input = df_1[feature_cols]

# 예측
y_pred = model.predict(x_input)
print("예측 결과:", y_pred)

# 예측 수행
df_2 = pd.read_csv("foodroad-project/flask-server/data/행사_샘플데이터_예상수익포함.csv")
predict_list = y_pred.tolist()
# df_1의 "행사명"이 df_2의 "공연/행사명"에 존재하는 경우만 필터링
if "행사명" in df_1.columns and "공연/행사명" in df_2.columns:
    df_2 = df_2[df_2["공연/행사명"].isin(df_1["행사명"])]
else:
    raise KeyError('"행사명" column in df_1 or "공연/행사명" column in df_2 is missing')
df_2 = df_2.loc[:, ["공연/행사명", "날짜/시간", "장소", "event_lat", "event_lng", "문화포털상세URL"]]
df_2["profitability"] = y_pred
df_2 = df_2.rename(columns={"공연/행사명": "name", "날짜/시간": "date", "장소": "location", "event_lat": "event-lat", "event_lng": "event-lng", "문화포털상세URL": "URL"})
df_2.insert(0, "id", df_2.index + 1) # id 컬럼 추가

# 결과를 CSV 파일로 저장하기 전에 profitability_level 컬럼 추가
# 3분위수 기준으로 구간 나누기
q_low = df_2["profitability"].quantile(1/3)
q_high = df_2["profitability"].quantile(2/3)

def get_profit_level(x):
    if x >= q_high:
        return "높음"
    elif x >= q_low:
        return "중간"
    else:
        return "낮음"

df_2["profitability"] = df_2["profitability"].apply(get_profit_level)

import re
def convert_date_format(date_str):
    if pd.isna(date_str):
        return ""
    # 물결(~) 또는 하이픈(-)으로 구분된 기간을 하이픈(-)으로 통일
    parts = re.split(r'[~\-]', date_str)
    if len(parts) == 2:
        start, end = parts
        start = start.strip().replace("-", ".")
        end = end.strip().replace("-", ".")
        return f"{start} - {end}"
    else:
        return date_str.strip().replace("-", ".")

df_2["date"] = df_2["date"].apply(convert_date_format)

# 결과를 CSV 파일로 저장
df_2.to_csv("foodroad-project/flask-server/data/최종_예측.csv", index=False)