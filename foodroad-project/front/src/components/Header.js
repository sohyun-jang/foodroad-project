import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { isLoggedIn, userType, userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEventRecommendations = () => {
    navigate('/event-recommendations');
  };

  const handleFavoriteEvents = () => {
    navigate('/favorite-events');
  };

  const handleFoodtruckOverview = () => {
    navigate('/foodtruck-overview');
  };

  const handleEventMap = () => {
    navigate('/event-map');
  };

  const handleEventReviews = () => {
    navigate('/event-reviews');
  };

  const handleMypage = () => {
    navigate('/mypage');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <h1>FoodRoad</h1>
          </button>
        </div>
        <nav className="nav-links">
          {!isLoggedIn ? (
            // 로그인하지 않은 경우
            <>
              <button onClick={handleLogin} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>로그인</button>
              <button onClick={handleSignup} className="nav-link signup-btn" style={{ cursor: 'pointer' }}>회원가입</button>
            </>
          ) : (
            // 로그인한 경우
            <>
              {userType === 'foodtruck' && (
                // 푸드트럭 사장님 메뉴
                <>
                  <button onClick={handleEventRecommendations} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>행사 추천</button>
                  <button onClick={handleFavoriteEvents} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>내가 찜한 행사</button>
                </>
              )}
              
              {userType === 'organizer' && (
                // 축제 주최자 메뉴
                <>
                  <button onClick={handleFoodtruckOverview} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>푸드트럭 찾기</button>
                  <button onClick={handleEventMap} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>내 축제</button>
                </>
              )}
              
              {userType === 'consumer' && (
                // 소비자 메뉴
                <>
                  <button onClick={handleEventMap} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>행사 지도</button>
                  <button onClick={handleEventReviews} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>행사 리뷰</button>
                </>
              )}
              
              <button onClick={handleMypage} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>마이페이지</button>
              <button 
                onClick={handleLogout} 
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