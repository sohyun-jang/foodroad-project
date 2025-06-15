import React, { useState, useEffect, useRef } from 'react';
import './EventRecommendationMap.css';

const EventRecommendationMap = ({ events, searchType, searchTerm }) => {
  const mapRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [infoWindow, setInfoWindow] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentEventPage, setCurrentEventPage] = useState(0);

  // 이벤트 페이지네이션
  const eventsPerPage = 3;
  const pageCount = Math.ceil(events?.length / eventsPerPage) || 0;

  // 현재 페이지의 이벤트 가져오기
  const getCurrentEvents = () => {
    if (!events || events.length === 0) return [];
    const start = currentEventPage * eventsPerPage;
    return events.slice(start, start + eventsPerPage);
  };

  // 다음 페이지로 이동
  const goToNextPage = () => {
    setCurrentEventPage(prev => (prev < pageCount - 1 ? prev + 1 : prev));
  };

  // 이전 페이지로 이동
  const goToPrevPage = () => {
    setCurrentEventPage(prev => (prev > 0 ? prev - 1 : 0));
  };

  // 지역 이름을 통한 좌표 변환 함수 (Geocoding)
  const getLocationCoordinates = (locationName) => {
    // 실제 구현에서는 Google Geocoding API를 사용하여 좌표 변환
    // 여기서는 간단한 예시로 몇 가지 지역의 좌표를 하드코딩
    const locations = {
      '서울': { lat: 37.5665, lng: 126.9780, zoom: 11 },
      '부산': { lat: 35.1796, lng: 129.0756, zoom: 11 },
      '인천': { lat: 37.4563, lng: 126.7052, zoom: 11 },
      '대전': { lat: 36.3504, lng: 127.3845, zoom: 11 },
      '광주': { lat: 35.1595, lng: 126.8526, zoom: 11 },
      '대구': { lat: 35.8714, lng: 128.6014, zoom: 11 },
      '울산': { lat: 35.5384, lng: 129.3114, zoom: 11 },
      '제주': { lat: 33.4996, lng: 126.5312, zoom: 11 },
      '강남구': { lat: 37.5172, lng: 127.0473, zoom: 13 },
      '해운대구': { lat: 35.1631, lng: 129.1637, zoom: 13 },
      '연수구': { lat: 37.4103, lng: 126.6781, zoom: 13 },
      '유성구': { lat: 36.3613, lng: 127.3561, zoom: 13 }
    };
    
    // 포함된 지역명 찾기 (예: '서울시 강남구'에서 '강남구' 또는 '서울' 추출)
    for (const [key, value] of Object.entries(locations)) {
      if (locationName.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
    
    return null;
  };

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
      8: { lat: 35.8714354, lng: 128.6014350 },  // 대구 중구
      // 9: { lat: event.lat, lng: event.lng }      //
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
          
          // 지도 중심을 마커 위치로 이동
          newMap.panTo(marker.getPosition());
          
          // 정보창 내용 설정 및 표시
          const content = `
            <div class="info-window">
              <h3>${clickedEvent.name}</h3>
              <p><strong>날짜:</strong> ${clickedEvent.date}</p>
              <p><strong>위치:</strong> ${clickedEvent.location}</p>
              <p><strong>설명:</strong> ${clickedEvent.description}</p>
            </div>
          `;
          
          newInfoWindow.setContent(content);
          newInfoWindow.open({
            anchor: marker,
            map: newMap
          });
        });
        
        return marker;
      });
      
      setMarkers(newMarkers);
      
      // 검색 유형에 따라 지도 중심 및 줌 레벨 조정
      if (searchType === 'location' && searchTerm) {
        const locationCoords = getLocationCoordinates(searchTerm);
        if (locationCoords) {
          // 검색된 위치로 지도 중심 이동 및 줌 레벨 설정
          newMap.setCenter(locationCoords);
          newMap.setZoom(locationCoords.zoom || 11);
        } else {
          // 모든 마커가 보이도록 지도 확대/축소 및 중앙 조정
          newMap.fitBounds(newBounds);
        }
      } else if (searchType === 'event' && events.length > 0) {
        // 이벤트 이름으로 검색한 경우, 모든 결과 마커가 보이도록 조정
        newMap.fitBounds(newBounds);
      } else {
        // 검색이 없는 경우, 모든 마커가 보이도록 지도 확대/축소 및 중앙 조정
        newMap.fitBounds(newBounds);
      }
      
      // 너무 가깝게 확대되는 것 방지
      const zoomChangeBoundsListener = window.google.maps.event.addListenerOnce(newMap, 'bounds_changed', () => {
        if (newMap.getZoom() > 12 && searchType !== 'location') {
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

  // 검색 조건이 변경될 때 지도 업데이트
  useEffect(() => {
    if (map && mapLoaded) {
      // 검색 유형에 따라 지도 중심 및 줌 레벨 조정
      if (searchType === 'location' && searchTerm) {
        const locationCoords = getLocationCoordinates(searchTerm);
        if (locationCoords) {
          // 검색된 위치로 지도 중심 이동 및 줌 레벨 설정
          map.setCenter(locationCoords);
          map.setZoom(locationCoords.zoom || 11);
        }
      } else if (markers.length > 0) {
        // 검색 결과에 따라 모든 마커가 보이도록 조정
        const bounds = new window.google.maps.LatLngBounds();
        markers.forEach(marker => bounds.extend(marker.getPosition()));
        map.fitBounds(bounds);
        
        // 너무 가깝게 확대되는 것 방지
        if (map.getZoom() > 12 && searchType !== 'location') {
          map.setZoom(12);
        }
      }
    }
  }, [searchType, searchTerm, map, mapLoaded, markers]);

  // 선택된 이벤트가 변경될 때 지도 업데이트
  useEffect(() => {
    if (!map || !mapLoaded || !infoWindow || !selectedEvent) return;
    
    // 선택된 이벤트의 마커 찾기
    const marker = markers.find(m => m.eventId === selectedEvent.id);
    if (!marker) return;
    
    // 지도 중심을 마커 위치로 이동
    map.panTo(marker.getPosition());
    
    // 정보창 내용 설정 및 표시
    const content = `
      <div class="info-window">
        <h3>${selectedEvent.name}</h3>
        <p><strong>날짜:</strong> ${selectedEvent.date}</p>
        <p><strong>위치:</strong> ${selectedEvent.location}</p>
        <p><strong>설명:</strong> ${selectedEvent.description}</p>
      </div>
    `;
    
    infoWindow.setContent(content);
    infoWindow.open({
      anchor: marker,
      map: map
    });
  }, [selectedEvent, map, mapLoaded, infoWindow, markers]);

  // 이벤트 카드 클릭 핸들러
  const handleEventCardClick = (event) => {
    setSelectedEvent(event);
  };

  const renderEventLegend = () => {
    return (
      <div className="event-legend">
        <h3>이벤트 정보</h3>
        <div className="legend-item">
          <span className="legend-icon">🟠</span>
          <span>행사 이름</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">📍</span>
          <span>행사 위치</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">📅</span>
          <span>날짜</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">💰</span>
          <span>수익성</span>
        </div>
      </div>
    );
  };

  return (
    <div className="event-recommendation-map">
      <div className="event-map-layout">
        {/* 왼쪽: 이벤트 목록 */}
        <div className="event-list-side">
          <h2 className="section-title">행사 목록</h2>
          <div className="event-cards-container">
            {getCurrentEvents().map(event => (
              <div 
                key={event.id} 
                className={`event-card ${selectedEvent?.id === event.id ? 'selected' : ''}`}
                onClick={() => handleEventCardClick(event)}
              >
                <div className="event-card-content">
                  {/* 분류 표시 로직 수정 */}
                  {event.category ? ( // category 값이 있을 때만 '🏷️ 분류: '와 함께 표시
                    <h3 className="event-name">🏷️ 분류: {event.category}</h3>
                  ) : (
                    // category가 없으면 name을 바로 표시 (예: "메이드페어 2025")
                    <h3 className="event-name">{event.name}</h3> 
                  )}
                  {/* 이미지에 'K'와 같은 이모지가 표시되는 경우, 이는 백엔드 데이터에 'K'가 포함된 것이므로
                      백엔드에서 'K'를 제거하거나, CSS로 해당 요소를 숨겨야 합니다.
                      만약 'K'가 항상 고정된 UI 요소라면, 이모지와 함께 span으로 분리하여 배치해야 합니다. */}

                  <p className="event-date">📅 {event.date}</p> {/* 이미 변환된 날짜 형식 */}
                  <p className="event-location">📍 {event.location}</p> {/* 이미 디코딩된 위치 */}
                  <p className="event-description">{event.description}</p>
                  <div className="event-details">
                    <p className="event-profitability">
                      💰 수익성: {event.profitability !== undefined && event.profitability !== null && event.profitability !== '' 
                                  ? event.profitability 
                                  : '정보 없음'} ☀️
                    </p> {/* 수익성: undefined -> 정보 없음, ☀️ 이모지 추가 */}
                    <p className="event-weather">🌤️ {event.weather || '정보 없음'}</p> {/* weather가 없으면 '정보 없음' */}
                    <p className="event-visitors">👥 예상 방문객: {event.expectedVisitors || '정보 없음'}</p> {/* 예상 방문객이 없으면 '정보 없음' */}
                    {/* category는 위에서 h3에 이미 처리했으므로 여기서는 제거하거나, 필요에 따라 다른 형태로 표시 */}
                    {/* <p className="event-category">🏷️ 분류: {event.category}</p> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 페이지네이션 */}
          {events && events.length > eventsPerPage && (
            <div className="pagination">
              <button
                className="pagination-button"
                onClick={goToPrevPage}
                disabled={currentEventPage === 0}
              >
                이전
              </button>
              <span className="page-indicator">
                {currentEventPage + 1} / {pageCount}
              </span>
              <button
                className="pagination-button"
                onClick={goToNextPage}
                disabled={currentEventPage === pageCount - 1}
              >
                다음
              </button>
            </div>
          )}
        </div>
        
        {/* 오른쪽: 지도 */}
        <div className="event-map-side">
          <h2 className="section-title">이벤트 지도</h2>
          <div className="event-map-container">
            <div ref={mapRef} className="map-container"></div>
            {renderEventLegend()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRecommendationMap;