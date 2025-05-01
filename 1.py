import requests
import pandas as pd
import numpy as np

# API 키 설정
API_KEY = 'AIzaSyAmhmwIdTR2qKMxs4GP4cnqtDBOeQDG55g'

# 주요 교통 허브 정의 (예: 지하철역, 버스 터미널 등)
transit_hubs = ['서울역', '강남역', '홍대입구역', '여의도역']

# 푸드트럭 위치 또는 행사장 위치 리스트
event_locations = ['여의도 공원', '한강공원', '남산공원', '올림픽공원']

# 결과 저장할 데이터프레임 생성
accessibility_data = []

# API 호출하여 교통 접근성 데이터 수집
for event in event_locations:
    event_access = {'location': event}

    for hub in transit_hubs:
        url = f"https://maps.googleapis.com/maps/api/distancematrix/json?origins={hub}&destinations={event}&mode=transit&key={API_KEY}"
        response = requests.get(url)
        data = response.json()

        # 이동 시간(초) 및 거리(미터) 추출
        if data['status'] == 'OK':
            duration = data['rows'][0]['elements'][0]['duration']['value']  # 초 단위
            distance = data['rows'][0]['elements'][0]['distance']['value']  # 미터 단위
            event_access[f'{hub}_시간'] = duration / 60  # 분 단위로 변환
            event_access[f'{hub}_거리'] = distance / 1000  # km 단위로 변환

    accessibility_data.append(event_access)

# 데이터프레임으로 변환
df_accessibility = pd.DataFrame(accessibility_data)

#####교통접근성 점수계산

# 각 허브로부터의 접근성을 평균하여 종합 점수 생성
df_accessibility['평균_소요시간'] = df_accessibility[[f'{hub}_시간' for hub in transit_hubs]].mean(axis=1)
df_accessibility['평균_거리'] = df_accessibility[[f'{hub}_거리' for hub in transit_hubs]].mean(axis=1)

# 소요시간 역수를 취해 점수화 (시간이 짧을수록 점수 높음)
max_time = df_accessibility['평균_소요시간'].max()
df_accessibility['교통_접근성_점수'] = 100 * (1 - df_accessibility['평균_소요시간'] / max_time)


#####종합데이터셋 구축
#####1. 추가 특성 데이터 수집
# 유동인구 데이터 (예시)
df_population = pd.DataFrame({
    'location': event_locations,
    '유동인구_20대': [1500, 2000, 1200, 1800],
    '유동인구_30대': [1200, 1800, 1000, 1500],
    '유동인구_40대': [800, 1200, 600, 1000]
})

# 경쟁업체 밀집도 데이터 (Google Places API 활용)
df_competitors = pd.DataFrame({
    'location': event_locations,
    '경쟁업체_수': [15, 8, 12, 20],
    '평균_리뷰_점수': [4.2, 3.8, 4.5, 4.0]
})

# 인구 연령대 데이터
df_demographics = pd.DataFrame({
    'location': event_locations,
    '20대_비율': [0.25, 0.35, 0.40, 0.30],
    '30대_비율': [0.30, 0.25, 0.20, 0.35],
    '40대_비율': [0.20, 0.15, 0.15, 0.20]
})

# 과거 수익성 데이터 (목표 변수)
df_profitability = pd.DataFrame({
    'location': event_locations,
    '일일_매출': [450000, 650000, 350000, 550000],
    '수익성_점수': [75, 85, 65, 80]  # 0-100 척도
})

#####2. 데이터 통합 및 전처리
# 데이터프레임 병합
df_merged = df_accessibility.merge(df_population, on='location')
df_merged = df_merged.merge(df_competitors, on='location')
df_merged = df_merged.merge(df_demographics, on='location')
df_merged = df_merged.merge(df_profitability, on='location')

# 특성 선택
X = df_merged.drop(['location', '일일_매출', '수익성_점수'], axis=1)
y = df_merged['수익성_점수']  # 목표 변수

# 데이터 정규화 (특성 스케일 조정)
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)



#####scikit-learn으로 모델 구축 및 학습
#####1. 데이터 분할 및 모델 선택
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

# 학습 및 테스트 데이터 분할
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# 모델 생성 (랜덤 포레스트 회귀 모델)
model = RandomForestRegressor(n_estimators=100, random_state=42)

# 모델 학습
model.fit(X_train, y_train)


#####모델 평가 및 특성 중요도 분석
# 예측 및 평가
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"평균 제곱 오차: {mse:.2f}")
print(f"R² 점수: {r2:.2f}")

# 특성 중요도 확인
feature_importance = pd.DataFrame({
    '특성': X.columns,
    '중요도': model.feature_importances_
}).sort_values('중요도', ascending=False)

print("\n특성 중요도:")
print(feature_importance)


#####하이퍼파라미터 튜닝 및 모델 최적화

from sklearn.model_selection import GridSearchCV

# 하이퍼파라미터 튜닝을 위한 파라미터 그리드
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': [2, 5, 10]
}

# 그리드 서치로 최적 파라미터 탐색
grid_search = GridSearchCV(
    RandomForestRegressor(random_state=42),
    param_grid=param_grid,
    cv=5,
    scoring='neg_mean_squared_error'
)
grid_search.fit(X_train, y_train)

# 최적 모델 및 파라미터 확인
best_model = grid_search.best_estimator_
print(f"최적 파라미터: {grid_search.best_params_}")

# 최적 모델로 예측 및 평가
y_pred_best = best_model.predict(X_test)
mse_best = mean_squared_error(y_test, y_pred_best)
r2_best = r2_score(y_test, y_pred_best)

print(f"최적 모델 - 평균 제곱 오차: {mse_best:.2f}")
print(f"최적 모델 - R² 점수: {r2_best:.2f}")



#####5. 새로운 위치의 수익성 예측

# 새로운 행사 위치에 대한 데이터 수집
new_location_data = {
    '서울역_시간': 25,
    '강남역_시간': 35,
    '홍대입구역_시간': 20,
    '여의도역_시간': 15,
    '서울역_거리': 5.2,
    '강남역_거리': 8.1,
    '홍대입구역_거리': 4.5,
    '여의도역_거리': 3.2,
    '평균_소요시간': 23.75,
    '평균_거리': 5.25,
    '교통_접근성_점수': 70,
    '유동인구_20대': 1700,
    '유동인구_30대': 1400,
    '유동인구_40대': 900,
    '경쟁업체_수': 10,
    '평균_리뷰_점수': 4.3,
    '20대_비율': 0.32,
    '30대_비율': 0.28,
    '40대_비율': 0.18
}

# 새 데이터를 DataFrame으로 변환 후 스케일링
new_location_df = pd.DataFrame([new_location_data])
new_location_scaled = scaler.transform(new_location_df)

# 수익성 예측
predicted_profitability = best_model.predict(new_location_scaled)
print(f"예상 수익성 점수: {predicted_profitability[0]:.2f}")


