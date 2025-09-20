import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Sweet {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface SweetsState {
  searchQuery: string;
  filteredSweets: Sweet[];
}

const initialState: SweetsState = {
  searchQuery: "",
  filteredSweets: [],
};

export const sweetsSlice = createSlice({
  name: "sweets",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilteredSweets: (state, action: PayloadAction<Sweet[]>) => {
      state.filteredSweets = action.payload.filter((sweet) =>
        sweet.name.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    },
  },
});

export const { setSearchQuery, setFilteredSweets } = sweetsSlice.actions;
export default sweetsSlice.reducer;
