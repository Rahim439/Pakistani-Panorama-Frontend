import type { HistoricalPlace } from '../types/virtual-tour.types';

export const getPhotoUrl = (place: HistoricalPlace): string | null => {
  if (!place.photos || place.photos.length === 0) {
    return null;
  }

  const photo = place.photos[0];
  
  if (!photo || !photo.name) {
    return null;
  }

  try {
    // Handle different photo reference formats
    const photoName = photo.name;
    
    // Format 1: If it already has the complete path structure
    if (typeof photoName === 'string' && photoName.includes('places/') && photoName.includes('/photos/')) {
      return `https://places.googleapis.com/v1/${photoName}/media?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY || ''}&maxHeightPx=800`;
    }
    
    // Format 2: If it's just the photo ID and we need to construct using place ID
    if (place.id) {
      // Check if photo name itself is a complete path or just an ID
      if (typeof photoName === 'string' && !photoName.includes('/')) {
        return `https://places.googleapis.com/v1/places/${place.id}/photos/${photoName}/media?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY || ''}&maxHeightPx=800`;
      }
      
      // Format 3: Handle case where we have a partial path
      if (typeof photoName === 'string' && photoName.includes('photos/')) {
        const photoId = photoName.split('photos/')[1];
        return `https://places.googleapis.com/v1/places/${place.id}/photos/${photoId}/media?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY || ''}&maxHeightPx=800`;
      }
    }
  } catch (error) {
    console.error("Error constructing photo URL for:", place.displayName?.text, error);
  }

  // Fallback to map image
  if (place.location) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${place.location.latitude},${place.location.longitude}&zoom=16&size=800x450&maptype=roadmap&markers=color:red%7C${place.location.latitude},${place.location.longitude}&key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY || ''}`;
  }
  
  return null;
};

export const getPlaceColor = (placeId: string): string => {
  const colors = ['#4ade80', '#60a5fa', '#f87171', '#facc15', '#c084fc'];
  let sum = 0;
  for (let i = 0; i < placeId.length; i++) {
    sum += placeId.charCodeAt(i);
  }
  return colors[sum % colors.length];
}; 