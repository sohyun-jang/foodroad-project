import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPages.css';

const SignupPage = () => {
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  const handleUserTypeSelect = (type) => {
    setUserType(type + '-form');
  };

  const renderUserTypeSelection = () => {
    return (
      <div className="user-type-selection">
        <h2 className="auth-title">회원가입</h2>
        <p className="auth-subtitle">회원 유형을 선택해주세요</p>
        
        <div className="user-type-options">
          <div 
            className={`user-type-card ${userType === 'foodtruck' ? 'selected' : ''}`}
            onClick={() => handleUserTypeSelect('foodtruck')}
          >
            <div className="user-type-icon">🚚</div>
            <h3>푸드트럭 사장님</h3>
            <p>행사 정보를 확인하고 참여 신청하세요</p>
          </div>
          
          <div 
            className={`user-type-card ${userType === 'organizer' ? 'selected' : ''}`}
            onClick={() => handleUserTypeSelect('organizer')}
          >
            <div className="user-type-icon">🎪</div>
            <h3>행사 주최자</h3>
            <p>행사를 등록하고 푸드트럭을 모집하세요</p>
          </div>
          
          <div 
            className={`user-type-card ${userType === 'visitor' ? 'selected' : ''}`}
            onClick={() => handleUserTypeSelect('visitor')}
          >
            <div className="user-type-icon">🍽️</div>
            <h3>행사 즐기는 분</h3>
            <p>다양한 행사와 푸드트럭 정보를 확인하세요</p>
          </div>
        </div>
        

      </div>
    );
  };

  const renderSignupForm = () => {
    let formTitle = '';
    let additionalFields = null;
    
    switch(userType) {
      case 'foodtruck-form':
        formTitle = '푸드트럭 사장님 회원가입';
        additionalFields = (
          <>
            <div className="form-group">
              <label htmlFor="businessName">상호명</label>
              <input type="text" id="businessName" required />
            </div>
            <div className="form-group">
              <label htmlFor="businessNumber">사업자등록번호</label>
              <input type="text" id="businessNumber" required />
            </div>
            <div className="form-group">
              <label htmlFor="foodType">취급 음식 종류</label>
              <input type="text" id="foodType" required />
            </div>
          </>
        );
        break;
      case 'organizer-form':
        formTitle = '행사 주최자 회원가입';
        additionalFields = (
          <>
            <div className="form-group">
              <label htmlFor="organizationName">단체/기업명</label>
              <input type="text" id="organizationName" required />
            </div>
            <div className="form-group">
              <label htmlFor="businessNumber">사업자등록번호</label>
              <input type="text" id="businessNumber" required />
            </div>
            <div className="form-group">
              <label htmlFor="eventTypes">주최 행사 유형</label>
              <input type="text" id="eventTypes" placeholder="예: 축제, 마켓, 플리마켓 등" required />
            </div>
          </>
        );
        break;
      case 'visitor-form':
        formTitle = '일반 회원가입';
        additionalFields = (
          <div className="form-group">
            <label htmlFor="interests">관심 분야</label>
            <input type="text" id="interests" placeholder="예: 음식, 축제, 마켓 등" />
          </div>
        );
        break;
      default:
        return null;
    }
    
    return (
      <div className="signup-form-container">
        <h2 className="auth-title">{formTitle}</h2>
        <form className="auth-form">
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input type="text" id="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input type="email" id="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input type="password" id="password" required />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input type="password" id="confirmPassword" required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">연락처</label>
            <input type="tel" id="phone" required />
          </div>
          
          {additionalFields}
          
          <div className="form-actions">
            <button type="button" className="back-button" onClick={() => setUserType(null)}>이전</button>
            <button type="submit" className="auth-button" onClick={() => navigate('/')}>가입하기</button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="auth-container signup-container">
      <div className="auth-card signup-card">
        {!userType || !userType.includes('-form') ? renderUserTypeSelection() : renderSignupForm()}
      </div>
    </div>
  );
};

export default SignupPage;