
import { APIResponse, Game, Genre, ParentPlatform, Tag, Screenshot } from '@/types';

// Base URL and API key for RAWG API
const API_BASE_URL = 'https://api.rawg.io/api';
const API_KEY = import.meta.env.VITE_RAWG_API_KEY || 'da4774eb042246f78d2c75683f1a3151'; // Fallback for development

// Helper function to create request URLs with API key
const createApiUrl = (endpoint: string, params: Record<string, string | number | boolean | undefined | number[]> = {}) => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  url.searchParams.append('key', API_KEY);
  
  // Add all params to the URL
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      // For arrays, join them with commas
      if (Array.isArray(value)) {
        if (value.length > 0) {
          url.searchParams.append(key, value.join(','));
        }
      } else {
        url.searchParams.append(key, String(value));
      }
    }
  });
  
  return url.toString();
};

// Get list of games with filters
export const getGames = async (filters = {}) => {
  try {
    // Add default parameters to ensure we get results
    const defaultParams = {
      page_size: 12,
      ordering: '-added',
    };
    
    const mergedParams = { ...defaultParams, ...filters };
    
    // Log the URL for debugging
    const url = createApiUrl('/games', mergedParams);
    console.log('Fetching games from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error fetching games: ${response.status}`);
    }
    
    const data = await response.json() as APIResponse<Game>;
    console.log('API Response:', data);
    
    return data;
  } catch (error) {
    console.error('Failed to fetch games:', error);
    throw error;
  }
};

// Get a specific game by ID
export const getGameById = async (id: number | string) => {
  try {
    const url = createApiUrl(`/games/${id}`);
    console.log('Fetching game details from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error fetching game: ${response.status}`);
    }
    
    return await response.json() as Game;
  } catch (error) {
    console.error(`Failed to fetch game ${id}:`, error);
    throw error;
  }
};

// Get screenshots for a specific game
export const getGameScreenshots = async (id: number | string) => {
  try {
    const url = createApiUrl(`/games/${id}/screenshots`);
    console.log('Fetching game screenshots from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error fetching game screenshots: ${response.status}`);
    }
    
    return await response.json() as APIResponse<Screenshot>;
  } catch (error) {
    console.error(`Failed to fetch screenshots for game ${id}:`, error);
    throw error;
  }
};

// Get list of genres
export const getGenres = async (params = {}) => {
  try {
    const defaultParams = {
      page_size: 40, // Get a reasonable number of genres
    };
    
    const mergedParams = { ...defaultParams, ...params };
    const url = createApiUrl('/genres', mergedParams);
    console.log('Fetching genres from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error fetching genres: ${response.status}`);
    }
    
    return await response.json() as APIResponse<Genre>;
  } catch (error) {
    console.error('Failed to fetch genres:', error);
    throw error;
  }
};

// Get list of platforms
export const getPlatforms = async (params = {}) => {
  try {
    const url = createApiUrl('/platforms/lists/parents', params);
    console.log('Fetching platforms from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error fetching platforms: ${response.status}`);
    }
    
    return await response.json() as APIResponse<ParentPlatform>;
  } catch (error) {
    console.error('Failed to fetch platforms:', error);
    throw error;
  }
};

// Get list of tags
export const getTags = async (params = {}) => {
  try {
    const defaultParams = {
      page_size: 40, // Get a reasonable number of tags
    };
    
    const mergedParams = { ...defaultParams, ...params };
    const url = createApiUrl('/tags', mergedParams);
    console.log('Fetching tags from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error fetching tags: ${response.status}`);
    }
    
    return await response.json() as APIResponse<Tag>;
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    throw error;
  }
};

// Get game developers
export const getDevelopers = async (params = {}) => {
  try {
    const url = createApiUrl('/developers', params);
    console.log('Fetching developers from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error fetching developers: ${response.status}`);
    }
    
    return await response.json() as APIResponse<any>;
  } catch (error) {
    console.error('Failed to fetch developers:', error);
    throw error;
  }
};

// Get game publishers
export const getPublishers = async (params = {}) => {
  try {
    const url = createApiUrl('/publishers', params);
    console.log('Fetching publishers from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error fetching publishers: ${response.status}`);
    }
    
    return await response.json() as APIResponse<any>;
  } catch (error) {
    console.error('Failed to fetch publishers:', error);
    throw error;
  }
};

// Get game stores
export const getStores = async (params = {}) => {
  try {
    const url = createApiUrl('/stores', params);
    console.log('Fetching stores from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error fetching stores: ${response.status}`);
    }
    
    return await response.json() as APIResponse<any>;
  } catch (error) {
    console.error('Failed to fetch stores:', error);
    throw error;
  }
};
