import React from 'react';
import './IllustratedMap.css';

const IllustratedMap = () => {
  // 이벤트 핀 데이터 (위치는 대략적인 위치로 표현)
  const eventPins = [
    { id: 1, name: '서울 푸드 페스티벌', x: 62, y: 22, color: 'red' },
    { id: 2, name: '부산 해변 마켓', x: 75, y: 75, color: 'red' },
    { id: 3, name: '인천 크리스마스 마켓', x: 45, y: 20, color: 'yellow' },
    { id: 4, name: '대전 겨울 축제', x: 55, y: 50, color: 'red' },
    { id: 5, name: '광주 신년 푸드 페어', x: 30, y: 65, color: 'yellow' },
    { id: 6, name: '제주 감귤 축제', x: 32, y: 90, color: 'red' },
    { id: 7, name: '울산 겨울 푸드 마켓', x: 80, y: 65, color: 'yellow' },
    { id: 8, name: '대구 설맞이 축제', x: 68, y: 60, color: 'red' },
  ];

  return (
    <div className="illustrated-map-container">
      <div className="map-legend">
        <div className="legend-item">
          <div className="pin red"></div>
          <span>찜한 행사</span>
        </div>
        <div className="legend-item">
          <div className="pin yellow"></div>
          <span>참여 완료 행사</span>
        </div>
      </div>
      
      <div className="illustrated-map">
        {/* 한국 지도 SVG 배경 */}
        <svg className="korea-map" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* 간략화된 한국 지도 */}
          <path 
            d="M50,10 Q60,15 65,25 Q70,35 70,45 Q65,55 65,65 Q60,75 50,80 Q40,75 35,65 Q30,55 25,45 Q30,35 35,25 Q40,15 50,10 Z" 
            fill="#e9f5fb" 
            stroke="#a0c8e0" 
            strokeWidth="0.5"
          />
          
          {/* 주요 도시 표시 */}
          <circle cx="62" cy="22" r="1.5" fill="#2c82c9" /> {/* 서울 */}
          <circle cx="75" cy="75" r="1.5" fill="#2c82c9" /> {/* 부산 */}
          <circle cx="45" cy="20" r="1.5" fill="#2c82c9" /> {/* 인천 */}
          <circle cx="55" cy="50" r="1.5" fill="#2c82c9" /> {/* 대전 */}
          <circle cx="30" cy="65" r="1.5" fill="#2c82c9" /> {/* 광주 */}
          <circle cx="68" cy="60" r="1.5" fill="#2c82c9" /> {/* 대구 */}
          <circle cx="80" cy="65" r="1.5" fill="#2c82c9" /> {/* 울산 */}
          
          {/* 제주도 */}
          <ellipse cx="32" cy="90" rx="8" ry="3" fill="#e9f5fb" stroke="#a0c8e0" strokeWidth="0.5" />
          
          {/* 동해 텍스트 */}
          <text x="85" y="40" fontSize="3" fill="#8badc2">동해</text>
          
          {/* 서해 텍스트 */}
          <text x="15" y="40" fontSize="3" fill="#8badc2">서해</text>
          
          {/* 남해 텍스트 */}
          <text x="50" y="90" fontSize="3" fill="#8badc2">남해</text>
          
          {/* 주요 도시 이름 */}
          <text x="62" y="19" fontSize="2.5" fill="#333" textAnchor="middle">서울</text>
          <text x="75" y="72" fontSize="2.5" fill="#333" textAnchor="middle">부산</text>
          <text x="45" y="17" fontSize="2.5" fill="#333" textAnchor="middle">인천</text>
          <text x="55" y="47" fontSize="2.5" fill="#333" textAnchor="middle">대전</text>
          <text x="30" y="62" fontSize="2.5" fill="#333" textAnchor="middle">광주</text>
          <text x="68" y="57" fontSize="2.5" fill="#333" textAnchor="middle">대구</text>
          <text x="80" y="62" fontSize="2.5" fill="#333" textAnchor="middle">울산</text>
          <text x="32" y="89" fontSize="2.5" fill="#333" textAnchor="middle">제주</text>
        </svg>
        
        {/* 이벤트 핀 렌더링 */}
        {eventPins.map(pin => (
          <div 
            key={pin.id} 
            className={`map-pin ${pin.color}`}
            style={{ 
              left: `${pin.x}%`, 
              top: `${pin.y}%` 
            }}
            title={pin.name}
          />
        ))}
      </div>
      
      <div className="zoom-controls">
        <button className="zoom-button" disabled>+</button>
        <button className="zoom-button" disabled>-</button>
      </div>
      
      <div className="map-attribution">
        지도 이미지는 일러스트 형태로 제공됩니다
      </div>
    </div>
  );
};

export default IllustratedMap;
