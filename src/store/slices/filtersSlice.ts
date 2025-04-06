
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterOptions } from '@/types';

const initialState: FilterOptions = {
  platforms: [],
  genres: [],
  tags: [],
  dates: undefined,
  ordering: '-added',
  search: '',
  page: 1,
  page_size: 12,
  rating: 0
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setPlatforms: (state, action: PayloadAction<number[]>) => {
      state.platforms = action.payload;
      state.page = 1; // Reset to first page when filters change
    },
    setGenres: (state, action: PayloadAction<number[]>) => {
      state.genres = action.payload;
      state.page = 1;
    },
    setTags: (state, action: PayloadAction<number[]>) => {
      state.tags = action.payload;
      state.page = 1;
    },
    setDates: (state, action: PayloadAction<string | undefined>) => {
      state.dates = action.payload;
      state.page = 1;
    },
    setOrdering: (state, action: PayloadAction<string>) => {
      state.ordering = action.payload;
      state.page = 1;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.page_size = action.payload;
      state.page = 1;
    },
    setRating: (state, action: PayloadAction<number>) => {
      state.rating = action.payload;
      state.page = 1;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setPlatforms,
  setGenres,
  setTags,
  setDates,
  setOrdering,
  setSearch,
  setPage,
  setPageSize,
  setRating,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
