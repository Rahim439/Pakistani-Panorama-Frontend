import type { Nature } from '../types/nature.types';

export const getDestinationPhotoUrl = (destination: Nature): string | null => {
  try {
    if (!destination.photos || destination.photos.length === 0) {
      return null;
    }

    const photo = destination.photos[0];
    
    if (!photo || !photo.name) {
      return null;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.warn("Google Places API key is not configured");
      return null;
    }

    // Handle complete paths
    if (typeof photo.name === 'string' && photo.name.includes('places/') && photo.name.includes('/photos/')) {
      return `https://places.googleapis.com/v1/${photo.name}/media?key=${apiKey}&maxHeightPx=800`;
    }
    
    // Handle simple photo IDs
    if (typeof photo.name === 'string' && !photo.name.includes('/')) {
      return `https://places.googleapis.com/v1/places/${destination.id}/photos/${photo.name}/media?key=${apiKey}&maxHeightPx=800`;
    }
    
    // Handle partial paths
    if (typeof photo.name === 'string' && photo.name.includes('photos/')) {
      const photoId = photo.name.split('photos/')[1];
      return `https://places.googleapis.com/v1/places/${destination.id}/photos/${photoId}/media?key=${apiKey}&maxHeightPx=800`;
    }
  } catch (error) {
    console.error("Error constructing photo URL for:", destination.displayName?.text, error);
  }

  // Fallback to map image
  if (destination.location) {
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.warn("Google Places API key is not configured");
      return null;
    }
    return `https://maps.googleapis.com/maps/api/staticmap?center=${destination.location.latitude},${destination.location.longitude}&zoom=12&size=800x450&maptype=terrain&markers=color:red%7C${destination.location.latitude},${destination.location.longitude}&key=${apiKey}`;
  }
  
  return null;
};

// New function to get multiple photo URLs
export const getDestinationPhotoUrls = (destination: Nature, limit = 3): string[] => {
  if (!destination.photos || destination.photos.length === 0) {
    return [];
  }

  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.warn("Google Places API key is not configured");
    return [];
  }

  // Get up to 'limit' photos
  const urls = destination.photos.slice(0, limit).map(photo => {
    try {
      if (!photo || !photo.name) {
        return null;
      }

      // Handle complete paths
      if (typeof photo.name === 'string' && photo.name.includes('places/') && photo.name.includes('/photos/')) {
        return `https://places.googleapis.com/v1/${photo.name}/media?key=${apiKey}&maxHeightPx=800`;
      }
      
      // Handle simple photo IDs
      if (typeof photo.name === 'string' && !photo.name.includes('/')) {
        return `https://places.googleapis.com/v1/places/${destination.id}/photos/${photo.name}/media?key=${apiKey}&maxHeightPx=800`;
      }
      
      // Handle partial paths
      if (typeof photo.name === 'string' && photo.name.includes('photos/')) {
        const photoId = photo.name.split('photos/')[1];
        return `https://places.googleapis.com/v1/places/${destination.id}/photos/${photoId}/media?key=${apiKey}&maxHeightPx=800`;
      }
      
      return null;
    } catch (error) {
      console.error("Error constructing photo URL:", error);
      return null;
    }
  });

  // Type-safe filtering to remove nulls
  return urls.filter((url): url is string => url !== null);
};

export const getDestinationColor = (destinationId: string): string => {
  const colors = ['#4ade80', '#60a5fa', '#f87171', '#facc15', '#c084fc'];
  let sum = 0;
  for (let i = 0; i < destinationId.length; i++) {
    sum += destinationId.charCodeAt(i);
  }
  return colors[sum % colors.length];
};

export const getCategoryIcon = (category: string): string => {
  switch(category) {
    case 'mountains':
      return '🏔️';
    case 'valleys':
      return '🏞️';
    case 'lakes':
      return '💦';
    case 'glaciers':
      return '❄️';
    case 'waterfalls':
      return '🌊';
    case 'caves':
      return '🕳️';
    default:
      return '🗺️';
  }
};