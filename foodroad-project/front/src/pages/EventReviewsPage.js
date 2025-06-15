import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventReviewsPage.css';

function EventReviewsPage() {
  const [selectedFestival, setSelectedFestival] = useState(null);
  const navigate = useNavigate();

  // 예시 축제 데이터
  const festivals = [
    {
      id: 1,
      name: '서울 푸드 페스티벌 2024',
      location: '서울특별시 영등포구 여의도공원',
      startDate: '2024-03-01',
      endDate: '2024-03-03',
      image: 'https://via.placeholder.com/300x200',
      averageRating: 4.5,
      reviewCount: 128
    },
    {
      id: 2,
      name: '부산 해산물 축제',
      location: '부산광역시 해운대구 해운대해수욕장',
      startDate: '2024-04-15',
      endDate: '2024-04-17',
      image: 'https://via.placeholder.com/300x200',
      averageRating: 4.8,
      reviewCount: 256
    },
    {
      id: 3,
      name: '대구 치맥 페스티벌',
      location: '대구광역시 수성구 수성못',
      startDate: '2024-05-20',
      endDate: '2024-05-22',
      image: 'https://via.placeholder.com/300x200',
      averageRating: 4.7,
      reviewCount: 312
    }
  ];

  // 예시 리뷰 데이터
  const sampleReviews = {
    1: [
      { id: 1, username: "방문자123", rating: 5, content: "정말 맛있는 음식들이 많았어요! 특히 타코가 인상적이었습니다.", date: "2024-02-15" },
      { id: 2, username: "푸드러버", rating: 4, content: "분위기도 좋고 음식도 다양해서 좋았습니다. 다만 좀 붐비는 느낌이었어요.", date: "2024-02-14" },
      { id: 3, username: "맛집탐험가", rating: 5, content: "가족들과 함께 가기 좋은 축제였어요. 다음에도 꼭 방문하고 싶습니다!", date: "2024-02-13" }
    ],
    2: [
      { id: 1, username: "해운대주민", rating: 5, content: "신선한 해산물로 만든 요리들이 정말 맛있었어요.", date: "2024-02-15" },
      { id: 2, username: "부산여행객", rating: 4, content: "해운대 바다를 보며 먹는 해산물은 최고였습니다.", date: "2024-02-14" }
    ],
    3: [
      { id: 1, username: "치맥러버", rating: 5, content: "치킨과 맥주의 완벽한 조화! 대구의 밤이 더 특별했습니다.", date: "2024-02-15" },
      { id: 2, username: "대구시민", rating: 4, content: "다양한 치킨을 한 자리에서 맛볼 수 있어서 좋았어요.", date: "2024-02-14" }
    ]
  };

  const handleReviewClick = (festival) => {
    setSelectedFestival(festival);
  };

  const handleWriteReview = (festivalId) => {
    navigate(`/festival/${festivalId}/review`);
  };

  return (
    <div className="event-reviews-container">
      <h1>행사 리뷰</h1>
      <div className="festivals-grid">
        {festivals.map((festival) => (
          <div key={festival.id} className="festival-card" onClick={() => handleReviewClick(festival)}>
            <img src={festival.image} alt={festival.name} className="festival-image" />
            <div className="festival-info">
              <h3>{festival.name}</h3>
              <p>{festival.location}</p>
              <p>{festival.startDate} - {festival.endDate}</p>
              <div className="review-stats">
                <span>⭐ {festival.averageRating.toFixed(1)}</span>
                <span>리뷰 {festival.reviewCount}개</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedFestival && (
        <div className="review-modal-overlay" onClick={() => setSelectedFestival(null)}>
          <div className="review-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedFestival.name} 리뷰</h2>
              <button className="close-button" onClick={() => setSelectedFestival(null)}>×</button>
            </div>
            <div className="write-review-section">
              <button 
                className="write-review-button"
                onClick={() => handleWriteReview(selectedFestival.id)}
              >
                리뷰 작성하기
              </button>
            </div>
            <div className="reviews-list">
              {sampleReviews[selectedFestival.id].map(review => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <span className="username">{review.username}</span>
                    <span className="rating">{'⭐'.repeat(review.rating)}</span>
                    <span className="date">{review.date}</span>
                  </div>
                  <p className="review-content">{review.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventReviewsPage;