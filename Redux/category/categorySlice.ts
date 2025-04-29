import { createSlice } from "@reduxjs/toolkit";
import { ICategoryName } from "@/app/Types/Category-Types";

interface CategoryState {
  categories: ICategoryName[];
}

const initialState: CategoryState = {
  categories: [],
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
  },
});

export const { setCategories } = categorySlice.actions;

export default categorySlice;
