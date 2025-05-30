import { api } from "../api";
import {
  ISavedTenderCard,
  ITenderCard,
  IAllTenderCard,
} from "@/Types/Tender-Types";

interface LiveTenderResponse {
  success: boolean;
  tenders: ITenderCard[];
  page: number;
  hasMore: boolean;
}

interface SavedTenderResponse {
  success: boolean;
  savedTenders: ISavedTenderCard[];
  page: number;
  hasMore: boolean;
}

interface AllTenderResponse {
  success: boolean;
  tenders: IAllTenderCard[];
  page: number;
  hasMore: boolean;
}

const tenderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createTender: builder.mutation({
      query: (data) => ({
        url: "/tender/create-tender",
        method: "POST",
        body: data,
      }),
    }),

    saveTender: builder.mutation({
      query: (data) => ({
        url: "/tender/save-tender",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SavedTenders"],
    }),

    getLiveTenders: builder.query({
      query: ({
        page = 1,
        limit = 5,
        budgetRange,
        category,
        publishDate,
        sortBy,
      }) => ({
        url: `/tender/home-latest?page=${page}&limit=${limit}&budgetRange=${budgetRange}&category=${category}&publishDate=${publishDate}&sortBy=${sortBy}`,
        method: "GET",
      }),
      serializeQueryArgs: ({ endpointName }: { endpointName: string }) => {
        return endpointName;
      },
      merge: (
        currentCache: LiveTenderResponse,
        newItems: LiveTenderResponse
      ) => {
        if (newItems.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          tenders: [...currentCache.tenders, ...newItems.tenders],
        };
      },
      forceRefetch({
        currentArg,
        previousArg,
      }: {
        currentArg?: { page: number; limit: number };
        previousArg?: { page: number; limit: number };
      }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),

    getAdminLiveTenders: builder.query({
      query: ({ search, category, department, page = 1, limit = 5 }) => ({
        url: `/tender/admin-live-tenders?query=${search}&category=${category}&department=${department}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      serializeQueryArgs: ({ endpointName }: { endpointName: string }) => {
        return endpointName;
      },
      merge: (currentCache: AllTenderResponse, newItems: AllTenderResponse) => {
        if (newItems.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          tenders: [...currentCache.tenders, ...newItems.tenders],
        };
      },
    }),

    getTenderDetails: builder.query({
      query: (id) => ({
        url: `/tender/details/${id}`,
        method: "GET",
      }),
    }),

    getSavedTender: builder.query({
      query: (id) => ({
        url: `/tender/saved/${id}`,
        method: "GET",
      }),
    }),

    getSavedTenders: builder.query({
      query: ({ page = 1, limit = 8 }) => ({
        url: `/tender/saved-tenders?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["SavedTenders"],
      serializeQueryArgs: ({ endpointName }: { endpointName: string }) => {
        return endpointName;
      },
      merge: (
        currentCache: SavedTenderResponse,
        newItems: SavedTenderResponse
      ) => {
        if (newItems.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          savedTenders: [
            ...currentCache.savedTenders,
            ...newItems.savedTenders,
          ],
        };
      },
      forceRefetch({
        currentArg,
        previousArg,
      }: {
        currentArg?: { page: number; limit: number };
        previousArg?: { page: number; limit: number };
      }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),

    getAssignedTenders: builder.query({
      query: ({ id, page = 1, limit = 5 }) => ({
        url: `/tender/assigned/${id}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      serializeQueryArgs: ({ endpointName }: { endpointName: string }) => {
        return endpointName;
      },
      merge: (
        currentCache: LiveTenderResponse,
        newItems: LiveTenderResponse
      ) => {
        if (newItems.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          tenders: [...currentCache.tenders, ...newItems.tenders],
        };
      },
      forceRefetch({
        currentArg,
        previousArg,
      }: {
        currentArg?: { page: number; limit: number };
        previousArg?: { page: number; limit: number };
      }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),

    getSearchResults: builder.query({
      query: (query) => ({
        url: `/tender/search?query=${query}`,
        method: "GET",
      }),
    }),

    deleteSavedTender: builder.mutation({
      query: (id) => ({
        url: `/tender/delete-saved/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SavedTenders"],
    }),
  }),
});

export const {
  useCreateTenderMutation,
  useSaveTenderMutation,
  useGetAdminLiveTendersQuery,
  useGetLiveTendersQuery,
  useGetTenderDetailsQuery,
  useGetSavedTenderQuery,
  useGetSavedTendersQuery,
  useGetAssignedTendersQuery,
  useGetSearchResultsQuery,
  useDeleteSavedTenderMutation,
} = tenderApi;

export default tenderApi.reducer;
