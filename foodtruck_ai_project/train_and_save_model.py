
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score

# 1. 학습용 데이터 로딩
df = pd.read_csv("행사_입력값_예상수익_통합.csv")
df = df.dropna(subset=["최종_예상수익"])

# 2. 입력값 feature 정의
feature_cols = [
    "음식점_수", "카페_수", "관광지_수", "상점_수",
    "공원_수", "주차장_수", "지하철역_수",
    "POI_다양성", "지하철_거리", "교통접근성점수"
]
X = df[feature_cols]
y = df["최종_예상수익"]

# 3. 모델 파이프라인 구성
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", RandomForestRegressor(n_estimators=100, random_state=42))
])

# 4. 학습 및 평가
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
pipeline.fit(X_train, y_train)
y_pred = pipeline.predict(X_test)

print("✅ 평균제곱오차 (MSE):", mean_squared_error(y_test, y_pred))
print("✅ 결정계수 (R²):", r2_score(y_test, y_pred))

# 5. 모델 저장 (선택)
import joblib
joblib.dump(pipeline, "foodtruck_sales_model.pkl")
print("✅ 모델 저장 완료: foodtruck_sales_model.pkl")
