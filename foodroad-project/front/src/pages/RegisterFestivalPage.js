import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Autocomplete, Marker } from '@react-google-maps/api';
import './RegisterFestivalPage.css';

const libraries = ['places'];

function RegisterFestivalPage() {
  const navigate = useNavigate();
  const [festivalData, setFestivalData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
    image: null,
    maxFoodTrucks: '',
    category: '',
    latitude: null,
    longitude: null
  });

  const [autocomplete, setAutocomplete] = useState(null);
  const [map, setMap] = useState(null);

  const defaultCenter = {
    lat: 37.5665, // 서울 중심부 위도
    lng: 126.9780 // 서울 중심부 경도
  };

  const onLoad = useCallback((autocomplete) => {
    setAutocomplete(autocomplete);
  }, []);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        // 위치 정보 업데이트
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };

        // 지도 이동 및 마커 위치를 중앙으로 설정
        if (map) {
          map.setCenter(newLocation);
          map.setZoom(17);
        }

        // festivalData 업데이트
        setFestivalData(prev => ({
          ...prev,
          location: place.formatted_address,
          latitude: newLocation.lat,
          longitude: newLocation.lng
        }));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFestivalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFestivalData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: API 연동 구현
    console.log('Festival data:', festivalData);
    // 성공 시 내 축제 목록 페이지로 이동
    navigate('/my-festivals');
  };

  return (
    <div className="register-festival-container">
      <h1>축제 등록</h1>
      <form onSubmit={handleSubmit} className="register-festival-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">축제명</label>
            <input
              type="text"
              id="name"
              name="name"
              value={festivalData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">축제 카테고리</label>
            <select
              id="category"
              name="category"
              value={festivalData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">카테고리 선택</option>
              <option value="food">음식</option>
              <option value="culture">문화</option>
              <option value="music">음악</option>
              <option value="art">예술</option>
              <option value="etc">기타</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">시작일</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={festivalData.startDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">종료일</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={festivalData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="location">개최 장소</label>
          <div className="map-container">
            <GoogleMap
              mapContainerClassName="google-map"
              center={defaultCenter}
              zoom={13}
              onLoad={map => setMap(map)}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false
              }}
            >
              {festivalData.latitude && festivalData.longitude && (
                <Marker
                  position={{
                    lat: festivalData.latitude,
                    lng: festivalData.longitude
                  }}
                />
              )}
              <Autocomplete
                onLoad={onLoad}
                onPlaceChanged={onPlaceChanged}
              >
                <input
                  type="text"
                  placeholder="주소를 검색하세요"
                  value={festivalData.location}
                  onChange={(e) => setFestivalData(prev => ({ ...prev, location: e.target.value }))}
                  required
                />
              </Autocomplete>
            </GoogleMap>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="maxFoodTrucks">최대 푸드트럭 수</label>
          <input
            type="number"
            id="maxFoodTrucks"
            name="maxFoodTrucks"
            value={festivalData.maxFoodTrucks}
            onChange={handleInputChange}
            required
            min="1"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">축제 설명</label>
          <textarea
            id="description"
            name="description"
            value={festivalData.description}
            onChange={handleInputChange}
            required
            rows="4"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="image">축제 이미지</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">축제 등록</button>
          <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>취소</button>
        </div>
      </form>
    </div>
  );
}

export default RegisterFestivalPage;