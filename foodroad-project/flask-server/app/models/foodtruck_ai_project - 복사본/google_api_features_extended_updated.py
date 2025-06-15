import requests
import time

def extract_features(lat, lng, api_key):
    try:
        radius = 500  # 반경 500m 설정
        types = {
            "식당_개수": "restaurant",
            "카페_개수": "cafe",
            "편의점_개수": "convenience_store",
            "편의시설_개수": "toilet",
            "관광지_수": "tourist_attraction",
            "상점_수": "store",
            "공원_수": "park",
            "주차장_수": "parking",
            "지하철역_수": "subway_station"
        }
        results = {}

        for label, place_type in types.items():
            url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&radius={radius}&type={place_type}&key={api_key}"
            res = requests.get(url, timeout=10)
            data = res.json()
            if "results" in data and isinstance(data["results"], list):
                results[label] = len(data["results"])
            else:
                results[label] = 0
            time.sleep(0.3)  # API 쿼터 제한 방지

        results["POI_다양성"] = len([k for k in results if results[k] > 0])
        results["교통접근성점수"] = min(100, results.get("지하철역_수", 0) * 10)  # 예: 역 개수 * 10점

        return results

    except Exception as e:
        print("⚠️ Google API 호출 오류:", e)
        return {
            "식당_개수": 0,
            "카페_개수": 0,
            "편의점_개수": 0,
            "편의시설_개수": 0,
            "관광지_수": 0,
            "상점_수": 0,
            "공원_수": 0,
            "주차장_수": 0,
            "지하철역_수": 0,
            "POI_다양성": 0,
            "교통접근성점수": 0
        }
