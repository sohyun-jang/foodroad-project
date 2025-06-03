import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './FestivalReviewPage.css';

function FestivalReviewPage() {
  const { festivalId } = useParams();
  const [festival, setFestival] = useState(null);
  const [review, setReview] = useState({
    rating: 5,
    content: ''
  });

  useEffect(() => {
    // TODO: API 연동 - 축제 정보 가져오기
    // fetchFestivalDetails(festivalId);
  }, [festivalId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReview(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: API 연동 - 리뷰 제출
    console.log('Review submitted:', { festivalId, ...review });
  };

  if (!festival) {
    return <div>Loading...</div>;
  }

  return (
    <div className="festival-review-container">
      <h1>축제 리뷰 작성</h1>
      <div className="festival-info">
        <h2>{festival?.name}</h2>
        <p>{festival?.location}</p>
        <p>{festival?.startDate} - {festival?.endDate}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label htmlFor="rating">평점</label>
          <select
            id="rating"
            name="rating"
            value={review.rating}
            onChange={handleInputChange}
            required
          >
            <option value="5">⭐⭐⭐⭐⭐ (5점)</option>
            <option value="4">⭐⭐⭐⭐ (4점)</option>
            <option value="3">⭐⭐⭐ (3점)</option>
            <option value="2">⭐⭐ (2점)</option>
            <option value="1">⭐ (1점)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="content">리뷰 내용</label>
          <textarea
            id="content"
            name="content"
            value={review.content}
            onChange={handleInputChange}
            required
            rows="4"
            placeholder="축제에 대한 리뷰를 작성해주세요."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">리뷰 등록</button>
        </div>
      </form>
    </div>
  );
}

export default FestivalReviewPage;