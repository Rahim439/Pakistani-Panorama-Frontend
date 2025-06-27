// Frontend/src/components/EmergencyCard/EmergencyCard.tsx
import React, { useState } from 'react';
import { MapPin, Phone, Hospital, Shield, FireExtinguisher, Clock, Navigation, ExternalLink } from 'lucide-react';
import type{ Place } from '../../types/emergency.types';

interface EmergencyCardProps {
  place: Place;
  categoryId: string;
  getPhotoUrl: (place: Place) => string | null;
  isOpen: (place: Place) => boolean;
}

const EmergencyCard: React.FC<EmergencyCardProps> = ({ 
  place, 
  categoryId, 
  getPhotoUrl,
  isOpen 
}) => {
  const photoUrl = getPhotoUrl(place);
  const isPlaceOpen = isOpen(place);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Determine background color based on category
  const getBgColor = () => 
    categoryId === 'hospital' ? 'bg-red-50' : 
    categoryId === 'police' ? 'bg-blue-50' : 
    categoryId === 'fire_station' ? 'bg-orange-50' : 'bg-green-50';
    
  // Determine text/icon color based on category
  const getTextColor = () => 
    categoryId === 'hospital' ? 'text-red-600' : 
    categoryId === 'police' ? 'text-blue-600' : 
    categoryId === 'fire_station' ? 'text-orange-600' : 'text-green-600';
  
  // Get the appropriate icon based on category
  const getCategoryIcon = () => {
    if (categoryId === 'hospital' || categoryId === 'pharmacy') {
      return <Hospital className="h-14 w-14" strokeWidth={1.5} aria-hidden="true" />;
    } else if (categoryId === 'police') {
      return <Shield className="h-14 w-14" strokeWidth={1.5} aria-hidden="true" />;
    } else {
      return <FireExtinguisher className="h-14 w-14" strokeWidth={1.5} aria-hidden="true" />;
    }
  };
  
  return (
    <div 
      key={place.id} 
      className="rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200 bg-white flex flex-col h-full"
    >
      {/* Image or icon section */}
      {photoUrl && !imageError ? (
        <div className="relative aspect-[3/2] overflow-hidden max-h-32">
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className={`absolute inset-0 ${getBgColor()} animate-pulse flex items-center justify-center`}>
              <div className={`${getTextColor()} opacity-50`}>
                {getCategoryIcon()}
              </div>
            </div>
          )}
          
          <img 
            src={photoUrl} 
            alt={place.displayName?.text || 'Location'} 
            className={`w-full h-full object-cover transition-all duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          
          {/* Simple gradient overlay */}
          {imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          )}
          
          {/* Status badge */}
          <div className="absolute top-2 right-2 z-10">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
              ${isPlaceOpen 
                ? 'bg-green-100 text-green-800 ring-1 ring-green-200' 
                : 'bg-red-100 text-red-800 ring-1 ring-red-200'}`}
            >
              {isPlaceOpen ? 'Open Now' : 'Closed'}
            </span>
          </div>
        </div>
      ) : (
        <div className={`relative aspect-[3/2] max-h-32 ${getBgColor()} flex items-center justify-center`}>
          <div className={getTextColor()}>
            {getCategoryIcon()}
          </div>
          
          {/* Status badge */}
          <div className="absolute top-2 right-2 z-10">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
              ${isPlaceOpen 
                ? 'bg-green-100 text-green-800 ring-1 ring-green-200' 
                : 'bg-red-100 text-red-800 ring-1 ring-red-200'}`}
            >
              {isPlaceOpen ? 'Open Now' : 'Closed'}
            </span>
          </div>
        </div>
      )}
      
      {/* Card content */}
      <div className="p-3 flex-grow flex flex-col">
        {/* Name and rating in a flex row */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-base text-gray-800 line-clamp-2 pr-2 flex-grow">
            {place.displayName?.text || 'Unnamed Location'}
          </h3>
          
          {/* Rating positioned to the right */}
          {place.rating && (
            <span 
              className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-medium ring-1 ring-blue-200 flex-shrink-0 whitespace-nowrap"
              aria-label={`Rating: ${place.rating} out of 5 stars from ${place.userRatingCount || 0} reviews`}
            >
              <span className="text-yellow-500 mr-0.5" aria-hidden="true">★</span>
              {place.rating} ({place.userRatingCount || 0})
            </span>
          )}
        </div>
        
        <div className="space-y-1.5 mb-3 flex-grow">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-gray-600 text-xs line-clamp-2">
              {place.formattedAddress || 'No address available'}
            </p>
          </div>
          
          {place.internationalPhoneNumber && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-gray-500 mr-2" aria-hidden="true" />
              <a 
                href={`tel:${place.internationalPhoneNumber}`} 
                className="text-green-600 hover:text-green-700 hover:underline text-xs font-medium"
                aria-label={`Call ${place.internationalPhoneNumber}`}
              >
                {place.internationalPhoneNumber}
              </a>
            </div>
          )}
          
          {place.currentOpeningHours && place.currentOpeningHours.weekdayDescriptions && 
          place.currentOpeningHours.weekdayDescriptions.length > 0 && (
            <div className="flex items-start">
              <Clock className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-xs text-gray-600 line-clamp-1">
                {place.currentOpeningHours.weekdayDescriptions[0]}
              </span>
            </div>
          )}
        </div>
        
        {place.location && (
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${place.location.latitude},${place.location.longitude}&query_place_id=${place.id}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full bg-green-600 text-white font-medium rounded-xl px-4 py-2.5 transition-all duration-200 flex items-center justify-center shadow-md relative"
            aria-label={`Get directions to ${place.displayName?.text || 'this location'}`}
          >
            <Navigation className="h-4 w-4 mr-2.5" aria-hidden="true" />
            <span className="font-medium">Get Directions</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default EmergencyCard;