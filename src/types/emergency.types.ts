// Frontend/src/types/emergency.types.ts
import { type ReactNode } from 'react';

export interface PlacePhoto {
    name: string;
    widthPx?: number;
    heightPx?: number;
  }
  
  export interface PlaceLocation {
    latitude: number;
    longitude: number;
  }
  
  export interface PlaceDisplayName {
    text: string;
    languageCode?: string;
  }
  
  export interface PrimaryTypeDisplayName {
    text: string;
    languageCode?: string;
  }
  
  export interface CurrentOpeningHours {
    openNow?: boolean;
    weekdayDescriptions?: string[];
  }
  
  export interface Place {
    id: string;
    displayName?: PlaceDisplayName;
    formattedAddress?: string;
    location?: PlaceLocation;
    rating?: number;
    userRatingCount?: number;
    primaryTypeDisplayName?: PrimaryTypeDisplayName;
    internationalPhoneNumber?: string;
    currentOpeningHours?: CurrentOpeningHours;
    photos?: PlacePhoto[];
  }
  
  // Define interface for the standardized API response
  export interface ApiResponse {
    statusCode: number;
    data: Place[];
    message: string;
    success: boolean;
  }
  
  export interface EmergencyCategory {
    id: string;
    name: string;
    icon: ReactNode;
    color: string;
    bgColor: string;
    hoverBg: string;
  }