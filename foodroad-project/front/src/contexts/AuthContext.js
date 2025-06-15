import React, { createContext, useState, useContext } from 'react';

// 인증 컨텍스트 생성
const AuthContext = createContext();

// 인증 컨텍스트 제공자 컴포넌트
export const AuthProvider = ({ children }) => {
  // 로그인 상태와 사용자 정보 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null); // 'foodtruck', 'organizer', 'consumer'
  const [userData, setUserData] = useState(null);

  // 로그인 함수
  const login = (type, data) => {
    setIsLoggedIn(true);
    setUserType(type);
    setUserData(data);
  };

  // 로그아웃 함수
  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 인증 컨텍스트 사용을 위한 커스텀 훅
export const useAuth = () => {
  return useContext(AuthContext);
};