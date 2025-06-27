import React from 'react';
import AttractionCard from '../AttractionCard/AttractionCard';
import type { AttractionCardProps } from '../../types/attractions.types';

const HotelCard: React.FC<AttractionCardProps> = ({ attraction, onClick, category }) => {
  return (
    <AttractionCard 
      attraction={attraction} 
      onClick={onClick} 
      category={category || "hotels"} 
    />
  );
};

export default HotelCard;