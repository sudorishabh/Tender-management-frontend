import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User;
  isLoggedIn: boolean;
  isRefreshing: boolean;
}

const initialState: AuthState = {
  user: {
    id: "",
    email: "",
    role: "",
  },
  isLoggedIn: false,
  isRefreshing: true,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<User>) => {
      state.user = {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      };
      state.isLoggedIn = !!payload.id && !!payload.email;
    },
    setLogout: (state) => {
      state.user = { id: "", email: "", role: "" };
      state.isLoggedIn = false;
    },
    setIsRefreshing: (state, { payload }: PayloadAction<boolean>) => {
      state.isRefreshing = payload;
    },
  },
});

export const { setUser, setLogout, setIsRefreshing } = authSlice.actions;

export default authSlice;
