import { api } from "../api";
import { setUser } from "./authSlice";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    registerVender: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    loginUser: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
        } catch (err) {
          console.log(err);
        }
      },
    }),

    refreshToken: builder.query({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      // async onQueryStarted(arg, { dispatch, queryFulfilled }) {
      //   try {
      //     const { data } = await queryFulfilled;
      //     dispatch(setUser(data.user));
      //   } catch (err) {
      //   } finally {
      //   }
      // },
    }),

    logout: builder.query({
      query: () => ({
        url: "/auth/logout",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useRegisterVenderMutation,
  useLoginUserMutation,
  useLogoutQuery,
  useRefreshTokenQuery,
} = authApi;
