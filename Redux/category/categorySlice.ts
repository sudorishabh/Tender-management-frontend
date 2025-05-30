import { createSlice } from "@reduxjs/toolkit";
import { ICategoryName } from "@/Types/Category-Types";

interface CategoryState {
  categories: ICategoryName[];
  categorySearch: string;
}

const initialState: CategoryState = {
  categories: [],
  categorySearch: "",
};

const categorySlice = createSlice({
  name: "categorySlice",
  initialState,
  reducers: {
    setCategories: (
      state,
      { payload }: { payload: { categories: ICategoryName[] } }
    ) => {
      state.categories = payload.categories;
    },
    setCategorySearch: (state, { payload }: { payload: string }) => {
      state.categorySearch = payload;
    },
  },
});

export const { setCategories, setCategorySearch } = categorySlice.actions;

export default categorySlice;
