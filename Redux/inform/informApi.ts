import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const informApi = createApi({
  reducerPath: "informApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_EMAIL_SERVER_URL}`,
    credentials: "include" as const,
  }),
  endpoints: (builder) => ({
    sendMail: builder.mutation({
      query: (data) => ({
        url: "/send-custom-email",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSendMailMutation } = informApi;

// import { api } from "../api";

// export const informApi = api.injectEndpoints({
//   endpoints: (builder) => ({
//     sendCustomMail: builder.mutation({
//       query: (data) => ({
//         url: "/inform/send-custom-mail",
//         method: "POST",
//         body: data,
//       }),
//     }),
//   }),
// });

// export const { useSendCustomMailMutation } = informApi;
