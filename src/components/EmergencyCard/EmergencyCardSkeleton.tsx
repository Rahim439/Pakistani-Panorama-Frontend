import React from 'react';

const EmergencyCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 bg-gray-200"></div>
      
      <div className="p-5">
        {/* Title placeholder */}
        <div className="h-7 w-3/4 bg-gray-200 rounded mb-4"></div>
        
        {/* Address placeholder */}
        <div className="flex items-start mb-3">
          <div className="w-5 h-5 rounded-full bg-gray-200 mr-2"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
        
        {/* Phone placeholder */}
        <div className="flex items-center mb-3">
          <div className="w-5 h-5 rounded-full bg-gray-200 mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        {/* Hours placeholder */}
        <div className="flex items-start mb-4">
          <div className="w-5 h-5 rounded-full bg-gray-200 mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        
        {/* Tags placeholder */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
          <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
          <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
        </div>
        
        {/* Button placeholder */}
        <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export default EmergencyCardSkeleton; 