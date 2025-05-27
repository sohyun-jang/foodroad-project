import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './EventRecommendationPage.css';

const EventRecommendationPage = () => {
  // 상태 관리
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [showDetailedEvent, setShowDetailedEvent] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [nextMonth, setNextMonth] = useState(new Date(new Date().setMonth(new Date().getMonth() + 1)));
  
  // 달력 초기화
  useEffect(() => {
    const today = new Date();
    const nextMonthDate = new Date(today);
    nextMonthDate.setMonth(today.getMonth() + 1);
    setCurrentMonth(today);
    setNextMonth(nextMonthDate);
  }, []);

  // 임시 행사 데이터
  const events = [
    {
      id: 1,
      name: '서울 푸드 페스티벌',
      date: '2025.05.15 - 2025.05.17',
      location: '서울 강남구 테헤란로 123',
      description: '다양한 음식과 문화를 즐길 수 있는 축제',
      image: 'https://via.placeholder.com/300x400',
      profitability: '높음',
      weather: '맑음, 기온 15-20도',
      isFavorite: false,
      expectedVisitors: '약 5,000명',
      category: '푸드 페스티벌'
    },
    {
      id: 2,
      name: '부산 해변 마켓',
      date: '2025.05.20 - 2025.05.22',
      location: '부산 해운대구 해운대해변로 123',
      description: '해변가에서 즐기는 푸드트럭 축제',
      image: 'https://via.placeholder.com/300x400',
      profitability: '중간',
      weather: '흐림, 기온 18-22도',
      isFavorite: false,
      expectedVisitors: '약 3,000명',
      category: '마켓'
    },
    {
      id: 3,
      name: '인천 봄 마켓',
      date: '2025.05.23 - 2025.05.25',
      location: '인천 연수구 센트럴로 123',
      description: '봄 분위기와 함께하는 푸드 페스티벌',
      image: 'https://via.placeholder.com/300x400',
      profitability: '높음',
      weather: '맑음, 기온 16-21도',
      isFavorite: false,
      expectedVisitors: '약 4,000명',
      category: '마켓'
    },
    {
      id: 4,
      name: '대전 봄 축제',
      date: '2025.05.28 - 2025.05.30',
      location: '대전 유성구 엑스포로 123',
      description: '봄을 맞이하는 따뜻한 음식 축제',
      image: 'https://via.placeholder.com/300x400',
      profitability: '중간',
      weather: '맑음, 기온 17-22도',
      isFavorite: false,
      expectedVisitors: '약 2,500명',
      category: '축제'
    }
  ];

  // 날짜 포맷 함수
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 달력 렌더링 함수
  const renderCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // 요일 헤더
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    
    // 빈 셀 채우기
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // 날짜 채우기
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const dateString = formatDate(currentDate);
      const isSelected = dateString >= selectedStartDate && dateString <= selectedEndDate;
      const isToday = new Date().toDateString() === currentDate.toDateString();
      
      days.push(
        <div 
          key={`day-${i}`} 
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => handleDayClick(dateString)}
        >
          {i}
        </div>
      );
    }
    
    return (
      <div className="calendar-month">
        <div className="calendar-month-header">
          {`${year}년 ${month + 1}월`}
        </div>
        <div className="calendar-weekdays">
          {weekdays.map(day => <div key={day} className="calendar-weekday">{day}</div>)}
        </div>
        <div className="calendar-days">
          {days}
        </div>
      </div>
    );
  };

  // 날짜 클릭 핸들러
  const handleDayClick = (dateString) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // 새로운 선택 시작
      setSelectedStartDate(dateString);
      setSelectedEndDate('');
    } else {
      // 선택 완료
      if (dateString < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(dateString);
      } else {
        setSelectedEndDate(dateString);
      }
    }
  };

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    setShowCalendar(false);
    // 검색 로직 (실제 구현에서는 API 호출 등으로 대체)
    console.log('검색:', searchLocation, selectedStartDate, selectedEndDate);
  };

  // 행사 상세 정보 표시
  const showEventDetails = (event) => {
    setShowDetailedEvent(event);
  };

  // 찜하기 토글
  const toggleFavorite = (eventId) => {
    // 실제 구현에서는 API 호출 등으로 대체
    console.log('찜하기 토글:', eventId);
  };

  // 날짜 표시 포맷
  const displayDateRange = () => {
    if (selectedStartDate && selectedEndDate) {
      return `${selectedStartDate.replace(/-/g, '.')} - ${selectedEndDate.replace(/-/g, '.')}`;
    } else if (selectedStartDate) {
      return selectedStartDate.replace(/-/g, '.');
    } else {
      return '날짜 선택';
    }
  };

  return (
    <div className="event-recommendation-page">
      <div className="search-container">
        <div className="search-box">
          <form onSubmit={handleSearch}>
            <div className="search-inputs">
              <div className="search-input location">
                <label>어떤 지역의 행사를 찾으시나요?</label>
                <input 
                  type="text" 
                  placeholder="도시, 공항, 지역, 랜드마크, 호텔 이름으로 검색" 
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              
              <div className="search-input date" onClick={() => setShowCalendar(!showCalendar)}>
                <label>날짜</label>
                <div className="date-display">{displayDateRange()}</div>
              </div>
              
              <button type="submit" className="search-button">검색</button>
            </div>
            
            {showCalendar && (
              <div className="calendar-container">
                <div className="calendar-wrapper">
                  {renderCalendar(currentMonth)}
                  {renderCalendar(nextMonth)}
                </div>
                <div className="calendar-footer">
                  <button 
                    className="calendar-apply-button" 
                    onClick={() => setShowCalendar(false)}
                  >
                    적용
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="event-display-container">
        <div className="events-list-container">
          <div className="events-header">
            <h2>추천 행사</h2>
            <div className="events-filter">
              <select>
                <option>인기순</option>
                <option>날짜순</option>
                <option>수익성순</option>
              </select>
            </div>
          </div>
          
          {!showDetailedEvent ? (
            <div className="events-grid">
              {events.map(event => (
                <div key={event.id} className="event-card" onClick={() => showEventDetails(event)}>
                  <div className="event-image">
                    <img src={event.image} alt={event.name} />
                    <button 
                      className={`favorite-button ${event.isFavorite ? 'favorited' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(event.id);
                      }}
                    >
                      ★
                    </button>
                    <div className="event-category">{event.category}</div>
                  </div>
                  <div className="event-info">
                    <h3>{event.name}</h3>
                    <p className="event-date">{event.date}</p>
                    <p className="event-location">{event.location}</p>
                    <div className="event-highlights">
                      <span className="highlight">예상 방문객: {event.expectedVisitors}</span>
                      <span className="highlight">수익성: {event.profitability}</span>
                    </div>
                    <p className="event-description">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="detailed-event">
              <button className="back-button" onClick={() => setShowDetailedEvent(null)}>← 목록으로</button>
              <div className="detailed-event-content">
                <div className="detailed-event-image">
                  <img src={showDetailedEvent.image} alt={showDetailedEvent.name} />
                  <button 
                    className={`favorite-button ${showDetailedEvent.isFavorite ? 'favorited' : ''}`}
                    onClick={() => toggleFavorite(showDetailedEvent.id)}
                  >
                    ★
                  </button>
                  <div className="event-category">{showDetailedEvent.category}</div>
                </div>
                <div className="detailed-event-info">
                  <h2>{showDetailedEvent.name}</h2>
                  <p className="detailed-event-date"><strong>기간:</strong> {showDetailedEvent.date}</p>
                  <p className="detailed-event-location"><strong>위치:</strong> {showDetailedEvent.location}</p>
                  <p className="detailed-event-visitors"><strong>예상 방문객:</strong> {showDetailedEvent.expectedVisitors}</p>
                  <p className="detailed-event-profitability"><strong>수익성 예상:</strong> {showDetailedEvent.profitability}</p>
                  <p className="detailed-event-weather"><strong>날씨 예상:</strong> {showDetailedEvent.weather}</p>
                  <p className="detailed-event-description">{showDetailedEvent.description}</p>
                  <button className="apply-button">참가 신청하기</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventRecommendationPage;