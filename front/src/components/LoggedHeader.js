import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './header.css';

const LoggedInHeader = () => {
  const { userType, logout } = useAuth();

  // 사용자 유형에 따른 카테고리 설정
  const renderCategories = () => {
    switch (userType) {
      case 'foodtruck':
        return (
          <>
            <Link to="/event-recommendations" className="nav-link">행사 추천</Link>
            <Link to="/favorite-events" className="nav-link">내가 찜한 행사</Link>
          </>
        );
      case 'organizer':
        return (
          <>
            <Link to="/event-map" className="nav-link">행사 지도</Link>
            <Link to="/foodtruck-overview" className="nav-link">푸드트럭 한 눈에 보기</Link>
          </>
        );
      case 'consumer':
        return (
          <>
            <Link to="/event-map" className="nav-link">행사 지도</Link>
            <Link to="/event-reviews" className="nav-link">행사 리뷰</Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1>FoodRoad</h1>
          </Link>
        </div>
        <nav className="categories-nav">
          {renderCategories()}
        </nav>
        <nav className="user-nav">
          <Link to="/mypage" className="nav-link">마이페이지</Link>
          <button onClick={logout} className="nav-link logout-btn">로그아웃</button>
        </nav>
      </div>
    </header>
  );
};

export default LoggedInHeader;