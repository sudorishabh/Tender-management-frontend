import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import { api } from "./api";
import { vendorSlice } from "./vendor/vendorSlice";
import tenderSlice from "./tender/tenderSlice";
import categorySlice from "./category/categorySlice";
import { informApi } from "./inform/informApi";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [informApi.reducerPath]: informApi.reducer,
    authSlice: authSlice.reducer,
    vendorSlice: vendorSlice.reducer,
    tenderSlice: tenderSlice.reducer,
    categorySlice: categorySlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware).concat(informApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// async function fetch() {
//   const response = authApi.endpoints.refreshToken.initiate({});
//   await store.dispatch(response);
// }

// fetch();
