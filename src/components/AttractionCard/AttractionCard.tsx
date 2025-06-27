import React, { useState } from 'react';
import { MapPin, Star, Clock, Phone, ExternalLink } from 'lucide-react';
import type { Attraction, AttractionCategory } from '../../types/attractions.types';
import { getAttractionPhotoUrl, getAttractionColor, formatPriceLevel } from '../../utils/attraction.utils';

// Only fix the interface - keep everything else the same
interface AttractionCardProps {
  attraction: Attraction;
  onClick: (attraction: Attraction) => void;
  category?: AttractionCategory;
}

const AttractionCard: React.FC<AttractionCardProps> = ({ attraction, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const photoUrl = getAttractionPhotoUrl(attraction);

  // Keep your original handleClick function
  const handleClick = () => {
    onClick(attraction);
  };

  return (
    // Keep your original card design here - just paste your existing JSX
    // I'm only fixing the interface, not changing the UI
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      {/* Your original image section */}
      <div className="relative h-48 overflow-hidden">
        {photoUrl && !imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            <img 
              src={photoUrl} 
              alt={attraction.displayName?.text || 'Attraction'} 
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: getAttractionColor(attraction.id) }}
          >
            {attraction.displayName?.text?.substring(0, 2).toUpperCase() || 'AT'}
          </div>
        )}
      </div>

      {/* Your original content section */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {attraction.displayName?.text || 'Unnamed Attraction'}
        </h3>
        
        {attraction.formattedAddress && (
          <div className="flex items-start mb-2">
            <MapPin className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-gray-600 text-sm line-clamp-2">{attraction.formattedAddress}</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          {attraction.rating && (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
              <span className="text-sm font-medium">{attraction.rating}</span>
              {attraction.userRatingCount && (
                <span className="text-gray-500 text-xs ml-1">
                  ({attraction.userRatingCount})
                </span>
              )}
            </div>
          )}

          {attraction.priceLevel && (
            <div className="text-sm">
              {formatPriceLevel(attraction.priceLevel)}
            </div>
          )}
        </div>

        {attraction.currentOpeningHours?.openNow !== undefined && (
          <div className="flex items-center mt-2">
            <Clock className="w-4 h-4 text-gray-500 mr-1" />
            <span className={`text-xs ${attraction.currentOpeningHours.openNow ? 'text-green-600' : 'text-red-600'}`}>
              {attraction.currentOpeningHours.openNow ? 'Open now' : 'Closed'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttractionCard;