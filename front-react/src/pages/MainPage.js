import React, { useState } from 'react';
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

  return (
    <div className="main-page">
      <div className="hero-section">
        <div className="events-container">
          <h2>곧 열릴 행사</h2>
          <div className="events-list">
            {currentPage > 0 && (
              <button className="events-nav-button prev-button" onClick={goToPrevPage}>
                ▲ 이전 행사
              </button>
            )}
            {currentEvents.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-image">
                  <img src={event.image} alt={event.name} />
                </div>
                <div className="event-info">
                  <h3>{event.name}</h3>
                  <p className="event-date">{event.date}</p>
                  <p className="event-location">{event.location}</p>
                  <p className="event-description">{event.description}</p>
                  <a href={`/event/${event.id}`} className="event-link">자세히 보기</a>
                </div>
              </div>
            ))}
            {currentPage < totalPages - 1 && (
              <button className="events-nav-button next-button" onClick={goToNextPage}>
                ▼ 다음 행사
              </button>
            )}
          </div>
        </div>
        <div className="map-container">
          <h2>행사 위치</h2>
          <div className="map-placeholder">
            {/* 지도 API 연동 예정 */}
            <div className="map-image">지도가 표시될 영역입니다</div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="feature">
          <h2>푸드트럭 사장님을 위한 기능</h2>
          <div className="feature-content">
            <div className="feature-image">
              <img src="https://via.placeholder.com/400x300" alt="푸드트럭 사장님 기능" />
            </div>
            <div className="feature-description">
              <h3>행사 정보를 한눈에</h3>
              <p>지도에서 행사 위치를 확인하고 수익성 알고리즘으로 예상 수익을 계산해보세요.</p>
              <h3>최적의 경로 제안</h3>
              <p>여러 행사를 효율적으로 참여할 수 있는 최적의 경로를 제안해드립니다.</p>
              <h3>간편한 행사 신청</h3>
              <p>관심 있는 행사에 바로 신청하고 관리할 수 있습니다.</p>
            </div>
          </div>
        </div>

        <div className="feature">
          <h2>행사 주최자를 위한 기능</h2>
          <div className="feature-content reverse">
            <div className="feature-description">
              <h3>행사 홍보 효과 극대화</h3>
              <p>많은 푸드트럭 사장님들과 방문객들에게 행사를 홍보할 수 있습니다.</p>
              <h3>간편한 행사 등록</h3>
              <p>행사 정보와 사진을 등록하고 필요한 푸드트럭 정보를 제공하세요.</p>
              <h3>행사 관리 시스템</h3>
              <p>참가 신청 현황과 행사 정보를 효율적으로 관리할 수 있습니다.</p>
            </div>
            <div className="feature-image">
              <img src="https://via.placeholder.com/400x300" alt="행사 주최자 기능" />
            </div>
          </div>
        </div>

        <div className="feature">
          <h2>방문객을 위한 기능</h2>
          <div className="feature-content">
            <div className="feature-image">
              <img src="https://via.placeholder.com/400x300" alt="방문객 기능" />
            </div>
            <div className="feature-description">
              <h3>다양한 행사 정보</h3>
              <p>지역별, 날짜별로 다양한 행사 정보를 확인할 수 있습니다.</p>
              <h3>맛집 푸드트럭 찾기</h3>
              <p>행사에 참여하는 인기 푸드트럭 정보를 미리 확인하세요.</p>
              <h3>행사 리뷰 및 평가</h3>
              <p>방문한 행사와 푸드트럭에 대한 리뷰를 남기고 공유할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="main-footer">
        <div className="footer-content">
          <div className="company-info">
            <h3>FoodRoad</h3>
            <p>푸드트럭과 행사를 연결하는 플랫폼</p>
            <p>사업자등록번호: 123-45-67890</p>
            <p>주소: 서울특별시 강남구 테헤란로 123</p>
            <p>이메일: info@foodroad.com</p>
          </div>
          <div className="footer-links">
            <h3>바로가기</h3>
            <ul>
              <li><a href="/about">회사 소개</a></li>
              <li><a href="/terms">이용약관</a></li>
              <li><a href="/privacy">개인정보처리방침</a></li>
              <li><a href="/contact">고객센터</a></li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; 2023 FoodRoad. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;