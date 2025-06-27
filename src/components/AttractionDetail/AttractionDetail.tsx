import React, { useState } from 'react';
import { X, MapPin, Star, Phone, Globe, Clock, ExternalLink, ChevronLeft, ChevronRight, MapPinned, Info } from 'lucide-react';
import type { Attraction } from '../../types/attractions.types';
import { getAttractionPhotoUrls, getAttractionColor, formatPriceLevel } from '../../utils/attraction.utils';

interface AttractionDetailProps {
  attraction: Attraction;
  onClose: () => void;
}

const AttractionDetail: React.FC<AttractionDetailProps> = ({ attraction, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'map'>('info');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const photoUrls = getAttractionPhotoUrls(attraction, 5);
  const placeholderColor = getAttractionColor(attraction.id);
  
  // Handle navigation between photos
  const nextPhoto = () => {
    if (photoUrls.length > 1) {
      setCurrentPhotoIndex((prev) => (prev + 1) % photoUrls.length);
      setImageLoaded(false);
    }
  };

  const prevPhoto = () => {
    if (photoUrls.length > 1) {
      setCurrentPhotoIndex((prev) => (prev === 0 ? photoUrls.length - 1 : prev - 1));
      setImageLoaded(false);
    }
  };

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="bg-white rounded-2xl overflow-hidden max-w-[95rem] w-full h-[90vh] md:h-[95vh] flex flex-col md:flex-row shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center z-10 shadow-md transition-all hover:shadow-lg"
          aria-label="Close details"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="w-full md:w-1/2 lg:w-1/2 relative min-h-[400px] bg-gray-100 overflow-hidden">
          {activeTab === 'info' ? (
            photoUrls.length > 0 ? (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                  </div>
                )}
                <img
                  src={photoUrls[currentPhotoIndex]}
                  alt={`${attraction.displayName?.text} - Photo ${currentPhotoIndex + 1}`}
                  className={`w-full h-full object-cover hover:scale-105 transition-transform duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    const placeName = attraction.displayName?.text || 'Attraction';
                    const color = placeholderColor.substring(1);
                    e.currentTarget.src = `https://placehold.co/800x450/${color}/ffffff?text=${encodeURIComponent(placeName)}`;
                    setImageLoaded(true);
                  }}
                />
                
                {/* Navigation arrows */}
                {photoUrls.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <img
                  src={`https://placehold.co/800x600/${placeholderColor.substring(1)}/ffffff?text=${encodeURIComponent(attraction.displayName?.text || 'No Image Available')}`}
                  alt={attraction.displayName?.text || 'Attraction'}
                  className="w-full h-full object-cover"
                />
              </div>
            )
          ) : (
            <div className="w-full h-full">
              <iframe
                title={`Map of ${attraction.displayName?.text || 'destination'}`}
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY || ''}&q=${encodeURIComponent(attraction.formattedAddress || attraction.displayName?.text || '')}`}
                allowFullScreen
                loading="lazy"
                className="w-full h-full"
              ></iframe>
            </div>
          )}
          
          {/* Tabs for switching between photo and map */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full flex p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'info'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Show info"
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'map'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Show map"
            >
              Map
            </button>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 lg:w-1/2 p-8 overflow-y-auto max-h-[80vh] md:max-h-[95vh] custom-scrollbar">
          {/* Header section with name and quick actions */}
          <div className="border-b border-gray-100 pb-4 mb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-3xl font-bold text-gray-800">{attraction.displayName?.text}</h3>
              </div>
              
              {attraction.rating && (
                <div className="flex items-center text-sm bg-amber-50 px-3 py-1.5 rounded-full">
                  <Star className="h-4 w-4 mr-1.5 text-amber-500" fill="#f59e0b" />
                  <span className="font-medium">{attraction.rating}</span>
                  <span className="text-gray-500 ml-1">({attraction.userRatingCount || 0})</span>
                </div>
              )}
            </div>
            {attraction.formattedAddress && (
              <div className="flex items-center text-gray-600 mt-2">
                <MapPinned className="h-5 w-5 mr-2 flex-shrink-0 text-green-600" />
                <p className="line-clamp-2">{attraction.formattedAddress}</p>
              </div>
            )}
          </div>
          
          {/* Details section with modern card layout */}
          <div className="space-y-6">
            {/* Price level */}
            {attraction.priceLevel && (
              <div className="flex items-center">
                <span className="text-gray-700 font-medium mr-2">Price Level:</span>
                {formatPriceLevel(attraction.priceLevel)}
              </div>
            )}
            
            {/* Summary */}
            {attraction.editorialSummary && (
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="bg-green-100 rounded-full p-2 mr-2">
                    <Info className="h-4 w-4 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">About</h4>
                </div>
                <p className="text-gray-600 leading-relaxed">{attraction.editorialSummary.text}</p>
              </div>
            )}
            
            {/* Hours section */}
            {attraction.currentOpeningHours && (
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="bg-indigo-100 rounded-full p-2 mr-2">
                    <Clock className="h-4 w-4 text-indigo-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">Opening Hours</h4>
                </div>
                <div className="text-sm text-gray-600 space-y-1 pl-2">
                  {attraction.currentOpeningHours.weekdayDescriptions?.map((day, index) => (
                    <div key={index} className="py-1.5 border-b border-gray-100 last:border-b-0 flex items-center">
                      <ChevronRight className="h-3 w-3 text-gray-400 mr-1" />
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Contact & Links section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              {attraction.internationalPhoneNumber && (
                <a
                  href={`tel:${attraction.internationalPhoneNumber}`}
                  className="flex items-center gap-2.5 py-2.5 px-5 bg-white border border-gray-200 rounded-full text-gray-700 hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-sm font-medium"
                >
                  <Phone className="h-5 w-5 text-green-600" />
                  {attraction.internationalPhoneNumber}
                </a>
              )}
              
              {attraction.googleMapsUri && (
                <a
                  href={attraction.googleMapsUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 py-2.5 px-5 bg-white border border-gray-200 rounded-full text-gray-700 hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-sm font-medium"
                >
                  <Globe className="h-5 w-5 text-green-600" />
                  Google Maps
                </a>
              )}
              
              {attraction.websiteUri && (
                <a
                  href={attraction.websiteUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 py-2.5 px-5 bg-white border border-gray-200 rounded-full text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-sm font-medium"
                >
                  <ExternalLink className="h-5 w-5 text-blue-600" />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionDetail;