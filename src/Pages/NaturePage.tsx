import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, MapPin, Search, Loader2, X } from 'lucide-react';
import NatureCard from '../components/NatureCard/NatureCard';
import NatureDetail from '../components/NatureDetail/NatureDetail';
import Pagination from '../components/Pagination/Pagination';
import type { Nature, DestinationCategory } from '../types/nature.types';
import { getCategoryIcon } from '../utils/nature.utils';

const ITEMS_PER_PAGE = 9; // Number of items to display per page

const NaturePage: React.FC = () => {
  const [destinations, setDestinations] = useState<Nature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Nature | null>(null);
  const [activeCategory, setActiveCategory] = useState<DestinationCategory>('all');
  const [dataSource, setDataSource] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Search functionality states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredDestinations, setFilteredDestinations] = useState<Nature[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  const categories: { id: DestinationCategory; name: string }[] = [
    { id: 'all', name: 'All Destinations' },
    { id: 'mountains', name: 'Mountains' },
    { id: 'valleys', name: 'Valleys' },
    { id: 'lakes', name: 'Lakes' },
    { id: 'glaciers', name: 'Glaciers' },
    { id: 'waterfalls', name: 'Waterfalls' },
    { id: 'caves', name: 'Caves' }
  ];
  
  useEffect(() => {
    fetchDestinations();
  }, [activeCategory]);

  // Reset to first page when changing category
  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery(''); // Clear search when category changes
    setIsSearching(false);
  }, [activeCategory]);
  
  // Filter destinations when search query changes - UPDATED TO SEARCH ONLY BY NAME
  useEffect(() => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      setFilteredDestinations(destinations);
      return;
    }
    
    setIsSearching(true);
    const query = searchQuery.toLowerCase();
    const filtered = destinations.filter(destination => {
      // Only check destination name
      return destination.displayName?.text.toLowerCase().includes(query);
    });
    
    setFilteredDestinations(filtered);
    // Reset to first page when search results change
    setCurrentPage(1);
  }, [searchQuery, destinations]);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
      const response = await fetch(`${backendUrl}/api/v1/nature/northern?category=${activeCategory}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data?.message || `Server returned ${response.status}`);
      }
      
      if (!data.success) {
        throw new Error('Invalid response format from server');
      }
      
      setDestinations(data.data);
      setFilteredDestinations(data.data); // Initialize filtered with all destinations
      if (data.message.includes("cache")) {
        setDataSource('Redis Cache');
      } else {
        setDataSource('Google Places API');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load destinations');
      console.error('Failed to fetch destinations:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Search handling functions
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Search is already handled by the useEffect
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };
  
  // Paginate the destinations
  const paginatedDestinations = useMemo(() => {
    const destinationsToUse = isSearching ? filteredDestinations : destinations;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return destinationsToUse.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [isSearching, filteredDestinations, destinations, currentPage]);
  
  const totalPages = useMemo(() => {
    const destinationsToUse = isSearching ? filteredDestinations : destinations;
    return Math.ceil(destinationsToUse.length / ITEMS_PER_PAGE);
  }, [isSearching, filteredDestinations, destinations]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the page when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Using green gradient to match Virtual Tour page */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-500 py-16 md:py-24">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Explore Northern Pakistan
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Discover breathtaking mountains, serene valleys, crystal-clear lakes, majestic glaciers, stunning waterfalls and mysterious caves
            </p>
            
            {dataSource && (
              <div className="mt-6 inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white">
                <span>Data source: {dataSource}</span>
                <button 
                  onClick={fetchDestinations} 
                  className="ml-3 p-1.5 rounded-full hover:bg-white/10 transition-colors"
                  title="Refresh data"
                  aria-label="Refresh data"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        {/* Search box - Now functional */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto -mt-10 relative z-20 mb-12">
          <div className="flex items-center bg-white rounded-full shadow-xl border border-gray-200 py-3 px-6">
            <Search className="h-5 w-5 text-gray-400 mr-3" />
            <input 
              type="text" 
              placeholder="Search destinations by name..." 
              className="w-full outline-none bg-transparent text-gray-800"
              aria-label="Search destinations by name"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={clearSearch}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 mr-1"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button 
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-full py-2 px-6 text-sm transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Search results indicator - Updated to reflect name-only search */}
        {isSearching && (
          <div className="mb-6 flex items-center justify-between px-4">
            <div className="text-sm text-gray-600">
              Found <span className="font-medium">{filteredDestinations.length}</span> destinations 
              with name containing "<span className="font-medium">{searchQuery}</span>"
            </div>
            <button 
              onClick={clearSearch}
              className="text-sm text-green-700 hover:text-green-800 flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Clear search
            </button>
          </div>
        )}

        {/* Category Filter - Updated with enhanced icons */}
        <div className="mb-12 relative">
          {/* Subtle background decoration */}
          <div className="absolute inset-x-0 h-16 -top-2 bg-gradient-to-r from-green-50/40 via-blue-50/30 to-green-50/40 rounded-2xl -z-10 blur-xl"></div>

          <div className="overflow-x-auto pb-4 pt-2 px-2 -mx-2 hide-scrollbar">
            <div className="flex gap-3 justify-start md:justify-center min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`group relative px-5 py-3 rounded-xl flex items-center transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/20 scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow border border-gray-200'
                  }`}
                >
                  <div className={`flex items-center ${activeCategory === category.id ? 'opacity-100' : 'opacity-90'}`}>
                    {/* Enhanced Icon Container */}
                    <div className={`mr-3 ${
                      activeCategory === category.id 
                        ? 'text-white' 
                        : ''
                    } transition-all duration-300`}>
                      {getCategoryIcon(category.id)}
                    </div>
                    <span className={`font-medium transition-all duration-300 ${activeCategory === category.id ? '' : 'group-hover:text-green-700'}`}>
                      {category.name}
                    </span>
                  </div>
                  
                  {/* Subtle indicator dot for active category */}
                  {activeCategory === category.id && (
                    <span className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></span>
                  )}
                  
                  {/* Hover effect overlay */}
                  <span className={`absolute inset-0 rounded-xl bg-green-300/0 transition-colors duration-300 ${activeCategory === category.id ? '' : 'group-hover:bg-green-50/30'}`}></span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Subtle scroll indicators on smaller screens */}
          <div className="md:hidden">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 bg-gradient-to-r from-white to-transparent h-full"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 bg-gradient-to-l from-white to-transparent h-full"></div>
          </div>
        </div>
      
        {/* Modern loading state - Updated colors */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="spinner"></div>
            <p className="mt-6 text-green-700 font-medium">Loading amazing destinations...</p>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-800 mb-2">Unable to load destinations</h3>
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchDestinations}
                className="mt-4 px-5 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        )}
        
        {/* Empty state - Updated to support search results */}
        {!loading && !error && paginatedDestinations.length === 0 && (
          <div className="text-center py-32">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              {isSearching ? 'No destinations found with that name' : 'No destinations found'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {isSearching 
                ? `We couldn't find any destinations named "${searchQuery}". Try a different name or check another category.` 
                : `We couldn't find any destinations in the ${activeCategory} category. Try another category or refresh the page.`
              }
            </p>
            <div className="mt-5 flex justify-center gap-4">
              {isSearching && (
                <button
                  onClick={clearSearch}
                  className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors inline-flex items-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Search
                </button>
              )}
              <button
                onClick={fetchDestinations}
                className="px-5 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors inline-flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        )}
        
        {!loading && !error && paginatedDestinations.length > 0 && (
          <>
            {/* Destinations grid with subtle animation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedDestinations.map((destination, index) => (
                <div 
                  key={destination.id} 
                  className="animate-fadeIn" 
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <NatureCard 
                    destination={destination}
                    onViewDetails={setSelectedDestination}
                  />
                </div>
              ))}
            </div>
            
            {/* Results summary with glass effect */}
            <div className="mt-12 mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="px-6 py-3 bg-white border border-gray-200 rounded-full shadow-sm">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium text-gray-900">{paginatedDestinations.length}</span> of <span className="font-medium text-gray-900">
                  {isSearching ? filteredDestinations.length : destinations.length}</span> destinations
                  {isSearching && <span className="ml-1">named "<span className="text-green-700">{searchQuery}</span>"</span>}
                </p>
              </div>
              
              {/* Pagination - Updated with blue colors from Virtual Tour */}
              {totalPages > 1 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full border border-gray-200 bg-white text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    aria-label="Previous page"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full border border-gray-200 bg-white text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    aria-label="Next page"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Footer */}
      <div className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-10 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Northern Pakistan Explorer. Data provided by Google Places API.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Images and information are for educational purposes only.
          </p>
        </div>
      </div>

      {/* Nature detail modal */}
      {selectedDestination && (
        <NatureDetail 
          destination={selectedDestination} 
          onClose={() => setSelectedDestination(null)} 
        />
      )}
    </div>
  );
};

// Add this to your global CSS
const globalStyles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
`;

export default NaturePage;