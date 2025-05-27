
import requests
import time

# 주변 주요 장소 개수, 거리 중심점 등 추출
def extract_features(lat, lng, api_key):
    # 👉 반환할 feature 딕셔너리
    features = {
        "편의시설_개수": 0,
        "지하철_거리평균_m": 0,
        "카페_개수": 0,
        "식당_개수": 0,
        "편의점_개수": 0
    }

    # Places API: 장소 검색 범위 설정 (500m 반경)
    place_types = {
        "카페": "cafe",
        "식당": "restaurant",
        "편의점": "convenience_store"
    }

    for label, place_type in place_types.items():
        url = (
            f"https://maps.googleapis.com/maps/api/place/nearbysearch/json"
            f"?location={lat},{lng}&radius=500&type={place_type}&key={api_key}"
        )
        try:
            res = requests.get(url).json()
            features[f"{label}_개수"] = len(res.get("results", []))
        except Exception:
            features[f"{label}_개수"] = -1
        time.sleep(0.2)

    # Distance Matrix API: 가까운 지하철역들과의 거리 측정 (임의 지정)
    subway_stations = ["서울역", "강남역", "잠실역", "홍대입구역", "종로3가역"]
    try:
        destinations = "|".join(subway_stations)
        matrix_url = (
            f"https://maps.googleapis.com/maps/api/distancematrix/json"
            f"?origins={lat},{lng}&destinations={destinations}&key={api_key}&language=ko"
        )
        res = requests.get(matrix_url).json()
        elements = res["rows"][0]["elements"]
        distances = [
            e["distance"]["value"] for e in elements if e.get("status") == "OK"
        ]
        features["지하철_거리평균_m"] = int(sum(distances) / len(distances)) if distances else -1
    except Exception:
        features["지하철_거리평균_m"] = -1

    # 전체 편의시설 개수 (카페 + 식당 + 편의점)
    features["편의시설_개수"] = (
        features["카페_개수"] + features["식당_개수"] + features["편의점_개수"]
    )

    return features
