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
        url: "/welcome",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSendMailMutation } = informApi;
