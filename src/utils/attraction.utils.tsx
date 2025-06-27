import type { Attraction } from '../types/attractions.types';
import React from 'react';

/**
 * Get photo URL for an attraction from Google Places API directly
 */
export const getAttractionPhotoUrl = (attraction: Attraction): string | null => {
  if (!attraction.photos || attraction.photos.length === 0) {
    return null;
  }
  
  const photo = attraction.photos[0];
  
  if (!photo || !photo.name) {
    return null;
  }

  try {
    // Get the API key from environment variables
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      console.error("Google Places API key not found in environment variables");
      return null;
    }
    
    // Handle different photo reference formats (direct API call)
    const photoName = photo.name;
    
    // Format 1: If it has the complete path structure (new Places API)
    if (typeof photoName === 'string' && photoName.includes('places/') && photoName.includes('/photos/')) {
      return `https://places.googleapis.com/v1/${photoName}/media?key=${apiKey}&maxHeightPx=800`;
    }
    
    // Format 2: If it's just the photo ID and we need to construct using place ID
    if (attraction.id && typeof photoName === 'string' && !photoName.includes('/')) {
      return `https://places.googleapis.com/v1/places/${attraction.id}/photos/${photoName}/media?key=${apiKey}&maxHeightPx=800`;
    }
    
    // Format 3: Handle case where we have a partial path
    if (attraction.id && typeof photoName === 'string' && photoName.includes('photos/')) {
      const photoId = photoName.split('photos/')[1];
      return `https://places.googleapis.com/v1/places/${attraction.id}/photos/${photoId}/media?key=${apiKey}&maxHeightPx=800`;
    }
    
    // Legacy format or fallback for old API
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoName}&key=${apiKey}`;
  } catch (error) {
    console.error("Error constructing photo URL for:", attraction.displayName?.text, error);
    return null;
  }
};

/**
 * Get multiple photo URLs for an attraction
 */
export const getAttractionPhotoUrls = (attraction: Attraction, limit: number = 5): string[] => {
  if (!attraction.photos || attraction.photos.length === 0) {
    return [];
  }
  
  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
  
  if (!apiKey) {
    console.error("Google Places API key not found in environment variables");
    return [];
  }
  
  return attraction.photos.slice(0, limit).map(photo => {
    try {
      if (!photo || !photo.name) return null;
      
      const photoName = photo.name;
      
      // Format 1: Complete path
      if (typeof photoName === 'string' && photoName.includes('places/') && photoName.includes('/photos/')) {
        return `https://places.googleapis.com/v1/${photoName}/media?key=${apiKey}&maxHeightPx=800`;
      }
      
      // Format 2: Simple ID with place ID
      if (attraction.id && typeof photoName === 'string' && !photoName.includes('/')) {
        return `https://places.googleapis.com/v1/places/${attraction.id}/photos/${photoName}/media?key=${apiKey}&maxHeightPx=800`;
      }
      
      // Format 3: Partial path
      if (attraction.id && typeof photoName === 'string' && photoName.includes('photos/')) {
        const photoId = photoName.split('photos/')[1];
        return `https://places.googleapis.com/v1/places/${attraction.id}/photos/${photoId}/media?key=${apiKey}&maxHeightPx=800`;
      }
      
      // Legacy format
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoName}&key=${apiKey}`;
    } catch (error) {
      console.error("Error in getAttractionPhotoUrls:", error);
      return null;
    }
  }).filter(Boolean) as string[];
};

/**
 * Generate a deterministic color based on ID for placeholder image
 */
export const getAttractionColor = (id: string): string => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

/**
 * Format price level for display
 * Fixed: Changed JSX.Element to React.ReactElement to resolve namespace issue
 */
export const formatPriceLevel = (priceLevel: string | null): React.ReactElement | null => {
  if (!priceLevel) return null;
  
  const level = parseInt(priceLevel);
  if (isNaN(level)) return null;
  
  return (
    <div className="flex">
      {Array.from({ length: level }, (_, i) => (
        <span key={i} className="text-green-600 text-sm">$</span>
      ))}
      {Array.from({ length: 4 - level }, (_, i) => (
        <span key={i} className="text-gray-300 text-sm">$</span>
      ))}
    </div>
  );
};

/**
 * Get category icon for attraction type
 */
export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'hotels':
      return '🏨';
    case 'restaurants':
      return '🍽️';
    case 'amusement_park':
      return '🎢';
    default:
      return '📍';
  }
};