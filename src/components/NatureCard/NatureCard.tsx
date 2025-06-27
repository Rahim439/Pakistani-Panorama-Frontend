import React from 'react';
import { MapPin, Star, Image, ChevronRight } from 'lucide-react';
import type { Nature } from '../../types/nature.types.ts';
import { getDestinationPhotoUrl, getDestinationColor } from '../../utils/nature.utils.ts';

interface NatureCardProps {
  destination: Nature;
  onViewDetails: (destination: Nature) => void;
}

const NatureCard: React.FC<NatureCardProps > = ({ destination, onViewDetails }) => {
  const photoCount = destination.photos?.length || 0;
  
  return (
    <div 
      className="rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 hover:translate-y-[-5px] bg-white cursor-pointer h-full flex flex-col group"
      onClick={() => onViewDetails(destination)}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {getDestinationPhotoUrl(destination) ? (
          <>
            <img 
              src={getDestinationPhotoUrl(destination) ?? undefined} 
              alt={destination.displayName?.text || 'Northern Pakistan destination'} 
              className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
              onError={(e) => {
                const placeName = destination.displayName?.text || 'Destination';
                const color = getDestinationColor(destination.id);
                e.currentTarget.src = `https://placehold.co/800x450/${color.substring(1)}/ffffff?text=${encodeURIComponent(placeName)}`;
                e.currentTarget.onerror = null;
              }}
            />
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform translate-y-0 group-hover:translate-y-[-2px] transition-transform duration-300">
              <h3 className="font-bold text-xl tracking-tight">{destination.displayName?.text}</h3>
              
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <span className="text-gray-400 font-medium">No image available</span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs px-3 py-1.5 rounded-full bg-green-50 text-green-700 font-medium border border-green-100">
            {destination.primaryTypeDisplayName?.text || 'Natural Feature'}
          </div>
          {destination.rating && (
            <div className="flex items-center text-sm bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
              <Star className="h-3.5 w-3.5 mr-1 text-amber-500" fill="#f59e0b" />
              <span className="font-medium">{destination.rating}</span>
              <span className="text-gray-500 ml-1 text-xs">({destination.userRatingCount || 0})</span>
            </div>
          )}
        </div>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-auto">
          {destination.editorialSummary?.text || 'Explore this beautiful destination in Northern Pakistan.'}
        </p>
        <div className="mt-4">
          <button 
            className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center group-hover:shadow-md"
          >
            View Details
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NatureCard;