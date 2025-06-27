import React from 'react';
import { MapPin, Star, Info } from 'lucide-react';
import type { HistoricalPlace } from '../../types/virtual-tour.types';
import { getPhotoUrl, getPlaceColor } from '../../utils/photo.utils';

interface VirtualTourCardProps {
  place: HistoricalPlace;
  onLearnMore: (place: HistoricalPlace) => void;
}

const VirtualTourCard: React.FC<VirtualTourCardProps> = ({ 
  place, 
  onLearnMore 
}) => {
  return (
    <div 
      className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-[16/9] overflow-hidden min-h-[180px] bg-gray-100 flex items-center justify-center">
        {getPhotoUrl(place) ? (
          <>
            <img 
              src={getPhotoUrl(place) ?? undefined} 
              alt={place.displayName?.text || 'Historical place'} 
              className="w-full h-full object-cover absolute inset-0"
              loading="lazy"
              onError={(e) => {
                const placeName = place.displayName?.text || 'Historical Place';
                const color = getPlaceColor(place.id);
                e.currentTarget.src = `https://placehold.co/800x450/${color.substring(1)}/ffffff?text=${encodeURIComponent(placeName)}`;
                e.currentTarget.onerror = null;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="font-bold text-xl">{place.displayName?.text}</h3>
              <div className="flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{place.historicalInfo?.city || ''}</span>
              </div>
            </div>
          </>
        ) : (
          <span className="text-gray-500">No image available</span>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-3">
          {place.rating && (
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" fill="#f59e0b" />
              <span className="text-sm font-medium">{place.rating} ({place.userRatingCount || 0})</span>
            </div>
          )}
        </div>
        
        {place.editorialSummary && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{place.editorialSummary.text}</p>
        )}
        
        <div className="mt-auto flex items-center justify-between">
          <button
            onClick={() => onLearnMore(place)}
            className="text-green-600 font-medium hover:text-green-700 hover:underline text-sm flex items-center"
          >
            <Info className="h-4 w-4 mr-1" /> Learn more
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualTourCard; 