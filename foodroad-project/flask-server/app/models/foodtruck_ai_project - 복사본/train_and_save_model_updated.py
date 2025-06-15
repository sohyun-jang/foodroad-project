import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import GridSearchCV
import joblib

# CSV 파일 로드
df = pd.read_csv("flask-server/data/행사_입력값_예상수익_통합.csv")

# 특징 컬럼
feature_cols = [
    "식당_개수", "카페_개수", "편의점_개수", "편의시설_개수",
    "관광지_수", "상점_수", "공원_수", "주차장_수",
    "지하철역_수", "POI_다양성", "교통접근성점수"
]

X = df[feature_cols]
y = df["최종_예상수익"]

# 하이퍼파라미터 튜닝을 위한 GridSearchCV
param_grid = {
    'n_estimators': [100, 200],
    'max_depth': [None, 10, 20],
    'min_samples_split': [2, 5]
}

rf = RandomForestRegressor(random_state=42)
grid_search = GridSearchCV(rf, param_grid, cv=3, n_jobs=-1)
grid_search.fit(X, y)

# 최적 모델 저장
best_model = grid_search.best_estimator_
joblib.dump(best_model, "foodtruck_sales_model_best.pkl")
