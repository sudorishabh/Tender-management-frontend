import { api } from "../api";

const s3FilesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getS3File: builder.query({
      query: ({
        fileName,
        fileType,
      }: {
        fileName: string;
        fileType: string;
      }) => ({
        url: `/s3-files/file-url?fileName=${fileName}&fileType=${fileType}`,
        method: "GET",
      }),
    }),
    getUploadUrl: builder.mutation({
      query: (data) => ({
        url: "/s3-files/upload-url",
        method: "POST",
        body: data,
      }),
    }),

    deleteFileUrl: builder.mutation({
      query: (data) => ({
        url: "/s3-files/delete",
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetUploadUrlMutation,
  useGetS3FileQuery,
  useDeleteFileUrlMutation,
} = s3FilesApi;
