import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './EventRecommendationPage.css';
import EventRecommendationMap from '../components/EventRecommendationMap';

const EventRecommendationPage = () => {
  // 상태 관리
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('');  // 'location' or 'event'
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [nextMonth, setNextMonth] = useState(new Date(new Date().setMonth(new Date().getMonth() + 1)));
  const [filteredEvents, setFilteredEvents] = useState([]);

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

  // 컴포넌트 마운트 시 모든 이벤트 표시
  useEffect(() => {
    setFilteredEvents(events);
  }, []);

  // 지역 이름을 통한 좌표 변환 함수 (Geocoding)
  const getLocationCoordinates = (locationName) => {
    // 실제 구현에서는 Google Geocoding API를 사용하여 좌표 변환
    // 여기서는 간단한 예시로 몇 가지 지역의 좌표를 하드코딩
    const locations = {
      '서울': { lat: 37.5665, lng: 126.9780 },
      '부산': { lat: 35.1796, lng: 129.0756 },
      '인천': { lat: 37.4563, lng: 126.7052 },
      '대전': { lat: 36.3504, lng: 127.3845 },
      '광주': { lat: 35.1595, lng: 126.8526 },
      '대구': { lat: 35.8714, lng: 128.6014 },
      '울산': { lat: 35.5384, lng: 129.3114 },
      '제주': { lat: 33.4996, lng: 126.5312 },
      '강남구': { lat: 37.5172, lng: 127.0473 },
      '해운대구': { lat: 35.1631, lng: 129.1637 },
      '연수구': { lat: 37.4103, lng: 126.6781 },
      '유성구': { lat: 36.3613, lng: 127.3561 }
    };
    
    // 포함된 지역명 찾기 (예: '서울시 강남구'에서 '강남구' 또는 '서울' 추출)
    for (const [key, value] of Object.entries(locations)) {
      if (locationName.includes(key)) {
        return { coordinates: value, locationName: key };
      }
    }
    
    return null;
  };

  // 검색어가 이벤트 이름에 포함되는지 확인하는 함수
  const matchesEventName = (event, searchTerm) => {
    return event.name.toLowerCase().includes(searchTerm.toLowerCase());
  };

  // 이벤트가 특정 지역에 있는지 확인하는 함수
  const isInLocation = (event, locationName) => {
    return event.location.toLowerCase().includes(locationName.toLowerCase());
  };

  // 날짜 포맷 함수
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 달력 렌더링 함수
  const renderCalendar = (date, uniqueSuffix) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // 요일 헤더
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    // 빈 셀 채우기
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}-${uniqueSuffix}`} className="calendar-day empty"></div>);
    }

    // 날짜 채우기
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const dateString = formatDate(currentDate);
      
      // 날짜 선택 상태 확인
      const isStartDate = dateString === selectedStartDate;
      const isEndDate = dateString === selectedEndDate;
      const isInRange = selectedStartDate && selectedEndDate && 
                        dateString >= selectedStartDate && 
                        dateString <= selectedEndDate;
      
      // 클래스 이름 조합
      let className = "calendar-day";
      if (isStartDate) className += " selected start-date";
      if (isEndDate) className += " selected end-date";
      if (isInRange && !isStartDate && !isEndDate) className += " in-range";

      days.push(
        <div 
          key={`day-${i}-${uniqueSuffix}`} 
          className={className}
          onClick={() => handleDayClick(dateString)}
        >
          {i}
        </div>
      );
    }

    return (
      <div className="calendar-month">
        <div className="calendar-month-header">
          {/* Display only the year and month for this specific calendar instance */}
          {`${year}년 ${month + 1}월`}
        </div>
        <div className="calendar-weekdays">
          {weekdays.map(day => <div key={`${day}-${uniqueSuffix}`} className="calendar-weekday">{day}</div>)}
        </div>
        <div className="calendar-days">
          {days}
        </div>
      </div>
    );
  };

  // Global month navigation handlers
  const handleGlobalPrevMonth = () => {
    setCurrentMonth(prevCurrentMonth => {
      const newCurrentMonth = new Date(prevCurrentMonth.getFullYear(), prevCurrentMonth.getMonth() - 1, 1);
      setNextMonth(new Date(newCurrentMonth.getFullYear(), newCurrentMonth.getMonth() + 1, 1));
      return newCurrentMonth;
    });
  };

  const handleGlobalNextMonth = () => {
    setCurrentMonth(prevCurrentMonth => {
      const newCurrentMonth = new Date(prevCurrentMonth.getFullYear(), prevCurrentMonth.getMonth() + 1, 1);
      setNextMonth(new Date(newCurrentMonth.getFullYear(), newCurrentMonth.getMonth() + 1, 1));
      return newCurrentMonth;
    });
  };

  // Global Year Change Handler
  const handleGlobalYearChange = (e) => {
    const newYear = parseInt(e.target.value, 10);
    setCurrentMonth(prevCurrentMonth => {
      const newCurrentMonth = new Date(newYear, prevCurrentMonth.getMonth(), 1);
      setNextMonth(new Date(newCurrentMonth.getFullYear(), newCurrentMonth.getMonth() + 1, 1));
      return newCurrentMonth;
    });
  };

  // 날짜 클릭 핸들러
  const handleDayClick = (dateString) => {
    // 이미 선택된 날짜를 다시 클릭하는 경우
    if (dateString === selectedStartDate) {
      // 시작일을 다시 클릭하면 종료일이 시작일이 되고 시작일은 초기화
      if (selectedEndDate) {
        setSelectedStartDate(selectedEndDate);
        setSelectedEndDate('');
      } else {
        // 시작일만 선택된 상태에서 시작일을 다시 클릭하면 모두 초기화
        setSelectedStartDate('');
        setSelectedEndDate('');
      }
    } else if (dateString === selectedEndDate) {
      // 종료일을 다시 클릭하면 종료일만 초기화
      setSelectedEndDate('');
    } else if (!selectedStartDate) {
      // 아무것도 선택되지 않은 상태에서 첫 클릭 - 시작일 설정
      setSelectedStartDate(dateString);
      setSelectedEndDate('');
    } else if (!selectedEndDate) {
      // 시작일만 선택된 상태에서 다른 날짜 클릭 - 종료일 설정
      // 시작일보다 이전 날짜를 클릭한 경우 시작일과 종료일 교체
      if (dateString < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(dateString);
      } else {
        setSelectedEndDate(dateString);
      }
    } else {
      // 이미 범위가 선택된 상태에서 새 날짜 클릭 - 새로운 시작일로 설정
      setSelectedStartDate(dateString);
      setSelectedEndDate('');
    }
    
    // 날짜가 선택되면 자동으로 검색을 수행합니다
    // setTimeout을 사용하여 상태 업데이트 후 검색이 실행되도록 합니다
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} };
      handleSearch(fakeEvent);
    }, 0);
  };

  // 날짜 문자열을 Date 객체로 변환하는 함수
  const parseDateString = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    return new Date(year, month - 1, day); // JavaScript에서 월은 0부터 시작
  };

  // 이벤트 날짜 문자열을 Date 객체로 변환하는 함수
  const parseEventDate = (dateString) => {
    // 예: "2025.05.15 - 2025.05.17" 형식의 문자열
    const dates = dateString.split(' - ');
    const startDateParts = dates[0].split('.');
    const startDate = new Date(
      parseInt(startDateParts[0], 10),
      parseInt(startDateParts[1], 10) - 1,
      parseInt(startDateParts[2], 10)
    );
    
    // 종료일이 있는 경우
    if (dates.length > 1) {
      const endDateParts = dates[1].split('.');
      const endDate = new Date(
        parseInt(endDateParts[0], 10),
        parseInt(endDateParts[1], 10) - 1,
        parseInt(endDateParts[2], 10)
      );
      return { startDate, endDate };
    }
    
    // 종료일이 없는 경우 (하루 행사)
    return { startDate, endDate: startDate };
  };

  // 이벤트가 선택된 날짜 범위에 포함되는지 확인하는 함수
  const isEventInDateRange = (event, selectedStart, selectedEnd) => {
    if (!selectedStart) return true; // 선택된 날짜가 없으면 모든 이벤트 포함
    
    const { startDate, endDate } = parseEventDate(event.date);
    const start = parseDateString(selectedStart);
    const end = selectedEnd ? parseDateString(selectedEnd) : start;
    
    // 이벤트의 시작일이 선택된 날짜 범위 내에 있거나
    // 이벤트의 종료일이 선택된 날짜 범위 내에 있거나
    // 이벤트 기간이 선택된 날짜 범위를 포함하는 경우
    return (
      (startDate >= start && startDate <= end) || 
      (endDate >= start && endDate <= end) ||
      (startDate <= start && endDate >= end)
    );
  };

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    setShowCalendar(false);
    
    const searchTerm = searchLocation.trim();
    let filtered = [...events];
    
    // 1. 날짜 필터링
    if (selectedStartDate) {
      filtered = filtered.filter(event => 
        isEventInDateRange(event, selectedStartDate, selectedEndDate)
      );
    }
    
    // 2. 검색어 필터링 (지역 또는 이벤트 이름)
    if (searchTerm) {
      // 지역 검색인지 확인
      const locationInfo = getLocationCoordinates(searchTerm);
      if (locationInfo) {
        // 지역 검색인 경우
        filtered = filtered.filter(event => 
          isInLocation(event, locationInfo.locationName)
        );
        setSearchType('location');
      } else {
        // 이벤트 이름 검색인 경우
        filtered = filtered.filter(event => 
          matchesEventName(event, searchTerm)
        );
        setSearchType('event');
      }
    } else {
      setSearchType('');
    }
    
    setFilteredEvents(filtered);
    console.log('검색:', searchTerm, selectedStartDate, selectedEndDate);
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

  const currentYearForDropdown = currentMonth.getFullYear();
  const yearsForDropdown = Array.from({ length: 10 }, (_, i) => currentYearForDropdown - 5 + i);

  return (
    <div className="event-recommendation-page">
      <div className="search-container">
        <div className="search-box">
          <form onSubmit={handleSearch}>
            <div className="search-inputs">
              <div className="search-input">
                <label>지역, 행사명, 수소 이름으로 검색</label>
                <input 
                  type="text" 
                  placeholder="검색어를 입력하세요" 
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              <div className="search-input date" onClick={() => setShowCalendar(!showCalendar)}>
                <label>날짜</label>
                <div className="date-display">
                  {displayDateRange()}
                </div>
              </div>
              <button type="submit" className="search-button">검색</button>
            </div>
          </form>
          
          {/* 캘린더 */}
          {showCalendar && (
            <div className="calendar-container">
              <div className="calendar-controls-header"> 
                <button onClick={handleGlobalPrevMonth} className="calendar-global-nav-button prev">‹</button>
                <select 
                  value={currentMonth.getFullYear()} 
                  onChange={handleGlobalYearChange} 
                  className="calendar-global-year-select"
                >
                  {yearsForDropdown.map(y => <option key={y} value={y}>{y}년</option>)}
                </select>
                <button onClick={handleGlobalNextMonth} className="calendar-global-nav-button next">›</button>
              </div>
              <div className="calendar-wrapper">
                {renderCalendar(currentMonth, 'current')}
                {renderCalendar(nextMonth, 'next')}
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
        </div>
      </div>
      
      {/* 새로운 EventRecommendationMap 컴포넌트를 사용 */}
      <div className="event-display-container">
        {filteredEvents.length > 0 ? (
          <EventRecommendationMap events={filteredEvents} searchType={searchType} searchTerm={searchLocation} />
        ) : (
          <div className="no-events-message">
            <h3>검색 결과가 없습니다.</h3>
            <p>다른 검색어로 다시 시도해보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventRecommendationPage;