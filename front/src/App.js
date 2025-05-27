import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EventRecommendationPage from './pages/EventRecommendationPage';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
