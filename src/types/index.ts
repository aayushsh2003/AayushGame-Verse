
// Game types from RAWG API
export interface Game {
  id: number;
  slug: string;
  name: string;
  released: string;
  tba: boolean;
  background_image: string;
  rating: number;
  rating_top: number;
  ratings: Rating[];
  ratings_count: number;
  reviews_text_count: number;
  added: number;
  added_by_status: AddedByStatus;
  metacritic: number;
  playtime: number;
  suggestions_count: number;
  updated: string;
  esrb_rating: EsrbRating | null;
  platforms: Platform[];
  parent_platforms: ParentPlatform[];
  genres: Genre[];
  stores: Store[];
  tags: Tag[];
  short_screenshots: Screenshot[];
  description_raw?: string;
}

export interface Rating {
  id: number;
  title: string;
  count: number;
  percent: number;
}

export interface AddedByStatus {
  yet: number;
  owned: number;
  beaten: number;
  toplay: number;
  dropped: number;
  playing: number;
}

export interface EsrbRating {
  id: number;
  name: string;
  slug: string;
}

export interface Platform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
  released_at: string;
  requirements?: {
    minimum?: string;
    recommended?: string;
  };
}

export interface ParentPlatform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
  games_count?: number;
  image_background?: string;
}

export interface Store {
  id: number;
  store: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  language: string;
  games_count: number;
  image_background: string;
}

export interface Screenshot {
  id: number;
  image: string;
}

export interface APIResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Filter types
export interface FilterOptions {
  platforms?: number[];
  genres?: number[];
  tags?: number[];
  dates?: string;
  ordering?: string;
  search?: string;
  page?: number;
  page_size?: number;
  rating?: number;
  metacritic?: string;
}

// Redux types
export interface FavoriteGame {
  id: number;
  name: string;
  background_image: string;
  added: string;
  rating?: number;     // Added rating field
  released?: string;   // Added released field
}
