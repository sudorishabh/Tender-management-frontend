import { trpc } from "@/lib/trpc";

/**
 * Custom hook to fetch draft (saved) tenders
 * Returns all draft tenders without pagination
 */
export const useSavedTenders = () => {
  const {
    data: draftData,
    isLoading: isDraftLoading,
    error: draftError,
    refetch: refetchDraft,
  } = trpc.tender.getSavedTenders.useQuery({});

  return {
    savedTenders: draftData?.savedTenders ?? [],
    totalCount: draftData?.totalCount ?? 0,
    isLoading: isDraftLoading,
    error: draftError,
    refetch: refetchDraft,
  };
};

/**
 * Custom hook to fetch reviewed/rescheduled tenders
 * Returns all reviewed/rescheduled tenders without pagination
 */
export const useReviewedTenders = () => {
  const {
    data: reviewedData,
    isLoading: isReviewedLoading,
    error: reviewedError,
    refetch: refetchReviewed,
  } = trpc.tender.getReviewedTenders.useQuery({});

  return {
    tenders: reviewedData?.tenders ?? [],
    isLoading: isReviewedLoading,
    error: reviewedError,
    refetch: refetchReviewed,
  };
};
