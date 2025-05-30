import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TenderState {
  tenderAdminFilter: {
    searchQuery: string;
    category: string;
    department: string;
  };
  tenderHomeFilter: {
    category: string;
    budgetRange: string;
    publishDate: string;
    sortBy: string;
  };
  activeTenderTab: "latest" | "assigned";
}

const initialState: TenderState = {
  tenderAdminFilter: {
    searchQuery: "",
    category: "",
    department: "",
  },
  tenderHomeFilter: {
    category: "",
    budgetRange: "",
    publishDate: "",
    sortBy: "",
  },
  activeTenderTab: "latest",
};

const tenderSlice = createSlice({
  name: "tenderSlice",
  initialState,
  reducers: {
    setManageTenderSearchQuery: (state, action: PayloadAction<string>) => {
      state.tenderAdminFilter.searchQuery = action.payload;
    },
    setTenderCategoryAdmin: (state, action: PayloadAction<string>) => {
      state.tenderAdminFilter.category = action.payload;
    },
    setTenderDepartmentAdmin: (state, action: PayloadAction<string>) => {
      state.tenderAdminFilter.department = action.payload;
    },
    setHomeTenderBudgetRange: (state, action: PayloadAction<string>) => {
      state.tenderHomeFilter.budgetRange = action.payload;
    },
    setHomeTenderPublishDate: (state, action: PayloadAction<string>) => {
      state.tenderHomeFilter.publishDate = action.payload;
    },
    setHomeTenderCategory: (state, action: PayloadAction<string>) => {
      state.tenderHomeFilter.category = action.payload;
    },
    setHomeTenderSortBy: (state, action: PayloadAction<string>) => {
      state.tenderHomeFilter.sortBy = action.payload;
    },
    setActiveTenderTab: (
      state,
      action: PayloadAction<"latest" | "assigned">
    ) => {
      state.activeTenderTab = action.payload;
    },
    resetTenderFilterOptions: (state) => {
      state.tenderAdminFilter.searchQuery = "";
      state.tenderAdminFilter.category = "";
      state.tenderAdminFilter.department = "";
    },
    resetHomeTenderFilterOptions: (state) => {
      state.tenderHomeFilter.category = "";
      state.tenderHomeFilter.budgetRange = "";
      state.tenderHomeFilter.publishDate = "";
      state.tenderHomeFilter.sortBy = "";
    },
  },
});

export const {
  setManageTenderSearchQuery,
  setTenderCategoryAdmin,
  setTenderDepartmentAdmin,
  setActiveTenderTab,
  resetTenderFilterOptions,
  setHomeTenderBudgetRange,
  setHomeTenderPublishDate,
  setHomeTenderCategory,
  resetHomeTenderFilterOptions,
  setHomeTenderSortBy,
} = tenderSlice.actions;

export default tenderSlice;
