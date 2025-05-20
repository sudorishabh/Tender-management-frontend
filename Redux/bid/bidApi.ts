import { IBidCard } from "@/Types/Bid-Types";
import { api } from "../api";

export interface IPurchasedBidCard {
  id: number;
  dd_number: string;
  dd_date: string;
  bank_number: string;
  bank_branch: string;
  created_at: string;
  status: string;
  tender_number: string;
  tender_title: string;
  tender_value: string;
  tender_location: string;
  tender_category: string;
  tender_type: string;
  tender_scope: string;
  rejection_message: string;
  business_name: string;
}

export interface IApprovedBidCard extends IPurchasedBidCard {
  id: number;
  dd_number: string;
  dd_date: string;
  bank_number: string;
  bank_branch: string;
  created_at: string;
  status: string;
  technical_score: number;
  financial_score: number;
  total_score: number;
  tender_number: string;
  tender_title: string;
  tender_value: string;
  tender_location: string;
  tender_category: string;
  tender_type: string;
  tender_scope: string;
  rejection_message: string;
}

interface BidResponse {
  success: true;
  purchasedTenders: IPurchasedBidCard[];
  totalPurchasedBids: number;
  hasMore: boolean;
  page: number;
}

interface IApprovedBidResponse {
  success: true;
  approvedTenders: IApprovedBidCard[];
  totalApprovedBids: number;
  hasMore: boolean;
  page: number;
}

interface IBidsOnTenderResponse {
  success: true;
  bids: IBidCard[];
  hasMore: boolean;
  page: number;
}

const bidApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createBid: builder.mutation({
      query: (data) => ({
        url: `/bid/create`,
        method: "POST",
        body: data,
      }),
    }),

    getAllBids: builder.query({
      query: () => ({
        url: `/bid/all`,
        method: "GET",
      }),
      providesTags: ["bids"],
    }),

    getTenderBids: builder.query({
      query: ({ tenderId, scoreFilter, page, limit }) => ({
        url: `/bid/tender-bids/${tenderId}?scoreFilter=${scoreFilter}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      serializeQueryArgs: ({ endpointName }: { endpointName: string }) => {
        return endpointName;
      },
      merge: (
        currentCache: IBidsOnTenderResponse,
        newItems: IBidsOnTenderResponse
      ) => {
        if (newItems.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          bids: [...currentCache.bids, ...newItems.bids],
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

    getBidById: builder.query({
      query: (bidId) => ({
        url: `/bid/details/${bidId}`,
        method: "GET",
      }),
      providesTags: ["bids"],
    }),

    updateBidScore: builder.mutation({
      query: ({ bidId, technicalScore, financialScore }) => ({
        url: `/bid/update-score/${bidId}`,
        method: "POST",
        body: { technicalScore, financialScore },
      }),
      invalidatesTags: ["bids"],
    }),

    setBidStatus: builder.mutation({
      query: ({ bidId, status, ranking, message }) => ({
        url: `/bid/set-status/${bidId}`,
        method: "POST",
        body: { status, ranking, message },
      }),
      invalidatesTags: ["bids"],
    }),

    getSelectedBids: builder.query({
      query: (tenderId) => ({
        url: `/bid/selected-bids/${tenderId}`,
        method: "GET",
      }),
      providesTags: ["selectedBids"],
    }),

    getRejectedBids: builder.query({
      query: (tenderId) => ({
        url: `/bid/rejected-bids/${tenderId}`,
        method: "GET",
      }),
      providesTags: ["rejectedBids"],
    }),

    setBidRanking: builder.mutation({
      query: ({ bidId, ranking }) => ({
        url: `/bid/set-ranking/${bidId}`,
        method: "POST",
        body: { ranking },
      }),
      invalidatesTags: ["rankedBids"],
    }),

    getRankedBids: builder.query({
      query: (tenderId) => ({
        url: `/bid/ranked-bids/${tenderId}`,
        method: "GET",
      }),
      providesTags: ["rankedBids"],
    }),

    deleteBids: builder.mutation({
      query: (bidIds) => ({
        url: `/bid/delete`,
        method: "DELETE",
        body: { bidIds },
      }),
      invalidatesTags: ["bids"],
    }),

    approveBid: builder.mutation({
      query: (bidId) => ({
        url: `/bid/approve-bid/${bidId}`,
        method: "POST",
      }),
    }),

    isBidApproved: builder.query({
      query: (tenderId) => ({
        url: `/bid/is-bid-approved/${tenderId}`,
      }),
    }),

    getVendorPurchasedBids: builder.query({
      query: ({ vendorId, page, limit }) => ({
        url: `/bid/vendor-purchased-bids/${vendorId}?page=${page}&limit=${limit}`,
      }),
      serializeQueryArgs: ({ endpointName }: { endpointName: string }) => {
        return endpointName;
      },
      merge: (currentCache: BidResponse, newItems: BidResponse) => {
        if (newItems.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          purchasedTenders: [
            ...currentCache.purchasedTenders,
            ...newItems.purchasedTenders,
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

    getVendorApprovedBids: builder.query({
      query: ({ vendorId, page, limit }) => ({
        url: `/bid/vendor-approved-bids/${vendorId}?page=${page}&limit=${limit}`,
      }),
      serializeQueryArgs: ({ endpointName }: { endpointName: string }) => {
        return endpointName;
      },
      merge: (
        currentCache: IApprovedBidResponse,
        newItems: IApprovedBidResponse
      ) => {
        if (newItems.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          approvedTenders: [
            ...currentCache.approvedTenders,
            ...newItems.approvedTenders,
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
  }),
});

export const {
  useCreateBidMutation,
  useGetBidByIdQuery,
  useGetTenderBidsQuery,
  useUpdateBidScoreMutation,
  useGetAllBidsQuery,
  useDeleteBidsMutation,
  useSetBidStatusMutation,
  useGetSelectedBidsQuery,
  useGetRejectedBidsQuery,
  useSetBidRankingMutation,
  useGetRankedBidsQuery,
  useApproveBidMutation,
  useIsBidApprovedQuery,
  useGetVendorPurchasedBidsQuery,
  useGetVendorApprovedBidsQuery,
} = bidApi;
