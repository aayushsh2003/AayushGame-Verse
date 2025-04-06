
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FavoriteGame } from '@/types';

interface FavoritesState {
  favorites: FavoriteGame[];
}

// Get favorites from localStorage if they exist
const getFavoritesFromStorage = (): FavoriteGame[] => {
  if (typeof window === 'undefined') return [];
  
  const storedFavorites = localStorage.getItem('favorites');
  return storedFavorites ? JSON.parse(storedFavorites) : [];
};

const initialState: FavoritesState = {
  favorites: getFavoritesFromStorage(),
};

const saveFavoritesToStorage = (favorites: FavoriteGame[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<FavoriteGame>) => {
      const newFavorites = [...state.favorites, action.payload];
      state.favorites = newFavorites;
      saveFavoritesToStorage(newFavorites);
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      const newFavorites = state.favorites.filter(game => game.id !== action.payload);
      state.favorites = newFavorites;
      saveFavoritesToStorage(newFavorites);
    },
    clearFavorites: (state) => {
      state.favorites = [];
      saveFavoritesToStorage([]);
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
