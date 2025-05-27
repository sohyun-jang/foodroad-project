import React, { useEffect, useRef } from 'react';

const Map = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Google Maps API 로드 함수
    const loadGoogleMapsApi = () => {
      // 이미 스크립트가 로드되어 있는지 확인
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      // 이미 스크립트 태그가 추가되어 있는지 확인
      const existingScript = document.getElementById('google-maps-script');
      if (existingScript) return;

      // 콜백 함수 이름 설정
      window.initGoogleMaps = initMap;

      // 스크립트 태그 생성 및 추가
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    // 지도 초기화 함수
    const initMap = () => {
      if (!window.google || !window.google.maps) {
        console.error('Google Maps API가 로드되지 않았습니다.');
        return;
      }

      // 서울의 좌표 (위도, 경도)
      const seoul = { lat: 37.5665, lng: 126.9780 };
      
      // 지도 생성 및 옵션 설정
      const map = new window.google.maps.Map(mapRef.current, {
        center: seoul,
        zoom: 12, // 서울 시내가 잘 보이는 줌 레벨
        mapTypeControl: true,
        fullscreenControl: true,
      });
    };

    // Google Maps API 로드 시작
    loadGoogleMapsApi();

    return () => {
      // 컴포넌트 언마운트 시 콜백 함수 정리
      window.initGoogleMaps = null;
    };
  }, []);

  return (
    <div 
      ref={mapRef} 
      style={{ width: '100%', height: '500px', border: '1px solid #ddd' }}
    />
  );
};

export default Map;