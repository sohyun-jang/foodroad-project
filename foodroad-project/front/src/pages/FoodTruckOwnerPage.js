import React, { useState } from 'react';
import './FoodTruckOwnerPage.css';

function FoodTruckOwnerPage() {
  const [foodTruckOwners, setFoodTruckOwners] = useState([
    {
      id: 1,
      name: '맛있는 타코',
      ownerName: '김철수',
      cuisine: '멕시칸',
      rating: 4.8,
      reviews: 156,
      image: 'https://via.placeholder.com/300x200',
      contact: '010-1234-5678',
      description: '신선한 재료로 만드는 정통 멕시칸 타코',
      availability: true
    },
    {
      id: 2,
      name: '길거리 파스타',
      ownerName: '이영희',
      cuisine: '이탈리안',
      rating: 4.6,
      reviews: 98,
      image: 'https://via.placeholder.com/300x200',
      contact: '010-2345-6789',
      description: '알덴테 파스타의 신세계',
      availability: true
    },
    {
      id: 3,
      name: '수제버거 트럭',
      ownerName: '박민수',
      cuisine: '아메리칸',
      rating: 4.7,
      reviews: 203,
      image: 'https://via.placeholder.com/300x200',
      contact: '010-3456-7890',
      description: '100% 수제 패티로 만드는 프리미엄 버거',
      availability: false
    }
  ]);

  return (
    <div className="foodtruck-owner-container">
      <h1>푸드트럭 사장님 목록</h1>
      <div className="foodtruck-grid">
        {foodTruckOwners.map((owner) => (
          <div key={owner.id} className="foodtruck-card">
            <img src={owner.image} alt={owner.name} className="foodtruck-image" />
            <div className="foodtruck-info">
              <h3>{owner.name}</h3>
              <p className="owner-name">사장님: {owner.ownerName}</p>
              <p className="cuisine-type">음식 종류: {owner.cuisine}</p>
              <div className="rating-reviews">
                <span>⭐ {owner.rating.toFixed(1)}</span>
                <span>리뷰 {owner.reviews}개</span>
              </div>
              <p className="description">{owner.description}</p>
              <p className="contact">연락처: {owner.contact}</p>
              <div className="availability-status">
                <span className={owner.availability ? 'available' : 'unavailable'}>
                  {owner.availability ? '현재 영업 가능' : '현재 영업 불가'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FoodTruckOwnerPage;