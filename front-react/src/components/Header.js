import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { isLoggedIn, userType, userData, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1>FoodRoad</h1>
          </Link>
        </div>
        <nav className="nav-links">
          {!isLoggedIn ? (
            // 로그인하지 않은 경우
            <>
              <Link to="/login" className="nav-link">로그인</Link>
              <Link to="/signup" className="nav-link signup-btn">회원가입</Link>
            </>
          ) : (
            // 로그인한 경우
            <>
              {userType === 'foodtruck' && (
                // 푸드트럭 사장님 메뉴
                <>
                  <Link to="/event-recommendations" className="nav-link">행사 추천</Link>
                  <Link to="/favorite-events" className="nav-link">내가 찜한 행사</Link>
                </>
              )}
              
              {userType === 'organizer' && (
                // 축제 주최자 메뉴
                <>
                  <Link to="/foodtruck-overview" className="nav-link">푸드트럭 찾기</Link>
                  <Link to="/event-map" className="nav-link">내 축제</Link>
                </>
              )}
              
              {userType === 'consumer' && (
                // 소비자 메뉴
                <>
                  <Link to="/event-map" className="nav-link">행사 지도</Link>
                  <Link to="/event-reviews" className="nav-link">행사 리뷰</Link>
                </>
              )}
              
              <span className="nav-link">마이페이지</span>
              <button 
                onClick={logout} 
                className="nav-link signup-btn" 
                style={{ cursor: 'pointer', border: 'none' }}
              >
                로그아웃
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;