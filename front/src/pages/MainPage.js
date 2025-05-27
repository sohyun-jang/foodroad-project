import React, { useState, useEffect, useRef } from 'react';
import './MainPage.css';

const MainPage = () => {
  // 임시 행사 데이터
  const allEvents = [
    {
      id: 1,
      name: '서울 푸드 페스티벌',
      date: '2023.12.15 - 2023.12.17',
      location: '서울 강남구',
      description: '다양한 음식과 문화를 즐길 수 있는 축제',
      image: 'https://via.placeholder.com/300x400'
    },
    {
      id: 2,
      name: '부산 해변 마켓',
      date: '2023.12.20 - 2023.12.22',
      location: '부산 해운대구',
      description: '해변가에서 즐기는 푸드트럭 축제',
      image: 'https://via.placeholder.com/300x400'
    },
    {
      id: 3,
      name: '인천 크리스마스 마켓',
      date: '2023.12.23 - 2023.12.25',
      location: '인천 연수구',
      description: '크리스마스 분위기와 함께하는 푸드 페스티벌',
      image: 'https://via.placeholder.com/300x400'
    },
    {
      id: 4,
      name: '대전 겨울 축제',
      date: '2023.12.28 - 2023.12.30',
      location: '대전 유성구',
      description: '겨울을 맞이하는 따뜻한 음식 축제',
      image: 'https://via.placeholder.com/300x400'
    },
    {
      id: 5,
      name: '광주 신년 푸드 페어',
      date: '2024.01.05 - 2024.01.07',
      location: '광주 서구',
      description: '신년을 맞이하는 다양한 음식 페어',
      image: 'https://via.placeholder.com/300x400'
    },
    {
      id: 6,
      name: '제주 감귤 축제',
      date: '2024.01.10 - 2024.01.15',
      location: '제주시',
      description: '제주 특산품 감귤을 활용한 다양한 음식 축제',
      image: 'https://via.placeholder.com/300x400'
    },
    {
      id: 7,
      name: '울산 겨울 푸드 마켓',
      date: '2024.01.20 - 2024.01.22',
      location: '울산 남구',
      description: '겨울 별미를 맛볼 수 있는 푸드 마켓',
      image: 'https://via.placeholder.com/300x400'
    },
    {
      id: 8,
      name: '대구 설맞이 축제',
      date: '2024.02.01 - 2024.02.03',
      location: '대구 중구',
      description: '설을 맞이하여 전통 음식을 즐길 수 있는 축제',
      image: 'https://via.placeholder.com/300x400'
    }
  ];

  // 타겟층 소개 데이터
  const targetGroups = [
    {
      id: 1,
      title: '20대, 30대 식도락가',
      description: '새로운 맛집을 찾아 헤매는 당신을 위해, 전국의 핫플레이스를 한눈에 확인하세요. 지역별, 장르별로 정리된 맛집 정보와 함께, 이벤트를 통해 특별한 경험을 즐기세요.',
      image: 'https://via.placeholder.com/600x400?text=2030+Foodie',
      icon: '🍽️',
      features: ['핫플레이스 추천', '이벤트 알림', '리뷰 공유']
    },
    {
      id: 2,
      title: '40대, 50대 가족 단위',
      description: '가족과 함께 즐길 수 있는 푸드 페스티벌 정보를 제공합니다. 아이들이 좋아할 맛집부터 가족 모두가 즐길 수 있는 이벤트까지, 풍성한 경험을 선사합니다.',
      image: 'https://via.placeholder.com/600x400?text=Family+Fun',
      icon: '👨‍👩‍👧‍👦',
      features: ['가족 이벤트', '키즈 메뉴', '가족 리뷰']
    },
    {
      id: 3,
      title: '60대 이상 여행객',
      description: '지역 특산물과 전통 음식을 경험하고 싶은 여행객을 위한 이벤트 정보를 제공합니다. 지역의 특색 있는 맛집과 축제 정보를 한 곳에서 확인하세요.',
      image: 'https://via.placeholder.com/600x400?text=Senior+Traveler',
      icon: '✈️',
      features: ['지역 특산물', '전통 음식', '여행 코스']
    }
  ];

  const [activeTargetGroup, setActiveTargetGroup] = useState(1);

  // 지도 관련 상태와 참조 추가
  const mapRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [infoWindow, setInfoWindow] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [bounds, setBounds] = useState(null);

  // 페이지네이션 상태 관리
  const [currentPage, setCurrentPage] = useState(0);
  const eventsPerPage = 3; // 한 페이지에 표시할 이벤트 수를 3개로 변경
  const totalPages = Math.ceil(allEvents.length / eventsPerPage);
  
  // 현재 페이지에 표시할 이벤트 목록
  const currentEvents = allEvents.slice(
    currentPage * eventsPerPage,
    (currentPage + 1) * eventsPerPage
  );

  // 이전 페이지로 이동
  const goToPrevPage = () => {
    setCurrentPage(prev => (prev > 0 ? prev - 1 : prev));
  };

  // 다음 페이지로 이동
  const goToNextPage = () => {
    setCurrentPage(prev => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  // 이벤트 선택 시 지도 업데이트
  const selectEvent = (event) => {
    setSelectedEvent(event);
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
    const newBounds = new window.google.maps.LatLngBounds();
    const newMarkers = allEvents.map(event => {
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
        const clickedEvent = allEvents.find(e => e.id === event.id);
        setSelectedEvent(clickedEvent);
        
        // 이벤트 목록에서 해당 이벤트가 있는 페이지로 이동
        const eventPage = Math.floor((clickedEvent.id - 1) / eventsPerPage);
        if (eventPage !== currentPage) {
          setCurrentPage(eventPage);
        }
      });
      
      return marker;
    });
    
    setMarkers(newMarkers);
    setBounds(newBounds);
    
    // 모든 마커가 보이도록 지도 확대/축소 및 중앙 조정
    newMap.fitBounds(newBounds);
    
    // 너무 가깝게 확대되는 것 방지
    const zoomChangeBoundsListener = window.google.maps.event.addListenerOnce(newMap, 'bounds_changed', () => {
      if (newMap.getZoom() > 12) {
        newMap.setZoom(12);
      }
    });
    
    // 지도 클릭 시 정보창 닫기
    // newMap.addListener('click', () => {
    //   newInfoWindow.close();
    // });
    
    // 리스너 제거 타이머 설정
    setTimeout(() => {
      window.google.maps.event.removeListener(zoomChangeBoundsListener);
    }, 2000);
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
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAmhmwIdTR2qKMxs4GP4cnqtDBOeQDG55g&libraries=places`;
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
  }, []);

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
        <p>${selectedEvent.date}</p>
        <p>${selectedEvent.location}</p>
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

  // 타겟층별 소개 섹션
  const TargetGroupsSection = () => {
    return (
      <div className="target-groups-section">
        <div className="target-groups-container">
          <h2>당신의 취향에 맞는 FoodRoad</h2>
          <div className="target-groups-wrapper">
            {targetGroups.map(group => (
              <div 
                key={group.id}
                className={`target-group-card ${activeTargetGroup === group.id ? 'active' : ''}`}
                onClick={() => setActiveTargetGroup(group.id)}
              >
                <div className="target-group-icon">{group.icon}</div>
                <div className="target-group-image">
                  <img src={group.image} alt={group.title} />
                </div>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
                <div className="target-group-features">
                  {group.features.map((feature, index) => (
                    <span key={index} className="feature-dot">•</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="main-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>FoodRoad</h1>
          <p className="hero-description">푸드트럭과 행사를 연결하는 플랫폼</p>
          <div className="hero-features">
            <div className="feature-item">
              <span className="feature-icon">📍</span>
              <span>실시간 위치 정보</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📅</span>
              <span>행사 일정 관리</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⭐</span>
              <span>리뷰 및 평점</span>
            </div>
          </div>
        </div>
      </section>
      <div className="main-content" style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto', gap: '2rem', padding: '0 1.5rem' }}>
        <section className="events-section" style={{ flex: 1, width: '50%' }}>
          <h2>곧 열릴 행사</h2>
          <div className="events-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentEvents.map((event) => (
              <div 
                key={event.id} 
                className={`event-card ${selectedEvent && selectedEvent.id === event.id ? 'selected' : ''}`}
                onClick={() => selectEvent(event)}
                style={{ 
                  display: 'flex', 
                  background: 'white', 
                  borderRadius: '8px', 
                  overflow: 'hidden', 
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
                  cursor: 'pointer',
                  border: selectedEvent && selectedEvent.id === event.id ? '2px solid #4285f4' : '1px solid rgba(0, 0, 0, 0.05)'
                }}
              >
                <img 
                  src={event.image} 
                  alt={event.name} 
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
                <div className="event-info" style={{ padding: '1rem', flexGrow: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 600 }}>{event.name}</h3>
                  <p className="event-date" style={{ margin: '0.2rem 0', fontSize: '0.9rem', color: '#666' }}>{event.date}</p>
                  <p className="event-location" style={{ margin: '0.2rem 0', fontSize: '0.9rem', color: '#666' }}>{event.location}</p>
                  <p className="event-description" style={{ 
                    marginTop: '0.5rem', 
                    fontSize: '0.9rem', 
                    color: '#555',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>{event.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem', gap: '1rem' }}>
            <button 
              onClick={goToPrevPage} 
              disabled={currentPage === 0}
              className="pagination-button"
              style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#f0f0f0', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 0 ? 0.5 : 1
              }}
            >
              이전
            </button>
            <span className="page-info" style={{ fontSize: '0.9rem', color: '#666' }}>{currentPage + 1} / {totalPages}</span>
            <button 
              onClick={goToNextPage} 
              disabled={currentPage === totalPages - 1}
              className="pagination-button"
              style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#f0f0f0', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages - 1 ? 0.5 : 1
              }}
            >
              다음
            </button>
          </div>
        </section>
        
        <section className="map-section" style={{ flex: 1, width: '50%' }}>
          <h2>행사 위치</h2>
          <div 
            className="map-container" 
            ref={mapRef}
            style={{ 
              width: '100%', 
              height: '400px', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' 
            }}
          ></div>
        </section>
      </div>
      <TargetGroupsSection />
    </div>
  );
};

export default MainPage;