import { createSlice } from "@reduxjs/toolkit";

const initialData = {
  active: 0,
};

const vendorDetailsPageSlice = createSlice({
  name: "vendorDetailsPageSlice",
  initialState: initialData,
  reducers: {
    setActiveVendorDetails: (state, { payload }) => {
      state.active = payload;
    },
  },
});

export const { setActiveVendorDetails } = vendorDetailsPageSlice.actions;

export default vendorDetailsPageSlice;
