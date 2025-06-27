// Frontend/src/Pages/VirtualTour.tsx
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import VirtualTourCard from '../components/VirtualTourCard/VirtualTourCard';
import VirtualTourDetail from '../components/VirtualTourDetail/VirtualTourDetail';
import type { HistoricalPlace } from '../types/virtual-tour.types';

const VirtualTour = () => {
  const [places, setPlaces] = useState<HistoricalPlace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'grid' | 'map'>('grid');
  const [selectedPlace, setSelectedPlace] = useState<HistoricalPlace | null>(null);
  const [dataSource, setDataSource] = useState<string>('');
  
  useEffect(() => {
    fetchHistoricalPlaces();
  }, []);

  const fetchHistoricalPlaces = async () => {
    setLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
      const response = await fetch(`${backendUrl}/api/v1/virtual-tour/historical-places`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data?.message || `Server returned ${response.status}`);
      }
      
      if (!data.success) {
        throw new Error('Invalid response format from server');
      }
      
      setPlaces(data.data);
      if (data.message.includes("cache")) {
        setDataSource('Redis Cache');
      } else {
        setDataSource('Google Places API');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load historical places');
      console.error('Failed to fetch historical places:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">Virtual Tour of Pakistan's Heritage</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore the rich historical and cultural landmarks of Pakistan
        </p>
        {dataSource && (
          <div className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-2">
            <span>Data source: {dataSource}</span>
          </div>
        )}
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Historical Places</h2>
      </div>
      
      {loading && (
        <div className="flex flex-col items-center justify-center my-20">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Loading historical places...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md my-4">
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && places.length === 0 && (
        <div className="text-center my-20 text-gray-500">
          <p>No historical places found.</p>
        </div>
      )}
      
      {!loading && !error && places.length > 0 && activeView === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <VirtualTourCard 
              key={place.id}
              place={place}
              onLearnMore={setSelectedPlace}
            />
          ))}
        </div>
      )}
      
      {!loading && !error && places.length > 0 && activeView === 'map' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-md p-4 h-[600px]">
          <div className="text-center h-full flex items-center justify-center">
            <iframe
              title="Historical Places in Pakistan"
              width="100%"
              height="100%"
              frameBorder="0"
              className="border-0"
              src={`https://www.google.com/maps/embed/v1/search?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY || ''}&q=historical+places+in+pakistan&zoom=5`}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
      
      {selectedPlace && (
        <VirtualTourDetail place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}
    </div>
  );
};

export default VirtualTour;