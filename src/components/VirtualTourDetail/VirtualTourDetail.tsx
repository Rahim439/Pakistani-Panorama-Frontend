import React, { useState } from 'react';
import { MapPinned, Globe, Star, Phone, X, Clock, Info, MessageCircle, ExternalLink, ChevronRight, Video, Image } from 'lucide-react';
import type { HistoricalPlace } from '../../types/virtual-tour.types';
import { getPhotoUrl, getPlaceColor } from '../../utils/photo.utils';

// Static data mapping place names to YouTube video IDs - just one video per place
const placeVideoMapping: Record<string, string> = {
  "Lahore Fort": "D2Pr_RyOHpI",
  "Badshahi Mosque": "TwJoBnIxuNc",
  "Wazir Khan Mosque": "Yxt0PxOpxbA",
  "Hiran Minar Park": "D9RU_swbkgU",
  "Rohtas Fort": "pZdUCwdRPtw",
  "Makli Necropolis": "i_hTeNCsyz8",
  "Ranikot Fort": "BtUEhmgfs-Q",
  "Altit Fort": "uPqr6FvwNLo",
  "Derawar Fort": "kZvheM_YTRE",
  
};

interface VirtualTourDetailProps {
  place: HistoricalPlace;
  onClose: () => void;
}

const VirtualTourDetail: React.FC<VirtualTourDetailProps> = ({ place, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'video'>('info');
  
  // Get video for this place based on display name
  const placeName = place.displayName?.text || place.historicalInfo?.name || '';
  const videoId = placeVideoMapping[placeName];

  // Close modal when Escape key is pressed
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
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
            getPhotoUrl(place) ? (
              <img 
                src={getPhotoUrl(place) ?? undefined} 
                alt={place.displayName?.text || 'Historical place'} 
                className="w-full h-full object-cover absolute inset-0 hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  const placeName = place.displayName?.text || 'Historical Place';
                  const color = getPlaceColor(place.id);
                  e.currentTarget.src = `https://placehold.co/800x450/${color.substring(1)}/ffffff?text=${encodeURIComponent(placeName)}`;
                  e.currentTarget.onerror = null;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )
          ) : (
            <div className="w-full h-full">
              {videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`${place.displayName?.text || 'Historical Place'} Video`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-500">No video available</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="w-full md:w-1/2 lg:w-1/2 p-8 overflow-y-auto max-h-[80vh] md:max-h-[95vh] custom-scrollbar">
          {/* Header section with name and quick actions */}
          <div className="border-b border-gray-100 pb-4 mb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-3xl font-bold text-gray-800">{place.displayName?.text}</h3>
                
                {place.rating && (
                  <div className="flex items-center text-sm bg-amber-50 px-3 py-1.5 rounded-full">
                    <Star className="h-4 w-4 mr-1.5 text-amber-500" fill="#f59e0b" />
                    <span className="font-medium">{place.rating}</span>
                    <span className="text-gray-500 ml-1">({place.userRatingCount || 0})</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
              {place.formattedAddress && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.formattedAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5  rounded-full text-gray-700 transition-colors"
                    aria-label="Open in Google Maps"
                  >
                    <MapPinned className="h-7 w-7 flex-shrink-0 text-green-600" />
                  </a>
                )}
                {place.internationalPhoneNumber && (
                  <a 
                    href={`tel:${place.internationalPhoneNumber}`}
                    className=" p-2 rounded-full text-gray-700 transition-colors"
                    aria-label="Call"
                  >
                    <Phone className="h-7 w-7 text-green-600" />
                  </a>
                )}
              </div>
            </div>
            
            {/* Media toggle buttons - moved from left section */}
            <div className="mt-4 flex space-x-3">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                  activeTab === 'info' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Image className="h-4 w-4 mr-2" />
                Photo
              </button>
              {videoId && (
                <button
                  onClick={() => setActiveTab('video')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                    activeTab === 'video' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Video Tour
                </button>
              )}
            </div>
          </div>
          
          {/* Main content sections */}
          <div className="space-y-6">
            {/* About section */}
            {place.editorialSummary && (
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="bg-emerald-100 rounded-full p-2 mr-2">
                    <Info className="h-4 w-4 text-emerald-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">About</h4>
                </div>
                <p className="text-gray-600 leading-relaxed">{place.editorialSummary.text}</p>
              </div>
            )}
            
            {/* Hours section */}
            {place.currentOpeningHours && (
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="bg-indigo-100 rounded-full p-2 mr-2">
                    <Clock className="h-4 w-4 text-indigo-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">Opening Hours</h4>
                </div>
                <div className="text-sm text-gray-600 space-y-1 pl-2">
                  {place.currentOpeningHours.weekdayDescriptions?.map((day, index) => (
                    <div key={index} className="py-1.5 border-b border-gray-100 last:border-b-0 flex items-center">
                      <ChevronRight className="h-3 w-3 text-gray-400 mr-1" />
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Contact & Links section */}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTourDetail;