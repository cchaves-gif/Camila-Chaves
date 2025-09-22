
import React from 'react';
import { CardInfo, CardStatus } from '../types';

interface CardProps {
  card: CardInfo;
  onCardClick: (id: number) => void;
}

const Card: React.FC<CardProps> = ({ card, onCardClick }) => {
  const isFlipped = card.status === CardStatus.VISIBLE || card.status === CardStatus.MATCHED;

  const handleClick = () => {
    if (card.status === CardStatus.HIDDEN) {
      onCardClick(card.id);
    }
  };

  return (
    <div className="w-full h-full perspective-1000" onClick={handleClick}>
      <div className={`relative w-full h-full card ${isFlipped ? 'flipped' : ''}`}>
        {/* Card Back */}
        <div className="absolute w-full h-full card-face bg-gray-700 border-2 border-gray-600 rounded-lg flex items-center justify-center p-2 cursor-pointer shadow-lg hover:border-red-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-1/2 w-1/2 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V4m0 16v-2M8 8l1.414-1.414M14.586 14.586L16 16m-2-8l1.414 1.414M8 16l-1.414 1.414M12 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </div>
        {/* Card Front */}
        <div className="absolute w-full h-full card-face card-front bg-gray-200 border-2 border-red-500 rounded-lg flex items-center justify-center overflow-hidden shadow-xl">
          <img src={card.imageUrl} alt={`card-${card.imageId}`} className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Card;
