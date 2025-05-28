import { api } from "../api";

const informApi2 = api.injectEndpoints({
  endpoints: (builder) => ({
    sendCustomMail: builder.mutation({
      query: (body) => ({
        url: "/inform/send-custom-mail",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSendCustomMailMutation } = informApi2;
