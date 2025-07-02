import React, { useState } from 'react';
import { MapPin, Star, Clock, Phone, ExternalLink, Heart, Share2, ArrowRight, Zap } from 'lucide-react';
import type { Attraction, AttractionCategory } from '../../types/attractions.types';
import { getAttractionPhotoUrl, getAttractionColor, formatPriceLevel } from '../../utils/attraction.utils';

interface AttractionCardProps {
  attraction: Attraction;
  onClick: (attraction: Attraction) => void;
  category?: AttractionCategory;
}

const AttractionCard: React.FC<AttractionCardProps> = ({ attraction, onClick, category }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  
  const photoUrl = getAttractionPhotoUrl(attraction);

  const handleClick = () => {
    onClick(attraction);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: attraction.displayName?.text || 'Attraction',
        text: `Check out this amazing ${category || 'attraction'}: ${attraction.displayName?.text}`,
        url: window.location.href
      });
    }
  };

  const getCategoryBadge = () => {
    if (!category) return null;
    
    const categoryConfig = {
      hotels: { label: 'Hotel', color: 'bg-blue-500', icon: '🏨' },
      restaurants: { label: 'Restaurant', color: 'bg-orange-500', icon: '🍽️' },
      amusement_park: { label: 'Fun Zone', color: 'bg-purple-500', icon: '🎢' }
    };

    const config = categoryConfig[category];
    if (!config) return null;

    return (
      <div className={`absolute top-3 left-3 ${config.color} text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 backdrop-blur-sm bg-opacity-90 z-10`}>
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </div>
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-50';
    if (rating >= 4.0) return 'text-blue-600 bg-blue-50';
    if (rating >= 3.5) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getOpenStatus = () => {
    if (attraction.currentOpeningHours?.openNow === undefined) return null;
    
    return attraction.currentOpeningHours.openNow ? (
      <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>Open</span>
      </div>
    ) : (
      <div className="flex items-center space-x-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span>Closed</span>
      </div>
    );
  };

  return (
    <div 
      className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer border border-gray-100 ${
        isHovered ? 'transform -translate-y-2 scale-105' : ''
      }`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section with Overlay Actions */}
      <div className="relative h-56 overflow-hidden">
        {photoUrl && !imageError ? (
          <>
            {/* Loading Skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse bg-[length:200%_100%] animate-shimmer" />
            )}
            
            {/* Main Image */}
            <img 
              src={photoUrl} 
              alt={attraction.displayName?.text || 'Attraction'} 
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          /* Fallback Design */
          <div 
            className="w-full h-full flex items-center justify-center text-white font-bold text-2xl relative overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${getAttractionColor(attraction.id)}dd, ${getAttractionColor(attraction.id)})`
            }}
          >
            {/* Geometric Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-white transform rotate-45"></div>
              <div className="absolute top-1/2 left-1/2 w-12 h-12 border border-white rounded-lg transform -translate-x-1/2 -translate-y-1/2 rotate-12"></div>
            </div>
            
            <span className="relative z-10">
              {attraction.displayName?.text?.substring(0, 2).toUpperCase() || 'AT'}
            </span>
          </div>
        )}

        

        {/* Action Buttons Overlay */}
        <div className={`absolute top-3 right-3 flex space-x-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
              isFavorited 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-white/90 text-gray-700 hover:bg-white hover:text-red-500'
            }`}
            aria-label="Add to favorites"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={handleShareClick}
            className="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white hover:text-blue-500 backdrop-blur-md transition-all duration-200"
            aria-label="Share attraction"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Info Overlay */}
        <div className={`absolute bottom-3 left-3 right-3 flex items-center justify-between transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          {getOpenStatus()}
          
          {attraction.priceLevel && (
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
              {formatPriceLevel(attraction.priceLevel)}
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Title and Rating Row */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors duration-200">
            {attraction.displayName?.text || 'Unnamed Attraction'}
          </h3>
          
          {attraction.rating && (
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${getRatingColor(attraction.rating)}`}>
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-semibold">{attraction.rating}</span>
              </div>
              
              {attraction.userRatingCount && (
                <span className="text-gray-500 text-sm">
                  ({attraction.userRatingCount.toLocaleString()} reviews)
                </span>
              )}
              
              {attraction.rating >= 4.5 && (
                <div className="flex items-center space-x-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                  <Zap className="w-3 h-3 fill-current" />
                  <span className="text-xs font-medium">Highly Rated</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Location */}
        {attraction.formattedAddress && (
          <div className="flex items-start space-x-2 text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm line-clamp-2 leading-relaxed">
              {attraction.formattedAddress}
            </p>
          </div>
        )}

        {/* Type/Category Info */}
        {attraction.primaryTypeDisplayName?.text && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 font-medium">
              {attraction.primaryTypeDisplayName.text}
            </span>
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            {attraction.internationalPhoneNumber && (
              <div className="flex items-center space-x-1 text-gray-500">
                <Phone className="w-4 h-4" />
                <span className="text-xs">Call</span>
              </div>
            )}
            
            {attraction.websiteUri && (
              <div className="flex items-center space-x-1 text-gray-500">
                <ExternalLink className="w-4 h-4" />
                <span className="text-xs">Website</span>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <div className="flex items-center space-x-1 text-green-600 font-medium text-sm group-hover:text-green-700 transition-colors">
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className={`absolute inset-0 rounded-2xl border-2 border-green-500 transition-opacity duration-300 pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}></div>
    </div>
  );
};

export default AttractionCard;