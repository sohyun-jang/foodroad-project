import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import IllustratedMap from '../components/IllustratedMap';

const MainPage = () => {
  const navigate = useNavigate();
  
  const userGroups = [
    {
      type: 'foodtruck',
      title: '푸드트럭 사장님',
      description: '수익성 기반 알고리즘으로 최적의 위치와 시간대를 추천받고, 스마트한 동선 계획으로 수익을 극대화하세요.',
      features: [
        { icon: '📊', text: '수익성 분석' },
        { icon: '🗺️', text: '스마트 동선' },
        { icon: '📱', text: '실시간 정보' }
      ],
      image: 'https://via.placeholder.com/600x400?text=Foodtruck+Owner',
      ctaText: '수익 극대화하기'
    },
    {
      type: 'organizer',
      title: '행사 주최자',
      description: '다양한 푸드트럭을 한 곳에서 모집하고, 행사를 효과적으로 홍보하세요. 리뷰를 통한 피드백으로 더 나은 행사를 만들어갑니다.',
      features: [
        { icon: '📢', text: '행사 홍보' },
        { icon: '🚚', text: '푸드트럭 모집' },
        { icon: '⭐', text: '리뷰 관리' }
      ],
      image: 'https://via.placeholder.com/600x400?text=Event+Organizer',
      ctaText: '행사 시작하기'
    },
    {
      type: 'visitor',
      title: '방문자',
      description: '전국의 다양한 행사와 맛있는 푸드트럭을 한눈에! 리뷰 작성하고 혜택도 받아가세요.',
      features: [
        { icon: '📅', text: '행사 일정' },
        { icon: '🎁', text: '리뷰 혜택' },
        { icon: '📍', text: '맛집 지도' }
      ],
      image: 'https://via.placeholder.com/600x400?text=Visitor',
      ctaText: '행사 둘러보기'
    }
  ];

  // 임시 행사 데이터
  const allEvents = [
    {
      id: 1,
      name: '서울 푸드 페스티벌',
      date: '2025.6.1 - 2025.6.10',
      location: '서울 강남구',
      description: '다양한 음식과 문화를 즐길 수 있는 축제',
      image: 'https://via.placeholder.com/300x400'
    },
    {
      id: 2,
      name: '부산 해변 마켓',
      date: '2025.6.1 - 2025.6.10',
      location: '부산 해운대구',
      description: '해변가에서 즐기는 푸드트럭 축제',
      image: 'https://via.placeholder.com/300x400'
    },
    {
      id: 3,
      name: '인천 크리스마스 마켓',
      date: '2025.6.1 - 2025.6.10',
      location: '인천 연수구',
      description: '크리스마스 분위기와 함께하는 푸드 페스티벌',
      image: 'https://via.placeholder.com/300x400'
    },
    {
      id: 4,
      name: '대전 겨울 축제',
      date: '2026.12.2  8 - 2026.12.30',
      location: '대전 유성구',
      description: '겨울을 맞이하는 따뜻한 음식 축제',
      image: 'https://via.placeholder.com/300x400'
    },
    {
      id: 5,
      name: '광주 신년 푸드 페어',
      date: '2026.01.05 - 2026.01.07',
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
      {/* 히어로 섹션 */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>FoodRoad와 함께<br />맛있는 여정을 시작하세요</h1>
          <p className="hero-subtitle">
            푸드트럭의 새로운 기준, 행사의 새로운 가치
          </p>
        </div>
      </section>

      {/* 사용자 그룹별 섹션 */}
      <section className="user-groups-section">
        <div className="section-title">
          <h2>당신에게 맞는 FoodRoad</h2>
          <p>세 가지 방법으로 FoodRoad와 함께하세요</p>
        </div>
        
        <div className="user-groups-container">
          {userGroups.map((group, index) => (
            <div key={group.type} className="user-group-card">
              <div className="card-image">
                <img src={group.image} alt={group.title} />
              </div>
              <div className="card-content">
                <h3>{group.title}</h3>
                <p>{group.description}</p>
                <div className="feature-list">
                  {group.features.map((feature, i) => (
                    <div key={i} className="feature-item">
                      <span className="feature-icon">{feature.icon}</span>
                      <span className="feature-text">{feature.text}</span>
                    </div>
                  ))}
                </div>
                <button 
                  className="cta-button"
                  onClick={() => navigate(`/${group.type}`)}
                >
                  {group.ctaText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 실시간 통계 섹션 */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <h4>진행중인 행사</h4>
            <span className="stat-number">127</span>
          </div>
          <div className="stat-item">
            <h4>등록된 푸드트럭</h4>
            <span className="stat-number">438</span>
          </div>
          <div className="stat-item">
            <h4>누적 방문자</h4>
            <span className="stat-number">15,234</span>
          </div>
        </div>
      </section>

      <TargetGroupsSection />

      {/* 푸터 섹션 */}
      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-logo">
              <h3>FoodRoad</h3>
              <p>푸드트럭의 새로운 기준, 행사의 새로운 가치</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>회사 소개</h4>
                <ul>
                  <li><a href="/about">회사 소개</a></li>
                  <li><a href="/team">팀 소개</a></li>
                  <li><a href="/careers">채용</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>서비스</h4>
                <ul>
                  <li><a href="/foodtruck">푸드트럭 사장님</a></li>
                  <li><a href="/organizer">행사 주최자</a></li>
                  <li><a href="/visitor">방문자</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>고객센터</h4>
                <ul>
                  <li><a href="/faq">자주 묻는 질문</a></li>
                  <li><a href="/contact">문의하기</a></li>
                  <li><a href="/terms">이용약관</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 FoodRoad. All rights reserved.</p>
            <div className="social-links">
              <a href="#" aria-label="페이스북"><i className="fab fa-facebook"></i></a>
              <a href="#" aria-label="인스타그램"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="유튜브"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;