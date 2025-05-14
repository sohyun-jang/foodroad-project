import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPages.css';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // 아이디 첫 글자에 따라 다른 사용자 유형으로 로그인
    if (userId.startsWith('a')) {
      // 푸드트럭 사장님 로그인
      login('foodtruck', { id: userId, name: '푸드트럭 사장님' });
      navigate('/');
    } else if (userId.startsWith('b')) {
      // 축제 주최자 로그인
      login('organizer', { id: userId, name: '축제 주최자' });
      navigate('/');
    } else if (userId.startsWith('c')) {
      // 소비자 로그인
      login('consumer', { id: userId, name: '일반 사용자' });
      navigate('/');
    } else {
      setError('유효하지 않은 아이디입니다. a, b, c로 시작하는 아이디를 입력해주세요.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">로그인</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userId">아이디</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              placeholder="a: 푸드트럭, b: 축제 주최자, c: 소비자"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
          <button type="submit" className="auth-button">로그인</button>
        </form>
        <div className="auth-links">
          <Link to="/forgot-password">비밀번호를 잊으셨나요?</Link>
          <p>
            계정이 없으신가요? <Link to="/signup">회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;