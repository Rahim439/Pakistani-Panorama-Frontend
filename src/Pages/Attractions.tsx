import React, { useState, useEffect } from 'react';
import { RefreshCw, MapPin, Building2, UtensilsCrossed, Gamepad2, Search, X, MapPinIcon } from 'lucide-react';
import type { Attraction, AttractionCategory } from '../types/attractions.types';
import AttractionCard from '../components/AttractionCard/AttractionCard';
import AttractionDetail from '../components/AttractionDetail/AttractionDetail';
import Pagination from '../components/Pagination/Pagination';

interface PaginationInfo {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const Attractions: React.FC = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<AttractionCategory>('hotels');
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [dataSource, setDataSource] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // City filter states
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [isCityFilterOpen, setIsCityFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    setSearchQuery('');
    setIsSearching(false);
    setSelectedCity('all');
    fetchAttractions(1);
  }, [activeCategory]);

  // Separate effect for city filter changes
  useEffect(() => {
    if (selectedCity !== 'all') {
      fetchAttractions(1);
    }
  }, [selectedCity]);

  // Helper function to safely get text from object or string
  const getTextContent = (field: any): string => {
    if (typeof field === 'string') return field;
    if (typeof field === 'object' && field?.text) return field.text;
    return '';
  };

  // Fetch data for the selected category with pagination and city filter
  const fetchAttractions = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
      const endpoint = activeCategory === 'amusement_park' ? 'amusement-parks' : activeCategory;
      
      // Build query parameters including city filter
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });
      
      if (selectedCity !== 'all') {
        params.append('city', selectedCity);
        console.log(`Fetching ${endpoint} for city: ${selectedCity}`);
      }
      
      const response = await fetch(`${backendUrl}/api/v1/attractions/${endpoint}?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `Server returned ${response.status}`);
      }
      const data = await response.json();

      console.log(`Received data for ${endpoint}:`, {
        pagination: data.data?.pagination,
        cityCount: data.data?.availableCities?.length,
        resultCount: data.data?.hotels?.length || data.data?.restaurants?.length || data.data?.amusementParks?.length || 0
      });

      let attractionsData: Attraction[] = [];
      let citiesData: string[] = [];
      
      if (activeCategory === 'hotels' && data.data?.hotels) {
        attractionsData = data.data.hotels;
        setPagination(data.data.pagination);
        citiesData = data.data.availableCities || [];
      } else if (activeCategory === 'restaurants' && data.data?.restaurants) {
        attractionsData = data.data.restaurants;
        setPagination(data.data.pagination);
        citiesData = data.data.availableCities || [];
      } else if (activeCategory === 'amusement_park' && data.data?.amusementParks) {
        attractionsData = data.data.amusementParks;
        setPagination(data.data.pagination);
        citiesData = data.data.availableCities || [];
      } else {
        throw new Error('Invalid data format from server');
      }

      if (citiesData.length > 0) {
        setAvailableCities(citiesData);
        console.log(`Updated available cities: ${citiesData.length} cities found`);
      }

      setAttractions(attractionsData);
      setFilteredAttractions(attractionsData);

      if (data.message && data.message.includes("cache")) {
        setDataSource('Redis Cache');
      } else {
        setDataSource('Google Places API');
      }
    } catch (error: any) {
      console.error("Error fetching attractions:", error);
      setError(error.message || 'Failed to load attractions');
    } finally {
      setLoading(false);
    }
  };

  // Search effect: filter attractions
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const query = searchQuery.toLowerCase().trim();
      const filtered = attractions.filter(attraction => {
        const nameMatch = getTextContent(attraction.displayName).toLowerCase().includes(query);
        const addressMatch = (attraction.formattedAddress || '').toLowerCase().includes(query);
        const summaryMatch = getTextContent(attraction.editorialSummary).toLowerCase().includes(query);
        const typeMatch = getTextContent(attraction.primaryTypeDisplayName).toLowerCase().includes(query);
        
        return nameMatch || addressMatch || summaryMatch || typeMatch;
      });
      setFilteredAttractions(filtered);
    } else {
      setFilteredAttractions(attractions);
      setIsSearching(false);
    }
  }, [searchQuery, attractions]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setIsCityFilterOpen(false);
    // Clear search when changing city
    setSearchQuery('');
    setIsSearching(false);
  };

  const getCategoryInfo = (category: AttractionCategory) => {
    switch (category) {
      case 'hotels': 
        return { title: 'Hotels', icon: Building2 };
      case 'restaurants': 
        return { title: 'Restaurants', icon: UtensilsCrossed };
      case 'amusement_park': 
        return { title: 'Amusement Parks', icon: Gamepad2 };
      default: 
        return { title: 'Attractions', icon: MapPin };
    }
  };

  const getSelectedCityDisplay = () => {
    if (selectedCity === 'all') return 'All Cities';
    return selectedCity;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-500 py-16 md:py-24">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Explore Attractions in Pakistan
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Discover the finest hotels, restaurants, and entertainment venues Pakistan has to offer
            </p>
            {dataSource && (
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white">
                <span>Data source: {dataSource}</span>
                <button 
                  onClick={() => fetchAttractions(1)} 
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
        {/* Search and Filter Container */}
        <div className="max-w-4xl mx-auto -mt-10 relative z-20 mb-12">
          {/* Search box */}
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="flex items-center bg-white rounded-full shadow-xl border border-gray-200 py-3 px-6">
              <Search className="h-5 w-5 text-gray-400 mr-3" />
              <input 
                type="text" 
                placeholder={`Search ${getCategoryInfo(activeCategory).title.toLowerCase()} by name...`}
                className="flex-1 outline-none bg-transparent text-gray-800"
                aria-label={`Search ${getCategoryInfo(activeCategory).title.toLowerCase()} by name`}
                value={searchQuery}
                onChange={handleSearchChange}
                disabled={loading}
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={clearSearch}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 mr-1"
                  aria-label="Clear search"
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button 
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-full py-2 px-6 text-sm transition-colors"
                disabled={loading}
              >
                Search
              </button>
            </div>
          </form>

          {/* City Filter Dropdown */}
          {!isSearching && (
            <div className="flex flex-col items-center mt-4">
              <div className="relative w-full md:w-64">
                <button
                  onClick={() => setIsCityFilterOpen(!isCityFilterOpen)}
                  className="flex items-center justify-between w-full bg-white rounded-lg shadow-md border border-gray-200 py-3 px-4 text-left transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading || availableCities.length === 0}
                >
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="font-medium text-gray-700">
                      {selectedCity === 'all' ? 'All Cities' : selectedCity}
                    </span>
                    {selectedCity !== 'all' && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                        Filtered
                      </span>
                    )}
                  </div>
                  <svg 
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isCityFilterOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isCityFilterOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-30 max-h-60 overflow-y-auto">
                    <div className="p-2 sticky top-0 bg-white border-b border-gray-100">
                      <div className="text-xs font-medium text-gray-500 mb-1 px-2">Filter by city</div>
                      <button
                        onClick={() => handleCityChange('all')}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedCity === 'all' 
                            ? 'bg-green-50 text-green-700 font-medium' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          <span>All Cities</span>
                        </div>
                      </button>
                    </div>
                    
                    <div className="p-2">
                      {availableCities.length === 0 ? (
                        <div className="text-center py-4 text-sm text-gray-500">
                          Loading cities...
                        </div>
                      ) : (
                        availableCities.map((city) => (
                          <button
                            key={city}
                            onClick={() => handleCityChange(city)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              selectedCity === city 
                                ? 'bg-green-50 text-green-700 font-medium' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {city}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Selected city indicator below dropdown */}
              {selectedCity !== 'all' && !loading && (
                <div className="mt-3 text-sm text-gray-600 flex items-center">
                  <span>Showing {pagination?.totalItems || filteredAttractions.length} results in</span>
                  <span className="font-medium mx-1">{selectedCity}</span>
                  <button 
                    onClick={() => handleCityChange('all')}
                    className="ml-2 text-green-600 hover:text-green-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search results indicator */}
        {isSearching && (
          <div className="mb-6 flex items-center justify-between px-4">
            <div className="text-sm text-gray-600">
              {loading
                ? 'Loading all attractions for search...'
                : <>Found <span className="font-medium">{filteredAttractions.length}</span> {getCategoryInfo(activeCategory).title.toLowerCase()}
                with name containing "<span className="font-medium">{searchQuery}</span>"</>
              }
            </div>
            {!loading && (
              <button 
                onClick={clearSearch}
                className="text-sm text-green-700 hover:text-green-800 flex items-center"
              >
                <X className="h-4 w-4 mr-1" />
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Category Tabs */}
        <div className="mb-8 overflow-x-auto pb-4 no-scrollbar relative">
          <div className="flex space-x-4 justify-center">
            {(['hotels', 'restaurants', 'amusement_park'] as AttractionCategory[]).map((category) => {
              const { title, icon: IconComponent } = getCategoryInfo(category);
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  disabled={loading}
                  className={`flex items-center space-x-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 disabled:opacity-50 ${
                    isActive
                      ? 'bg-green-600 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:transform hover:scale-102'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  <span>{title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Header with results info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {(() => {
              const { title, icon: IconComponent } = getCategoryInfo(activeCategory);
              return (
                <>
                  <IconComponent className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {isSearching ? 'Search Results' : `${title} in Pakistan`}
                  </h2>
                </>
              );
            })()}
          </div>
          {!loading && !error && (
            <div className="text-sm text-gray-600">
              {isSearching 
                ? `${filteredAttractions.length} result${filteredAttractions.length !== 1 ? 's' : ''}`
                : pagination ? `${pagination.totalItems} total` : `${attractions.length} shown`
              }
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-6 text-green-700 font-medium">
              Loading amazing attractions...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-800 mb-2">Unable to load attractions</h3>
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => fetchAttractions(1)}
                className="mt-4 px-5 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredAttractions.length === 0 && (
          <div className="text-center py-32">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              {(() => {
                const { icon: IconComponent } = getCategoryInfo(activeCategory);
                return <IconComponent className="w-8 h-8 text-gray-400" />;
              })()}
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              {isSearching ? `No ${getCategoryInfo(activeCategory).title.toLowerCase()} found with that name` : `No ${getCategoryInfo(activeCategory).title.toLowerCase()} found`}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {isSearching 
                ? `We couldn't find any ${getCategoryInfo(activeCategory).title.toLowerCase()} matching "${searchQuery}". Try a different search term.`
                : selectedCity !== 'all'
                ? `We couldn't find any ${getCategoryInfo(activeCategory).title.toLowerCase()} in ${selectedCity}. Try selecting a different city.`
                : `We couldn't find any ${getCategoryInfo(activeCategory).title.toLowerCase()} in this category. Try another category or refresh the page.`
              }
            </p>
            {isSearching ? (
              <button 
                onClick={clearSearch}
                className="mt-5 px-5 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors inline-flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Search
              </button>
            ) : selectedCity !== 'all' ? (
              <button 
                onClick={() => handleCityChange('all')}
                className="mt-5 px-5 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors inline-flex items-center"
              >
                <MapPinIcon className="h-4 w-4 mr-2" />
                Show All Cities
              </button>
            ) : (
              <button 
                onClick={() => fetchAttractions(1)}
                className="mt-5 px-5 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors inline-flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            )}
          </div>
        )}

        {!loading && !error && filteredAttractions.length > 0 && (
          <>
            {/* Attractions grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAttractions.map((attraction, index) => (
                <div 
                  key={attraction.id} 
                  className="animate-fadeIn" 
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <AttractionCard 
                    attraction={attraction}
                    onClick={() => setSelectedAttraction(attraction)}
                    category={activeCategory}
                  />
                </div>
              ))}
            </div>

            {/* Backend pagination - Only show for non-search results */}
            {!isSearching && pagination && pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => fetchAttractions(page)}
                  itemsPerPage={pagination.itemsPerPage}
                  totalItems={pagination.totalItems}
                />
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Detail Modal */}
      {selectedAttraction && (
        <AttractionDetail
          attraction={selectedAttraction}
          onClose={() => setSelectedAttraction(null)}
        />
      )}

      {/* Click outside handler for city dropdown */}
      {isCityFilterOpen && (
        <div 
          className="fixed inset-0 z-20" 
          onClick={() => setIsCityFilterOpen(false)}
        />
      )}
    </div>
  );
};

export default Attractions;