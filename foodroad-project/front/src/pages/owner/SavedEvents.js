import React, { useState, useEffect } from 'react';
import './SavedEvents.css';

const SavedEvents = () => {
  const [savedEvents, setSavedEvents] = useState([]);
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  // 임시 데이터 (실제로는 API에서 가져와야 함)
  useEffect(() => {
    const fetchSavedEvents = () => {
      // API 호출 대신 임시 데이터
      const dummyEvents = [
        {
          id: 1,
          name: '서울 푸드트럭 페스티벌',
          date: '2025-06-15',
          location: '서울 영등포구 여의도공원',
          expectedVisitors: 5000,
          participationFee: 50000,
          description: '서울 최대 규모의 푸드트럭 페스티벌',
          image: 'https://via.placeholder.com/400x200?text=Food+Festival',
          status: 'upcoming'
        },
        {
          id: 2,
          name: '한강 야시장',
          date: '2025-07-01',
          location: '서울 용산구 반포한강공원',
          expectedVisitors: 3000,
          participationFee: 30000,
          description: '한강에서 즐기는 야간 푸드트럭 마켓',
          image: 'https://via.placeholder.com/400x200?text=Night+Market',
          status: 'upcoming'
        },
        {
          id: 3,
          name: '부산 해변 축제',
          date: '2025-05-20',
          location: '부산 해운대구 해운대해수욕장',
          expectedVisitors: 4000,
          participationFee: 40000,
          description: '부산 해변에서 열리는 음식 축제',
          image: 'https://via.placeholder.com/400x200?text=Beach+Festival',
          status: 'past'
        }
      ];
      setSavedEvents(dummyEvents);
    };

    fetchSavedEvents();
  }, []);

  const filteredEvents = savedEvents.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  const handleApply = (eventId) => {
    // 행사 신청 처리 로직
    console.log('신청하기:', eventId);
  };

  const handleRemove = (eventId) => {
    // 찜하기 취소 로직
    setSavedEvents(savedEvents.filter(event => event.id !== eventId));
  };

  return (
    <div className="saved-events-container">
      <div className="saved-events-header">
        <h1>찜한 행사</h1>
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            전체
          </button>
          <button 
            className={filter === 'upcoming' ? 'active' : ''} 
            onClick={() => setFilter('upcoming')}
          >
            예정된 행사
          </button>
          <button 
            className={filter === 'past' ? 'active' : ''} 
            onClick={() => setFilter('past')}
          >
            지난 행사
          </button>
        </div>
      </div>

      <div className="events-grid">
        {filteredEvents.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-image">
              <img src={event.image} alt={event.name} />
              <div className="event-date">
                {new Date(event.date).toLocaleDateString('ko-KR')}
              </div>
            </div>
            <div className="event-content">
              <h3>{event.name}</h3>
              <p className="event-location">
                <span className="icon">📍</span> {event.location}
              </p>
              <div className="event-details">
                <div className="detail-item">
                  <span className="icon">👥</span>
                  <span>예상 방문객: {event.expectedVisitors}명</span>
                </div>
                <div className="detail-item">
                  <span className="icon">💰</span>
                  <span>참가비: {event.participationFee.toLocaleString()}원</span>
                </div>
              </div>
              <p className="event-description">{event.description}</p>
              <div className="event-actions">
                {event.status === 'upcoming' && (
                  <button 
                    className="apply-button"
                    onClick={() => handleApply(event.id)}
                  >
                    신청하기
                  </button>
                )}
                <button 
                  className="remove-button"
                  onClick={() => handleRemove(event.id)}
                >
                  찜하기 취소
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedEvents;
