import { IVendorsTable } from "@/app/Types/Vender-Types";
import { api } from "../api";

interface VendorResponse {
  success: boolean;
  vendors: IVendorsTable[];
  totalVendors: number;
  hasMore: boolean;
  page: number;
}

export interface VendorCategory {
  id: string;
  fullname: string;
  email: string;
  status: string;
  createdAt: string;
  businessName: string;
  businessClassification: string;
  city: string;
}

interface CategoryVendorResponse {
  success: boolean;
  vendors: VendorCategory[];
  totalVendors: number;
  hasMore: boolean;
  page: number;
}
const vendorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/vendor/all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      serializeQueryArgs: ({ endpointName }: { endpointName: string }) => {
        return endpointName;
      },
      merge: (currentCache: VendorResponse, newItems: VendorResponse) => {
        if (newItems.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          vendors: [...currentCache.vendors, ...newItems.vendors],
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
      providesTags: ["get_vendors"],
    }),
    getVendorDetails: builder.query({
      query: (id) => ({
        url: `/vendor/details/${id}`,
        method: "GET",
      }),
      providesTags: ["get_vendor_details"],
    }),

    getCategoryVendors: builder.query({
      query: ({ id, page = 1, limit = 10 }) => ({
        url: `/vendor/category/${id}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      serializeQueryArgs: ({ endpointName }: { endpointName: string }) => {
        return endpointName;
      },
      merge: (
        currentCache: CategoryVendorResponse,
        newItems: CategoryVendorResponse
      ) => {
        if (newItems.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          vendors: [...currentCache.vendors, ...newItems.vendors],
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
      // providesTags: ["get_category_vendors"],
    }),

    getVendorsForSelection: builder.query({
      query: (params) => {
        const { categories, search } = params || {};
        const queryParams = new URLSearchParams();

        if (categories && categories.length > 0) {
          queryParams.append("categories", JSON.stringify(categories));
        }

        if (search) {
          queryParams.append("search", search);
        }

        return {
          url: `/vendor/selection?${queryParams.toString()}`,
          method: "GET",
        };
      },
    }),

    uploadVendorByAdmin: builder.mutation({
      query: (data) => ({
        url: "/vendor/vendor-update-by-admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["get_vendor_details", "get_vendors"],
    }),

    // Get vendor dashboard statistics
    getVendorDashboardStats: builder.query({
      query: () => ({
        url: "/vendor/dashboard/stats",
        method: "GET",
      }),
    }),

    // Get purchased tenders
    getVendorPurchasedTenders: builder.query({
      query: () => ({
        url: "/vendor/dashboard/purchased-tenders",
        method: "GET",
      }),
    }),

    // Get qualified tenders
    getVendorQualifiedTenders: builder.query({
      query: () => ({
        url: "/vendor/dashboard/qualified-tenders",
        method: "GET",
      }),
    }),

    // Get participated tenders
    getVendorParticipatedTenders: builder.query({
      query: () => ({
        url: "/vendor/dashboard/participated-tenders",
        method: "GET",
      }),
    }),

    // Get vendor bids
    getVendorBids: builder.query({
      query: () => ({
        url: "/vendor/dashboard/bids",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useGetVendorDetailsQuery,
  useUploadVendorByAdminMutation,
  useGetCategoryVendorsQuery,
  useGetVendorsForSelectionQuery,
  useGetVendorDashboardStatsQuery,
  useGetVendorPurchasedTendersQuery,
  useGetVendorQualifiedTendersQuery,
  useGetVendorParticipatedTendersQuery,
  useGetVendorBidsQuery,
} = vendorApi;
