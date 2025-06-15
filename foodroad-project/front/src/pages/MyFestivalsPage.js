import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyFestivalsPage.css';

function MyFestivalsPage() {
  const navigate = useNavigate();
  const [festivals, setFestivals] = useState([]);

  useEffect(() => {
    // TODO: API 연동 - 주최자의 축제 목록을 가져오는 로직 구현
    // 임시 데이터
    setFestivals([
      {
        id: 1,
        name: '테스트 축제 1',
        startDate: '2024-01-01',
        endDate: '2024-01-03',
        location: '서울시 강남구',
        status: '진행 예정'
      },
      // 더미 데이터...
    ]);
  }, []);

  return (
    <div className="my-festivals-container">
      <div className="my-festivals-header">
        <h1>내 축제 관리</h1>
        <button 
          onClick={() => navigate('/register-festival')} 
          className="register-btn"
        >
          새 축제 등록
        </button>
      </div>

      <div className="festivals-list">
        {festivals.map(festival => (
          <div key={festival.id} className="festival-card">
            <h3>{festival.name}</h3>
            <p>기간: {festival.startDate} ~ {festival.endDate}</p>
            <p>장소: {festival.location}</p>
            <p>상태: {festival.status}</p>
            <div className="festival-actions">
              <button onClick={() => navigate(`/festival/${festival.id}`)}>상세보기</button>
              <button onClick={() => navigate(`/festival/${festival.id}/edit`)}>수정</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyFestivalsPage;