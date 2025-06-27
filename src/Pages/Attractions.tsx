import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, MapPin, Building2, UtensilsCrossed, Gamepad2, Search, X } from 'lucide-react';
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

const ITEMS_PER_PAGE = 20;

const Attractions: React.FC = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [allAttractions, setAllAttractions] = useState<Attraction[]>([]);
  const [allDataLoaded, setAllDataLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<AttractionCategory>('hotels');
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [dataSource, setDataSource] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    setPage(1);
    setCurrentPage(1);
    setSearchQuery('');
    setIsSearching(false);
    setAllAttractions([]);
    setAllDataLoaded(false);
    fetchAttractions(1);
  }, [activeCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  // Helper function to safely get text from object or string
  const getTextContent = (field: any): string => {
    if (typeof field === 'string') return field;
    if (typeof field === 'object' && field?.text) return field.text;
    return '';
  };

  // Fetch only current page (default) or all data (for search)
  const fetchAttractions = async (pageNumber: number = page, fetchAll: boolean = false) => {
    if (fetchAll) {
      setSearchLoading(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
      const endpoint = activeCategory === 'amusement_park' ? 'amusement-parks' : activeCategory;
      const fetchLimit = fetchAll ? 1000 : limit;
      const fetchPage = fetchAll ? 1 : pageNumber;

      const response = await fetch(`${backendUrl}/api/v1/attractions/${endpoint}?page=${fetchPage}&limit=${fetchLimit}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `Server returned ${response.status}`);
      }
      const data = await response.json();

      let attractionsData: Attraction[] = [];
      if (activeCategory === 'hotels' && data.data?.hotels) {
        attractionsData = data.data.hotels;
        if (!fetchAll) setPagination(data.data.pagination);
      } else if (activeCategory === 'restaurants' && data.data?.restaurants) {
        attractionsData = data.data.restaurants;
        if (!fetchAll) setPagination(data.data.pagination);
      } else if (activeCategory === 'amusement_park' && data.data?.amusementParks) {
        attractionsData = data.data.amusementParks;
        if (!fetchAll) setPagination(data.data.pagination);
      } else {
        throw new Error('Invalid data format from server');
      }

      if (fetchAll) {
        setAllAttractions(attractionsData);
        setAllDataLoaded(true);
      } else {
        setAttractions(attractionsData);
        setFilteredAttractions(attractionsData);
        setPage(pageNumber);
      }

      if (data.message && data.message.includes("cache")) {
        setDataSource('Redis Cache');
      } else {
        setDataSource('Google Places API');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load attractions');
    } finally {
      if (fetchAll) {
        setSearchLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Search effect: fetch all data if needed, then filter
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      setCurrentPage(1);
      if (!allDataLoaded && !searchLoading) {
        fetchAttractions(1, true);
        return;
      }
      const query = searchQuery.toLowerCase().trim();
      const filtered = allAttractions.filter(attraction => {
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
  }, [searchQuery, attractions, allAttractions, allDataLoaded, searchLoading]);

  // When all data is loaded for search, re-filter
  useEffect(() => {
    if (isSearching && searchQuery.trim() && allDataLoaded) {
      const query = searchQuery.toLowerCase().trim();
      const filtered = allAttractions.filter(attraction => {
        const nameMatch = getTextContent(attraction.displayName).toLowerCase().includes(query);
        const addressMatch = (attraction.formattedAddress || '').toLowerCase().includes(query);
        const summaryMatch = getTextContent(attraction.editorialSummary).toLowerCase().includes(query);
        const typeMatch = getTextContent(attraction.primaryTypeDisplayName).toLowerCase().includes(query);
        return nameMatch || addressMatch || summaryMatch || typeMatch;
      });
      setFilteredAttractions(filtered);
    }
  }, [allAttractions, allDataLoaded, isSearching, searchQuery]);

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

  // Paginate the attractions
  const paginatedAttractions = useMemo(() => {
    const attractionsToUse = isSearching ? filteredAttractions : attractions;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return attractionsToUse.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [isSearching, filteredAttractions, attractions, currentPage]);

  const totalPages = useMemo(() => {
    const attractionsToUse = isSearching ? filteredAttractions : attractions;
    return Math.ceil(attractionsToUse.length / ITEMS_PER_PAGE);
  }, [isSearching, filteredAttractions, attractions]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Backend pagination for non-search results
  const handleBackendPageChange = (newPage: number) => {
    if (isSearching) return;
    setPage(newPage);
    fetchAttractions(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        {/* Search box */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto -mt-10 relative z-20 mb-12">
          <div className="flex items-center bg-white rounded-full shadow-xl border border-gray-200 py-3 px-6">
            <Search className="h-5 w-5 text-gray-400 mr-3" />
            <input 
              type="text" 
              placeholder={`Search ${getCategoryInfo(activeCategory).title.toLowerCase()} by name...`}
              className="w-full outline-none bg-transparent text-gray-800"
              aria-label={`Search ${getCategoryInfo(activeCategory).title.toLowerCase()} by name`}
              value={searchQuery}
              onChange={handleSearchChange}
              disabled={searchLoading}
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={clearSearch}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 mr-1"
                aria-label="Clear search"
                disabled={searchLoading}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button 
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-full py-2 px-6 text-sm transition-colors"
              disabled={searchLoading}
            >
              Search
            </button>
          </div>
        </form>

        {/* Search results indicator */}
        {isSearching && (
          <div className="mb-6 flex items-center justify-between px-4">
            <div className="text-sm text-gray-600">
              {searchLoading
                ? 'Loading all attractions for search...'
                : <>Found <span className="font-medium">{filteredAttractions.length}</span> {getCategoryInfo(activeCategory).title.toLowerCase()}
                with name containing "<span className="font-medium">{searchQuery}</span>"</>
              }
            </div>
            {!searchLoading && (
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
                  disabled={loading || searchLoading}
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
                : `Page ${page} of ${pagination?.totalPages || 1} (${pagination?.totalItems || attractions.length} total)`
              }
            </div>
          )}
        </div>

        {/* Loading State */}
        {(loading || searchLoading) && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="spinner"></div>
            <p className="mt-6 text-green-700 font-medium">
              {searchLoading ? 'Loading all attractions for search...' : 'Loading amazing attractions...'}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && !searchLoading && (
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
        {!loading && !error && paginatedAttractions.length === 0 && (
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

        {!loading && !error && paginatedAttractions.length > 0 && (
          <>
            {/* Attractions grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedAttractions.map((attraction, index) => (
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
            
            {/* Results summary and pagination */}
            <div className="mt-12 mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="px-6 py-3 bg-white border border-gray-200 rounded-full shadow-sm">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium text-gray-900">{paginatedAttractions.length}</span> of <span className="font-medium text-gray-900">
                  {isSearching ? filteredAttractions.length : attractions.length}</span> {getCategoryInfo(activeCategory).title.toLowerCase()}
                  {isSearching && <span className="ml-1">named "<span className="text-green-700">{searchQuery}</span>"</span>}
                </p>
              </div>
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
                          ? 'bg-green-600 text-white shadow-md' 
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
            {/* Backend pagination - Only show for non-search results */}
            {!isSearching && pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handleBackendPageChange}
                itemsPerPage={pagination.itemsPerPage}
                totalItems={pagination.totalItems}
              />
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
    </div>
  );
};

export default Attractions;