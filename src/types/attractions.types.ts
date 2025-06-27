export type AttractionCategory = 'hotels' | 'restaurants' | 'amusement_park';

export interface Attraction {
  id: string;
  displayName?: {
    text: string;
    languageCode: string;
  };
  formattedAddress?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  userRatingCount?: number;
  photos?: Array<{
    name: string;
    widthPx?: number;
    heightPx?: number;
  }>;
  editorialSummary?: {
    text: string;
    languageCode: string;
  };
  primaryTypeDisplayName?: {
    text: string;
    languageCode: string;
  };
  types?: string[];
  googleMapsUri?: string;
  websiteUri?: string;
  priceLevel?: string;
  currentOpeningHours?: {
    openNow?: boolean;
    weekdayDescriptions?: string[];
  };
  internationalPhoneNumber?: string;
}

// Add the missing AttractionCardProps interface
export interface AttractionCardProps {
  attraction: Attraction;
  onClick: (attraction: Attraction) => void;
  category?: AttractionCategory;
}

export interface PaginationInfo {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AttractionResponse {
  success: boolean;
  data: {
    hotels?: Attraction[];
    restaurants?: Attraction[];
    amusementParks?: Attraction[];
    pagination: PaginationInfo;
  };
  message: string;
}