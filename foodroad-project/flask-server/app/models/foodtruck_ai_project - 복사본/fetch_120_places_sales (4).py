#1
import requests
import time
import pandas as pd
import urllib.parse

API_KEY = "AIzaSyAmhmwIdTR2qKMxs4GP4cnqtDBOeQDG55g"
SEOUL_OPENAPI_KEY = "41756b497668747739394e59684846"

# 수익 비응답 장소(서울숲공원, 뚝섬한강공원) 제외
place_name_map = {
    "광화문광장": "광화문·덕수궁",
    "홍대 관광특구": "홍대입구역(2호선)",
    "명동 관광특구": "명동 관광특구",
    "여의도": "여의도",
    "서울역": "서울역",
    "종로·청계 관광특구": "종로·청계 관광특구",
    "잠실 관광특구": "잠실 관광특구",
    "강남 MICE 관광특구": "강남 MICE 관광특구"
}

places = list(place_name_map.keys())

def get_coordinates(place_name):
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {"address": f"{place_name}, 서울", "key": API_KEY}
    res = requests.get(url, params=params).json()
    if res.get("status") == "OK":
        loc = res["results"][0]["geometry"]["location"]
        return loc["lat"], loc["lng"]
    return None, None

def get_sales_revenue(place_name):
    try:
        encoded_place = urllib.parse.quote(place_name_map.get(place_name, place_name))
        url = f"http://openapi.seoul.go.kr:8088/{SEOUL_OPENAPI_KEY}/json/citydata_cmrcl/1/5/{encoded_place}"
        res = requests.get(url).json()
        data = res.get("LIVE_CMRCL_STTS", {})
        rsb_list = data.get("CMRCL_RSB", [])

        if rsb_list:
            d = rsb_list[0]
            cnt = int(d.get("RSB_SH_PAYMENT_CNT", 0))
            amt_min = int(d.get("RSB_SH_PAYMENT_AMT_MIN", 0))
            amt_max = int(d.get("RSB_SH_PAYMENT_AMT_MAX", 0))
            return int(((amt_min + amt_max) / 2) * cnt)

        # AREA 대체 수익 사용
        alt_cnt = int(data.get("AREA_SH_PAYMENT_CNT", 0))
        alt_min = int(data.get("AREA_SH_PAYMENT_AMT_MIN", 0))
        alt_max = int(data.get("AREA_SH_PAYMENT_AMT_MAX", 0))
        if alt_cnt > 0 and alt_min > 0 and alt_max > 0:
            print(f"[대체] {place_name} → AREA 수익 사용")
            return int(((alt_min + alt_max) / 2) * alt_cnt)

        print(f"[경고] 수익 데이터 없음: {place_name}")
        return 0

    except Exception as e:
        print(f"[오류] {place_name} 호출 실패 → {e}")
        return 0

records = []
for place in places:
    lat, lng = get_coordinates(place)
    revenue = get_sales_revenue(place)
    print(f"{place} | 위도: {lat}, 경도: {lng}, 수익: {revenue}")
    records.append({
        "장소명": place,
        "위도": lat,
        "경도": lng,
        "예상수익": revenue
    })
    time.sleep(0.3)

df = pd.DataFrame(records)
df.to_csv("foodroad-project/flask-server/data/120개_장소별_예상수익.csv", index=False, encoding="utf-8-sig")
