import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './FavoriteEventsPage.css';

const FavoriteEventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('saved'); // 'saved', 'completed'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  // 이벤트 데이터 가져오기
  useEffect(() => {
    fetchEvents();
  }, []);

  // 구글 맵 초기화
  useEffect(() => {
    // Google Maps API 스크립트 로드
    if (!window.google) {
      // 전역 콜백 함수 설정
      window.initMap = function() {
        console.log("Google Maps API loaded successfully");
        if (mapRef.current) {
          initializeMap();
        }
      };
  
      const googleMapScript = document.createElement('script');
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAmhmwIdTR2qKMxs4GP4cnqtDBOeQDG55g&libraries=places&callback=initMap`;
      googleMapScript.async = true;
      googleMapScript.defer = true;
      
      googleMapScript.onerror = function() {
        console.error("Google Maps API failed to load");
      };
      
      document.head.appendChild(googleMapScript);
    } else if (mapRef.current && !map) {
      initializeMap();
    }
    
    // 클린업 함수
    return () => {
      // 전역 콜백 제거
      if (window.initMap) {
        window.initMap = null;
      }
    };
  }, []); // 빈 의존성 배열 사용
  // 구글 맵 초기화
  useEffect(() => {
    // Google Maps API 스크립트 로드
    if (!window.google) {
      const googleMapScript = document.createElement('script');
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAmhmwIdTR2qKMxs4GP4cnqtDBOeQDG55g&libraries=places`;
      googleMapScript.async = true;
      googleMapScript.defer = true;
      
      googleMapScript.addEventListener('load', () => {
        if (mapRef.current) {
          initializeMap();
        }
      });
      
      document.head.appendChild(googleMapScript);
    } else if (mapRef.current && !map) {
      initializeMap();
    }
  }, [mapRef.current]);

  // 맵 초기화 함수
  const initializeMap = () => {
    const googleMap = new window.google.maps.Map(mapRef.current, {
      center: { lat: 37.5665, lng: 126.9780 }, // 서울 중심
      zoom: 10,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    });
    setMap(googleMap);
  };

  // 이벤트가 로드되고 맵이 초기화되면 마커 생성
  useEffect(() => {
    if (map && events.length > 0) {
      // 기존 마커 제거
      markers.forEach(marker => marker.setMap(null));
      
      // 새 마커 생성
      const newMarkers = events.map(event => {
        // 완료한 행사는 노란색, 찜한 행사는 빨간색
        const pinColor = event.isCompleted ? 'FFFF00' : 'FF0000';
        
        const marker = new window.google.maps.Marker({
          position: { lat: event.latitude, lng: event.longitude },
          map: map,
          title: event.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: `#${pinColor}`,
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: '#000000',
            scale: 10
          }
        });

        // InfoWindow 생성
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 250px;">
              <h3 style="margin-top: 0; margin-bottom: 8px;">${event.name}</h3>
              <div style="display: flex; align-items: center; gap: 5px; margin: 5px 0; color: #555;">
                <span style="color: #ff6b6b;">📅</span>
                <span>${new Date(event.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                ${event.endDate ? ` ~ ${new Date(event.endDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 5px; margin: 5px 0; color: #555;">
                <span style="color: #4285f4;">📍</span>
                <span>${event.location}</span>
              </div>
              <p style="margin: 8px 0;">${event.description}</p>
            </div>
          `
        });

        // 마커 클릭 이벤트
        marker.addListener('click', () => {
          // 다른 InfoWindow 닫기
          markers.forEach(m => {
            if (m.infoWindow && m.infoWindow !== infoWindow) {
              m.infoWindow.close();
            }
          });
          
          // InfoWindow 열기
          infoWindow.open(map, marker);
          
          // 선택된 이벤트 설정
          setSelectedEvent(event);
          
          // 맵 센터 이동
          map.panTo({ lat: event.latitude, lng: event.longitude });
        });

        // 마커에 InfoWindow 참조 저장
        marker.infoWindow = infoWindow;

        return marker;
      });

      setMarkers(newMarkers);

      // 맵 바운드 조정
      const bounds = new window.google.maps.LatLngBounds();
      events.forEach(event => {
        bounds.extend({ lat: event.latitude, lng: event.longitude });
      });
      map.fitBounds(bounds);
    }
  }, [map, events]);

  // 데이터 가져오기 (실제로는 API 호출해야 함)
  const fetchEvents = () => {
    setIsLoading(true);
    
    // 임시 데이터
    setTimeout(() => {
      const dummyEvents = [
        {
          id: 1,
          name: '서울 푸드트럭 페스티벌',
          date: '2025-06-15',
          endDate: '2025-06-17',
          location: '서울 영등포구 여의도공원',
          description: '서울 최대 규모의 푸드트럭 페스티벌',
          image: 'https://via.placeholder.com/400x200?text=Seoul+Festival',
          isExpired: false,
          isCompleted: false,
          profitabilityRating: 4.5,
          expectedWeather: '맑음, 26°C',
          eventWebsite: 'https://seoulfoodfestival.com',
          reviewCount: 128,
          averageRating: 4.2,
          latitude: 37.5269, 
          longitude: 126.9348,
          applied: false
        },
        {
          id: 2,
          name: '한강 야시장',
          date: '2025-07-01',
          endDate: '2025-07-03',
          location: '서울 용산구 반포한강공원',
          description: '한강에서 즐기는 야간 푸드트럭 마켓',
          image: 'https://via.placeholder.com/400x200?text=Hangang+Market',
          isExpired: false,
          isCompleted: false,
          profitabilityRating: 5,
          expectedWeather: '흐림, 가끔 소나기, 24°C',
          eventWebsite: 'https://hangangmarket.kr',
          reviewCount: 85,
          averageRating: 4.7,
          latitude: 37.5126, 
          longitude: 126.9969,
          applied: true
        },
        {
          id: 3,
          name: '부산 해변 축제',
          date: '2025-05-20',
          endDate: '2025-05-22',
          location: '부산 해운대구 해운대해수욕장',
          description: '부산 해변에서 열리는 음식 축제',
          image: 'https://via.placeholder.com/400x200?text=Busan+Festival',
          isExpired: true,
          isCompleted: false,
          profitabilityRating: 3.5,
          expectedWeather: '맑음, 22°C',
          eventWebsite: 'https://busanfoodfest.co.kr',
          reviewCount: 62,
          averageRating: 3.9,
          latitude: 35.1586, 
          longitude: 129.1603,
          applied: false
        },
        {
          id: 4,
          name: '인천 바다 푸드트럭 페스티벌',
          date: '2025-04-10',
          endDate: '2025-04-12',
          location: '인천 중구 월미도',
          description: '월미도에서 즐기는 해산물과 푸드트럭',
          image: 'https://via.placeholder.com/400x200?text=Incheon+Festival',
          isExpired: true,
          isCompleted: true,
          profitabilityRating: 4,
          expectedWeather: '맑음, 20°C',
          eventWebsite: 'https://incheonfestival.org',
          reviewCount: 45,
          averageRating: 4.1,
          satisfaction: 4.5,
          revenue: 1250000,
          feedback: '방문객 수가 많아 매출이 좋았음. 해산물 음식이 인기 있었음.',
          latitude: 37.4735, 
          longitude: 126.6092,
          applied: true
        },
        {
          id: 5,
          name: '대구 중앙로 푸드 위크',
          date: '2025-03-25',
          endDate: '2025-03-27',
          location: '대구 중구 중앙대로',
          description: '대구 도심에서 열리는 음식 축제',
          image: 'https://via.placeholder.com/400x200?text=Daegu+Food+Week',
          isExpired: true,
          isCompleted: true,
          profitabilityRating: 3,
          expectedWeather: '흐림, 18°C',
          eventWebsite: 'https://daegufoodweek.com',
          reviewCount: 38,
          averageRating: 3.7,
          satisfaction: 3.2,
          revenue: 850000,
          feedback: '평일이라 방문객이 예상보다 적었음. 저녁 시간대가 가장 붐빔.',
          latitude: 35.8695, 
          longitude: 128.5932,
          applied: true
        }
      ];
      
      setEvents(dummyEvents);
      setIsLoading(false);
      
      // 첫 번째 이벤트 선택
      if (dummyEvents.length > 0) {
        setSelectedEvent(dummyEvents[0]);
      }
    }, 1000);
  };

  // 탭에 따른 이벤트 필터링
  const filteredEvents = events.filter(event => {
    if (currentTab === 'saved') return !event.isCompleted;
    return event.isCompleted;
  });

  // 행사 신청하기
  const handleApplyEvent = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, applied: true } : event
    ));
    
    // 실제로는 API 호출을 통해 서버에 신청 정보를 전송해야 함
    console.log(`Event application submitted for event ID: ${eventId}`);
  };

  // 찜하기 취소
  const handleRemoveFavorite = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
    
    // 실제로는 API 호출을 통해 서버에 찜하기 취소 정보를 전송해야 함
    console.log(`Removed event ID ${eventId} from favorites`);
    
    // 선택된 이벤트가 삭제되는 경우
    if (selectedEvent && selectedEvent.id === eventId) {
      const remainingEvents = events.filter(event => event.id !== eventId);
      setSelectedEvent(remainingEvents.length > 0 ? remainingEvents[0] : null);
    }
  };

  // 행사 상세 페이지로 이동
  const handleViewDetails = (eventId) => {
    navigate(`/event-details/${eventId}`);
  };
  
  // 행사 웹사이트로 이동
  const handleVisitWebsite = (website) => {
    window.open(website, '_blank');
  };
  
  // 별점 렌더링
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star full-star">★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className="star half-star">★</span>);
      } else {
        stars.push(<span key={i} className="star empty-star">☆</span>);
      }
    }
    
    return <div className="rating-stars">{stars}</div>;
  };

  // 행사 카드 렌더링
  const renderEventCard = (event) => {
    const isExpired = event.isExpired;
    
    return (
      <div 
        key={event.id} 
        className={`event-card ${isExpired ? 'expired' : ''} ${selectedEvent && selectedEvent.id === event.id ? 'selected' : ''}`}
        onClick={() => setSelectedEvent(event)}
      >
        <div className="event-image">
          <img src={event.image} alt={event.name} />
          {event.isCompleted && (
            <div className="event-badge completed">완료</div>
          )}
          {isExpired && !event.isCompleted && (
            <div className="event-badge expired">종료</div>
          )}
        </div>
        <div className="event-content">
          <h3>{event.name}</h3>
          <div className="event-date-content">
            <span className="icon calendar-icon">�</span>
            {new Date(event.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
            {event.endDate && ` ~ ${new Date(event.endDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}`}
          </div>
          <p className="event-location">
            <span className="icon location-icon">📍</span> {event.location}
          </p>
          <div className="event-info-grid">
            <div className="info-item">
              <span className="info-label">수익성 평가</span>
              {renderRatingStars(event.profitabilityRating)}
            </div>
            <div className="info-item">
              <span className="info-label">예상 날씨</span>
              <span className="info-value">{event.expectedWeather}</span>
            </div>
            <div className="info-item">
              <span className="info-label">리뷰</span>
              <span className="info-value">⭐ {event.averageRating} ({event.reviewCount})</span>
            </div>
            
            {event.isCompleted && (
              <>
                <div className="info-item">
                  <span className="info-label">만족도</span>
                  {renderRatingStars(event.satisfaction)}
                </div>
                <div className="info-item">
                  <span className="info-label">매출</span>
                  <span className="info-value">{event.revenue.toLocaleString()}원</span>
                </div>
              </>
            )}
          </div>
          
          <p className="event-description">{event.description}</p>
          
          {event.isCompleted && (
            <div className="event-feedback">
              <h4>피드백</h4>
              <p>{event.feedback}</p>
            </div>
          )}
          
          <div className="event-actions">
            <button 
              className="details-button" 
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails(event.id);
              }}
            >
              상세 정보
            </button>
            
            <button 
              className="website-button" 
              onClick={(e) => {
                e.stopPropagation();
                handleVisitWebsite(event.eventWebsite);
              }}
            >
              행사 사이트
            </button>
            
            {!event.isCompleted && !isExpired && !event.applied && (
              <button 
                className="apply-button" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleApplyEvent(event.id);
                }}
              >
                행사 지원하기
              </button>
            )}
            
            {!event.isCompleted && !isExpired && event.applied && (
              <button className="applied-button" disabled>
                지원 완료
              </button>
            )}
            
            <button 
              className="remove-button" 
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFavorite(event.id);
              }}
            >
              찜 제거
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 로딩 중일 때 표시할 컴포넌트
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>행사 정보 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="favorite-events-container">
      <div className="page-header">
        <div className="header-title">
          <h1>내가 찜한 행사</h1>
          <p>관심있는 행사를 관리하고 참여 이력을 확인해보세요</p>
        </div>
      </div>
      
      <div className="main-content">
        <div className="events-section">
          <div className="filter-tabs">
            <button 
              className={`tab-button ${currentTab === 'saved' ? 'active' : ''}`} 
              onClick={() => setCurrentTab('saved')}
            >
              내가 찜한 행사
            </button>
            <button 
              className={`tab-button ${currentTab === 'completed' ? 'active' : ''}`} 
              onClick={() => setCurrentTab('completed')}
            >
              내가 완료한 행사
            </button>
          </div>
          
          {filteredEvents.length === 0 ? (
            <div className="no-events-message">
              <p>{currentTab === 'saved' ? '찜한 행사가 없습니다.' : '완료한 행사가 없습니다.'}</p>
              <button 
                className="browse-events-button"
                onClick={() => navigate('/event-recommendations')}
              >
                행사 둘러보기
              </button>
            </div>
          ) : (
            <div className="events-list">
              {filteredEvents.map(event => renderEventCard(event))}
            </div>
          )}
        </div>
        
        <div className="map-section">
          <div className="map-container" ref={mapRef}></div>
          {selectedEvent && (
            <div className="map-event-info">
              <h3>{selectedEvent.name}</h3>
              <p className="map-event-date">
                {new Date(selectedEvent.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                {selectedEvent.endDate && ` ~ ${new Date(selectedEvent.endDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}`}
              </p>
              <p className="map-event-location">
                <span className="icon">📍</span> {selectedEvent.location}
              </p>
              <div className="map-event-rating">
                <div className="rating-item">
                  <span className="rating-label">수익성:</span>
                  {renderRatingStars(selectedEvent.profitabilityRating)}
                </div>
                {selectedEvent.isCompleted && (
                  <div className="rating-item">
                    <span className="rating-label">만족도:</span>
                    {renderRatingStars(selectedEvent.satisfaction)}
                  </div>
                )}
              </div>
              <div className="map-event-actions">
                <button 
                  className="details-button" 
                  onClick={() => handleViewDetails(selectedEvent.id)}
                >
                  상세 정보
                </button>
                {!selectedEvent.isCompleted && !selectedEvent.isExpired && !selectedEvent.applied && (
                  <button 
                    className="apply-button" 
                    onClick={() => handleApplyEvent(selectedEvent.id)}
                  >
                    행사 지원하기
                  </button>
                )}
              </div>
            </div>
          )}
          
          <div className="map-legend">
            <div className="legend-item">
              <div className="legend-color saved"></div>
              <span>찜한 행사</span>
            </div>
            <div className="legend-item">
              <div className="legend-color completed"></div>
              <span>완료한 행사</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteEventsPage;
