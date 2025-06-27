import React, { useState, useEffect } from 'react';
import { MapPinned, Globe, Star, X, Info, ExternalLink, ChevronRight, ChevronLeft, Image as ImageIcon, MessageSquare, BookOpen } from 'lucide-react';
import type { Nature } from '../../types/nature.types';
import { getDestinationPhotoUrl, getDestinationColor, getDestinationPhotoUrls } from '../../utils/nature.utils';

interface NatureDetailProps {
  destination: Nature;
  onClose: () => void;
}

const NatureDetail: React.FC<NatureDetailProps> = ({ destination, onClose }) => {
  const [mediaType, setMediaType] = useState<'photo' | 'map'>('photo');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about');
  
  // Get all available photo URLs (up to 5)
  const photoUrls = React.useMemo(() => 
    getDestinationPhotoUrls(destination, 5),
    [destination]
  );
  
  // Reset photo index when destination changes
  useEffect(() => {
    setCurrentPhotoIndex(0);
    setIsImageLoaded(false);
    setActiveTab('about');
  }, [destination.id]);
  
  // Add keyboard navigation for photos
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mediaType !== 'photo' || photoUrls.length <= 1) return;
      
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mediaType, photoUrls.length]);
  
  // DEBUG - Log destination data to help troubleshoot
  useEffect(() => {
    console.log("Destination data:", destination);
    console.log("Generative Summary:", destination.generativeSummary);
    console.log("Review Summary:", destination.reviewSummary);
  }, [destination]);
  
  const nextPhoto = () => {
    if (photoUrls.length > 1) {
      setCurrentPhotoIndex((prev) => (prev + 1) % photoUrls.length);
      setIsImageLoaded(false);
    }
  };
  
  const prevPhoto = () => {
    if (photoUrls.length > 1) {
      setCurrentPhotoIndex((prev) => (prev === 0 ? photoUrls.length - 1 : prev - 1));
      setIsImageLoaded(false);
    }
  };

  // Check if we have any of the new summary fields - FIXED FOR PROPER NESTED STRUCTURE
  const hasGenerativeSummary = !!destination.generativeSummary?.overview?.text;
  const hasReviewSummary = !!destination.reviewSummary?.text;
  const hasReviewsUri = !!destination.googleMapsLinks?.reviewsUri;

  return (
    <div className="fixed inset-0 bg-black/75 z-50 overflow-y-auto flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-100">
        {/* Header with close button */}
        <div className="p-5 md:px-8 border-b flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">{destination.displayName?.text}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Main content - scrollable */}
        <div className="overflow-y-auto flex-grow">
          {/* Media section - photo carousel or map */}
          <div className="relative aspect-[16/10] bg-gray-50 overflow-hidden">
            {mediaType === 'photo' ? (
              photoUrls.length > 0 ? (
                <div className="relative w-full h-full">
                  <img 
                    src={photoUrls[currentPhotoIndex]} 
                    alt={`${destination.displayName?.text || 'Destination'} - Photo ${currentPhotoIndex + 1}`} 
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    loading="lazy"
                    onLoad={() => setIsImageLoaded(true)}
                    onError={(e) => {
                      const placeName = destination.displayName?.text || 'Destination';
                      const color = getDestinationColor(destination.id);
                      e.currentTarget.src = `https://placehold.co/1600x600/${color.substring(1)}/ffffff?text=${encodeURIComponent(placeName)}`;
                      e.currentTarget.onerror = null;
                      setIsImageLoaded(true);
                    }}
                  />
                  
                  {/* Loading placeholder */}
                  {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  {/* Photo navigation controls */}
                  {photoUrls.length > 1 && (
                    <>
                      <button 
                        onClick={prevPhoto}
                        className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-200 opacity-70 hover:opacity-100 hover:scale-105"
                        aria-label="Previous photo"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button 
                        onClick={nextPhoto}
                        className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-200 opacity-70 hover:opacity-100 hover:scale-105"
                        aria-label="Next photo"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                      
                      {/* Modern photo counter - now at top right */}
                      <div className="absolute top-6 right-6 bg-black/50 text-white text-sm px-4 py-1.5 rounded-full backdrop-blur-sm">
                        {currentPhotoIndex + 1} / {photoUrls.length}
                      </div>
                      
                      {/* Thumbnails - small and centered at the bottom */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 justify-center">
                        {photoUrls.map((url, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setCurrentPhotoIndex(index);
                              setIsImageLoaded(false);
                            }}
                            className={`relative h-12 w-16 md:h-14 md:w-20 rounded overflow-hidden border-2 transition-all duration-300 flex-shrink-0
                              ${index === currentPhotoIndex 
                                ? 'border-white shadow-lg scale-110' 
                                : 'border-transparent opacity-70 hover:opacity-100'}`}
                            aria-label={`View photo ${index + 1}`}
                          >
                            <img 
                              src={url} 
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon className="h-16 w-16 mb-3 opacity-30" />
                  <span className="text-base">No images available</span>
                </div>
              )
            ) : (
              <div className="w-full h-full">
                <iframe
                  title={`Map of ${destination.displayName?.text || 'destination'}`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY || ''}&q=${encodeURIComponent(destination.formattedAddress || destination.displayName?.text || '')}`}
                  allowFullScreen
                  loading="lazy"
                  className="bg-gray-100"
                ></iframe>
              </div>
            )}
            
            {/* Media toggle buttons */}
            <div className="absolute top-6 left-6 flex shadow-md rounded-full overflow-hidden z-10">
              <button 
                className={`px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  mediaType === 'photo' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMediaType('photo')}
                aria-label="Show photo"
              >
                Photos
              </button>
              <button
                className={`px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  mediaType === 'map' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMediaType('map')}
                aria-label="Show map"
              >
                Map
              </button>
            </div>
          </div>
          
          {/* Details section with modern card layout */}
          <div className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{destination.displayName?.text}</h3>
                {destination.formattedAddress && (
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPinned className="h-5 w-5 mr-2 flex-shrink-0 text-green-600" />
                    <p className="line-clamp-2 text-base">{destination.formattedAddress}</p>
                  </div>
                )}
              </div>
              
              {destination.rating && (
                <div className="bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-lg flex items-center self-start">
                  <Star className="h-6 w-6 mr-2 text-amber-500" fill="#f59e0b" />
                  <span className="font-bold text-lg text-amber-700">{destination.rating}</span>
                  <span className="text-gray-500 text-sm ml-1.5">({destination.userRatingCount || 0} reviews)</span>
                </div>
              )}
            </div>
            
            {/* Category badge */}
            <div className="bg-green-50 border border-green-100 rounded-lg px-5 py-3.5 mb-8">
              <p className="font-medium text-lg text-green-800">
                {destination.primaryTypeDisplayName?.text || 'Natural Feature'}
              </p>
            </div>
            
            {/* Quick links row */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                {destination.googleMapsUri && (
                  <a
                    href={destination.googleMapsUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 py-2.5 px-5 bg-white border border-gray-200 rounded-full text-gray-700 hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-sm font-medium"
                  >
                    <Globe className="h-5 w-5 text-green-600" />
                    Google Maps
                  </a>
                )}
                
                {destination.websiteUri && (
                  <a
                    href={destination.websiteUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 py-2.5 px-5 bg-white border border-gray-200 rounded-full text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-sm font-medium"
                  >
                    <ExternalLink className="h-5 w-5 text-blue-600" />
                    Website
                  </a>
                )}
                
                {/* Reviews link - new */}
                {hasReviewsUri && (
                  <a
                    href={destination.googleMapsLinks?.reviewsUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 py-2.5 px-5 bg-white border border-gray-200 rounded-full text-gray-700 hover:border-amber-300 hover:bg-amber-50 transition-all duration-200 text-sm font-medium"
                  >
                    <MessageSquare className="h-5 w-5 text-amber-500" />
                    Read Reviews
                  </a>
                )}
              </div>
            </div>
            
            {/* Content tabs */}
            {(hasReviewSummary || destination.editorialSummary?.text || hasGenerativeSummary) && (
              <div className="mb-8">
                <div className="flex border-b border-gray-200 mb-6">
                  <button
                    onClick={() => setActiveTab('about')}
                    className={`py-3 px-5 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === 'about' 
                        ? 'border-green-600 text-green-700' 
                        : 'border-transparent text-gray-600 hover:text-gray-800'
                    }`}
                    aria-selected={activeTab === 'about'}
                    role="tab"
                  >
                    <div className="flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      About
                    </div>
                  </button>
                  
                  {hasReviewSummary && (
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`py-3 px-5 font-medium text-sm border-b-2 transition-colors ${
                        activeTab === 'reviews' 
                          ? 'border-green-600 text-green-700' 
                          : 'border-transparent text-gray-600 hover:text-gray-800'
                      }`}
                      aria-selected={activeTab === 'reviews'}
                      role="tab"
                    >
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Reviews
                      </div>
                    </button>
                  )}
                </div>
                
                {/* About tab content */}
                {activeTab === 'about' && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Editorial Summary */}
                    {destination.editorialSummary?.text && (
                      <div className="col-span-1 md:col-span-2">
                        <h4 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                          <Info className="h-5 w-5 mr-2.5 text-green-600" />
                          Editorial
                        </h4>
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 h-full">
                          <p className="text-gray-700 leading-relaxed text-base">
                            {destination.editorialSummary.text}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Generative Summary - FIXED to access the proper nested structure */}
                    {hasGenerativeSummary && (
                      <div className="col-span-1 md:col-span-2">
                        <h4 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                          <BookOpen className="h-5 w-5 mr-2.5 text-green-600" />
                          Details
                        </h4>
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 h-full">
                          <p className="text-gray-700 leading-relaxed text-base">
                            {destination.generativeSummary?.overview?.text}
                            {destination.generativeSummary?.disclaimerText?.text && (
                              <span className="block mt-2 text-xs text-gray-500 italic">
                                {destination.generativeSummary.disclaimerText.text}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* If neither summary exists, show fallback */}
                    {!destination.editorialSummary?.text && !hasGenerativeSummary && (
                      <div className="col-span-1 md:col-span-4">
                        <h4 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                          <Info className="h-5 w-5 mr-2.5 text-green-600" />
                          About
                        </h4>
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                          <p className="text-gray-700 leading-relaxed text-base">
                            Explore the natural beauty of {destination.displayName?.text || 'this destination'} in Northern Pakistan. This region is known for its breathtaking landscapes and natural wonders.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Reviews tab content */}
                {activeTab === 'reviews' && hasReviewSummary && (
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <div className="flex items-center mb-4">
                      <Star className="h-5 w-5 text-amber-500 mr-2" fill="#f59e0b" />
                      <h4 className="text-lg font-semibold text-gray-800">What visitors say</h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-base">
                      {destination.reviewSummary?.text}
                    </p>
                    
                    {hasReviewsUri && (
                      <div className="mt-4">
                        <a 
                          href={destination.googleMapsLinks?.reviewsUri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 font-medium text-sm inline-flex items-center"
                        >
                          Read all reviews
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Features/tags */}
            {destination.types && destination.types.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {destination.types.map(type => (
                    <span 
                      key={type}
                      className="text-sm px-3.5 py-1.5 bg-blue-50 text-blue-700 rounded-full capitalize border border-blue-100"
                    >
                      {type.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer with action buttons */}
        <div className="p-6 md:px-10 border-t bg-gray-50">
          <div className="flex justify-between">
            <button 
              onClick={onClose}
              className="py-3 px-6 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Close
            </button>
            {destination.googleMapsUri && (
              <a
                href={destination.googleMapsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 flex items-center font-medium shadow-sm hover:shadow group"
              >
                View on Google Maps
                <ChevronRight className="h-5 w-5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NatureDetail;