import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EventRecommendationPage from './pages/EventRecommendationPage';
import { AuthProvider } from './contexts/AuthContext';
import { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    // 초기화 작업이나 API 호출 등을 여기에 추가할 수 있습니다.
    console.log('api 연동이 시작되었습니다.');
  }, []);
  return (
      <AuthProvider>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/event-recommendations" element={<EventRecommendationPage />} />
            <Route path="/favorite-events" element={<MainPage />} /> {/* 추후 구현 */}
            <Route path="/event-map" element={<MainPage />} /> {/* 추후 구현 */}
            <Route path="/foodtruck-overview" element={<MainPage />} /> {/* 추후 구현 */}
            <Route path="/event-reviews" element={<MainPage />} /> {/* 추후 구현 */}
            <Route path="/mypage" element={<MainPage />} /> {/* 추후 구현 */}
          </Routes>
        </div>
      </AuthProvider>
  );
}

export default App;
