import React, { useState, useEffect, useRef } from 'react';
import './EventMap.css';

const EventMap = ({ events }) => {
  const mapRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [infoWindow, setInfoWindow] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 이벤트 위치에 따른 좌표 설정 (실제 구현에서는 DB에서 가져온 좌표 사용)
  const getEventPosition = (event) => {
    // 이벤트 ID에 따라 약간 다른 위치 반환
    const locations = {
      1: { lat: 37.5662952, lng: 127.0097736 }, // 서울 강남구
      2: { lat: 35.1631139, lng: 129.1636592 }, // 부산 해운대구
      3: { lat: 37.3858382, lng: 126.6402581 }, // 인천 연수구
      4: { lat: 36.3614132, lng: 127.3489859 }, // 대전 유성구
      5: { lat: 35.1531762, lng: 126.8905363 }, // 광주 서구
      6: { lat: 33.4996213, lng: 126.5311884 }, // 제주시
      7: { lat: 35.5383773, lng: 129.3113596 }, // 울산 남구
      8: { lat: 35.8714354, lng: 128.6014350 }  // 대구 중구
    };
    return locations[event.id] || { lat: 37.5665, lng: 126.9780 }; // 기본값은 서울 중심
  };

  // 지도 초기화 함수
  const initMap = () => {
    if (!mapRef.current || !window.google) {
      console.error('Google Maps API가 로드되지 않았거나 맵 참조가 없습니다.');
      return;
    }
  
    // 서울 중심 좌표 (초기 위치)
    const center = { lat: 37.5665, lng: 126.9780 };
    
    const mapOptions = {
      center: center,
      zoom: 7, // 초기 줌 레벨을 낮게 설정
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      gestureHandling: 'greedy',
      draggable: true,
      scrollwheel: true,
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_BOTTOM
      },
      mapTypeId: window.google.maps.MapTypeId.ROADMAP
    };
  
    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);
    
    // 정보창 초기화 (한 번만 생성)
    const newInfoWindow = new window.google.maps.InfoWindow({
      pixelOffset: new window.google.maps.Size(0, -5),
      maxWidth: 300
    });
    
    // 정보창에 닫기 버튼 스타일만 변경
    window.google.maps.event.addListener(newInfoWindow, 'domready', () => {
      const closeButtons = document.getElementsByClassName('gm-ui-hover-effect');
      if (closeButtons.length > 0) {
        const closeButton = closeButtons[0];
        closeButton.style.top = '8px';
        closeButton.style.right = '8px';
        closeButton.style.width = '20px';
        closeButton.style.height = '20px';
      }
    });
    
    setInfoWindow(newInfoWindow);
    
    // 지도 스타일 커스터마이징
    const styledMapType = new window.google.maps.StyledMapType([
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }] // POI 라벨 숨기기
      }
    ]);
  
    newMap.mapTypes.set('styled_map', styledMapType);
    
    // 모든 이벤트 위치에 마커 생성
    if (events && events.length > 0) {
      const newBounds = new window.google.maps.LatLngBounds();
      const newMarkers = events.map(event => {
        const position = getEventPosition(event);
        newBounds.extend(position);
        
        const marker = new window.google.maps.Marker({
          position: position,
          map: newMap,
          title: event.name,
          animation: window.google.maps.Animation.DROP,
          eventId: event.id // 마커와 이벤트 연결을 위한 커스텀 속성
        });
        
        // 마커 클릭 이벤트 리스너
        marker.addListener('click', () => {
          // 이벤트 선택 및 정보창 표시
          const clickedEvent = events.find(e => e.id === event.id);
          setSelectedEvent(clickedEvent);
        });
        
        return marker;
      });
      
      setMarkers(newMarkers);
      
      // 모든 마커가 보이도록 지도 확대/축소 및 중앙 조정
      newMap.fitBounds(newBounds);
      
      // 너무 가깝게 확대되는 것 방지
      const zoomChangeBoundsListener = window.google.maps.event.addListenerOnce(newMap, 'bounds_changed', () => {
        if (newMap.getZoom() > 12) {
          newMap.setZoom(12);
        }
      });
      
      // 리스너 제거 타이머 설정
      setTimeout(() => {
        window.google.maps.event.removeListener(zoomChangeBoundsListener);
      }, 2000);
    }
  };

  // Google Maps API 스크립트 로드
  useEffect(() => {
    let googleMapScript = null;
    let isMounted = true;
    
    const loadGoogleMapsAPI = () => {
      // 이미 스크립트가 로드 중인지 확인
      const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api"]');
      if (existingScript) {
        return;
      }
      
      try {
        googleMapScript = document.createElement('script');
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
        googleMapScript.async = true;
        googleMapScript.defer = true;
        
        googleMapScript.addEventListener('load', () => {
          if (isMounted && mapRef.current) {
            setMapLoaded(true);
            initMap();
          }
        });
        
        googleMapScript.addEventListener('error', () => {
          console.error('Google Maps API 로드 실패');
        });
        
        document.head.appendChild(googleMapScript);
      } catch (error) {
        console.error('Google Maps API 로드 중 오류:', error);
      }
    };

    if (!window.google) {
      loadGoogleMapsAPI();
    } else if (mapRef.current) {
      setMapLoaded(true);
      initMap();
    }
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      isMounted = false;
      
      // 마커와 정보창 정리
      if (markers.length > 0) {
        markers.forEach(marker => {
          if (marker) marker.setMap(null);
        });
      }
      
      if (infoWindow) {
        infoWindow.close();
      }
    };
  }, [events]);

  // 선택된 이벤트가 변경될 때 지도 업데이트
  useEffect(() => {
    if (!map || !mapLoaded || !infoWindow) return;
    
    // 선택된 이벤트가 없으면 정보창만 닫기
    if (!selectedEvent) {
      infoWindow.close();
      return;
    }

    // 선택된 이벤트의 마커 찾기
    const marker = markers.find(m => m.eventId === selectedEvent.id);
    if (!marker) return;
    
    // 지도 중심 이동
    map.panTo(marker.getPosition());
    
    // 정보창 내용 설정 - 사용자 정의 닫기 버튼 추가
    const contentString = `
      <div class="info-window">
        <div style="position: relative;">
          <h3>${selectedEvent.name}</h3>
          <div style="position: absolute; top: 0; right: 0; cursor: pointer; font-size: 24px; width: 24px; height: 24px; text-align: center; line-height: 22px; font-weight: bold;" 
               onclick="document.getElementById('close-info-window').click()">×</div>
          <button id="close-info-window" style="display: none;"></button>
          <style>
            .gm-style .gm-style-iw-t button.gm-ui-hover-effect {
              display: none !important;
            }
          </style>
        </div>
        <div style="display: flex; align-items: center; gap: 5px; margin: 5px 0; color: #555;">
          <span style="color: #ff6b6b;">📅</span>
          <span>${selectedEvent.date}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 5px; margin: 5px 0; color: #555;">
          <span style="color: #4285f4;">📍</span>
          <span>${selectedEvent.location}</span>
        </div>
        <p>${selectedEvent.description}</p>
      </div>
    `;
    
    infoWindow.setContent(contentString);
    infoWindow.open({
      anchor: marker,
      map,
      shouldFocus: false,
    });
    
    // 사용자 정의 닫기 버튼에 이벤트 리스너 추가
    setTimeout(() => {
      const closeButton = document.getElementById('close-info-window');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          infoWindow.close();
        });
      }
    }, 100);
    
    // 줌 레벨 조정 (너무 멀리 있을 경우)
    if (map.getZoom() < 10) {
      map.setZoom(10);
    }
    
  }, [selectedEvent, map, infoWindow, mapLoaded, markers]);

  return (
    <div 
      className="event-map-container" 
      ref={mapRef}
    />
  );
};

export default EventMap;
