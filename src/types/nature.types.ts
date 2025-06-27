export interface Nature {
  id: string;
  displayName?: {
    text: string;
    languageCode?: string;
  };
  formattedAddress?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  photos?: {
    name: string;
    widthPx?: number;
    heightPx?: number;
  }[];
  rating?: number;
  userRatingCount?: number;
  editorialSummary?: {
    text: string;
  };
  // Updated structure based on actual API response
  generativeSummary?: {
    overview?: {
      text: string;
      languageCode?: string;
    };
    disclaimerText?: {
      text: string;
      languageCode?: string;
    };
    overviewFlagContentUri?: string;
  };
  reviewSummary?: {
    text: string;
  };
  primaryTypeDisplayName?: {
    text: string;
  };
  types?: string[];
  googleMapsUri?: string;
  websiteUri?: string;
  googleMapsLinks?: {
    reviewsUri?: string;
  };
}

export type DestinationCategory = 'all' | 'mountains' | 'valleys' | 'lakes' | 'glaciers' | 'waterfalls' | 'caves';