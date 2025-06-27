// Frontend/src/Pages/Emergency.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Hospital, Shield, FireExtinguisher, MapPin, Phone, Clock, Navigation, ExternalLink } from 'lucide-react';
import type { Place, ApiResponse, EmergencyCategory } from '../types/emergency.types';
import EmergencyCard from '../components/EmergencyCard/EmergencyCard';
import EmergencyCardSkeleton from '../components/EmergencyCard/EmergencyCardSkeleton';

const Emergency = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [debug, setDebug] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [dataSource, setDataSource] = useState<string>('');

  // Using colors that match the project's green-based scheme
  const emergencyCategories: EmergencyCategory[] = [
    { 
      id: 'hospital', 
      name: 'Hospitals', 
      icon: <Hospital className="h-7 w-7" strokeWidth={1.5} />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      hoverBg: 'hover:bg-red-100'
    },
    { 
      id: 'police', 
      name: 'Police Stations', 
      icon: <Shield className="h-7 w-7" strokeWidth={1.5} />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverBg: 'hover:bg-blue-100'
    },
    { 
      id: 'fire_station', 
      name: 'Fire Stations', 
      icon: <FireExtinguisher className="h-7 w-7" strokeWidth={1.5} />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverBg: 'hover:bg-orange-100'
    },
    { 
      id: 'pharmacy', 
      name: 'Pharmacies', 
      icon: <Hospital className="h-7 w-7" strokeWidth={1.5} />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverBg: 'hover:bg-green-100'
    }
  ]

  // Move isOpen function here, before it's used in the useMemo hook
  const isOpen = (place: Place): boolean => {
    if (!place.currentOpeningHours) return false;
    return place.currentOpeningHours.openNow || false;
  };

  // Now useMemo can use the isOpen function
  const filteredResults = useMemo(() => {
    if (statusFilter === 'all') return results;
    if (statusFilter === 'open') return results.filter(place => isOpen(place));
    return results.filter(place => !isOpen(place));
  }, [results, statusFilter]);

  useEffect(() => {
    if (selectedCategory) {
      fetchNearbyPlaces();
    }
  }, [selectedCategory]);

  const fetchNearbyPlaces = async (): Promise<void> => {
    setLoading(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000, // Shorter timeout
          maximumAge: 0,
          enableHighAccuracy: true
        });
      });
      
      const { latitude, longitude } = position.coords;
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      
      console.time('apiRequest'); // Start timing
      
      try {
        const response = await fetch(`${backendUrl}/api/v1/emergency/nearby`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            latitude,
            longitude,
            type: selectedCategory,
            radius: 10000
          }),
        });
        
        console.timeEnd('apiRequest'); // End timing API request
        
        const data = await response.json();
        console.log('Data source:', data.message); // Check if from cache or API
        
        if (!response.ok) {
          throw new Error(data?.message || `Server returned ${response.status}`);
        }
        
        if (!data.success || !Array.isArray(data.data)) {
          throw new Error('Invalid response format from server');
        }
        
        // Pre-process data before setting state to minimize render work
        const processedResults = data.data.map((place: Place) => ({
          ...place,
          isOpenNow: place.currentOpeningHours?.openNow || false,
          photoUrl: place.photos?.length ? getPhotoUrl(place) : null
        }));
        
        console.time('stateUpdate');
        setResults(processedResults);
        setLoading(false); // Move this here for immediate UI update
        console.timeEnd('stateUpdate');
        
        if (data.message.includes("cache")) {
          setDataSource('Redis Cache');
        } else {
          setDataSource('Google Places API');
        }
        
      } catch (fetchError: any) {
        throw fetchError;
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred while fetching nearby places');
      setLoading(false); // Make sure we stop loading on error
    }
  };

  const getPhotoUrl = (place: Place): string | null => {
    if (place.photos && place.photos.length > 0) {
      const photoReference = place.photos[0].name;
      return `https://places.googleapis.com/v1/${photoReference}/media?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY || ''}&maxHeightPx=400`;
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Emergency Help</h1>
        <p className="text-gray-600 max-w-xl mx-auto">Find nearby emergency services based on your current location</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Select Emergency Service</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {emergencyCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`group relative flex flex-col items-center rounded-lg overflow-hidden transition-all duration-300 
                ${selectedCategory === category.id 
                  ? `${category.color} ${category.bgColor} shadow-sm border border-${category.color.replace('text-', '')}/30` 
                  : 'bg-white border border-gray-100 hover:bg-gray-50'}`}
            >
              {/* Top accent */}
              <div 
                className={`absolute top-0 left-0 right-0 h-0.5 ${category.color.replace('text-', 'bg-')}/60`} 
              />
              
              <div className="p-2 flex flex-col items-center w-full">
                {/* Icon with background */}
                <div 
                  className={`relative flex items-center justify-center w-10 h-10 mb-1.5 rounded-full 
                    ${selectedCategory === category.id 
                      ? `${category.bgColor} ${category.color}` 
                      : `bg-gray-50 ${category.color}`}
                    transition-all duration-300 group-hover:${category.bgColor}`}
                >
                  {/* Smaller icon */}
                  {React.isValidElement(category.icon) 
                    ? React.cloneElement(category.icon as React.ReactElement<any>, { 
                        className: "h-5 w-5", 
                        strokeWidth: 1.5 
                      })
                    : category.icon
                  }
                </div>
                
                {/* Category name - smaller */}
                <h3 className={`font-medium text-xs text-center leading-tight transition-colors duration-300
                  ${selectedCategory === category.id 
                    ? category.color
                    : 'text-gray-800 group-hover:' + category.color}`}
                >
                  {category.name}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filter options */}
      {selectedCategory && results.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2 text-gray-800">Filter Results</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${statusFilter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All
            </button>
            <button 
              onClick={() => setStatusFilter('open')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${statusFilter === 'open' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Open Now
            </button>
            <button 
              onClick={() => setStatusFilter('closed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${statusFilter === 'closed' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Closed
            </button>
          </div>
        </div>
      )}

      {/* Results section */}
      {selectedCategory && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {loading ? 'Searching...' : (
              results.length 
                ? `Nearby ${emergencyCategories.find(c => c.id === selectedCategory)?.name || 'Places'}` 
                : error 
                  ? 'Error' 
                  : 'No Results'
            )}
          </h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, index) => (
                <EmergencyCardSkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              <p className="flex items-center">
                <span className="mr-2">⚠️</span> {error}
              </p>
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map((place) => (
                <EmergencyCard
                  key={place.id}
                  place={place}
                  categoryId={selectedCategory}
                  getPhotoUrl={getPhotoUrl}
                  isOpen={isOpen}
                />
              ))}
            </div>
          ) : selectedCategory ? (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4">
              <p className="flex items-center">
                <span className="mr-2">ℹ️</span> No {emergencyCategories.find(c => c.id === selectedCategory)?.name.toLowerCase()} found nearby.
              </p>
            </div>
          ) : null}
        </div>
      )}

      {!selectedCategory && (
        <div className="text-center py-12 text-gray-500">
          <p>Please select an emergency service category above to find nearby locations</p>
        </div>
      )}

      {dataSource && (
        <div className="text-xs text-gray-500 mb-4">
          Data source: {dataSource} | Loaded at: {new Date().toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default Emergency;