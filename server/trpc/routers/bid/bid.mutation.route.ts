import { router, vendorProcedure, adminProcedure } from "../../trpc";
import { handleProcedureError } from "../../errorHandler";
import { createBid, approveBid } from "./bid.service";
import { createBidSchema, approveBidSchema } from "./bid.schema";

export const bidMutationRoute = router({
  // Create bid (vendor only)
  create: vendorProcedure
    .input(createBidSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = String(ctx.user.id);
        const result = await createBid(userId, input);
        return { success: true, ...result };
      } catch (error) {
        throw handleProcedureError(error, "Failed to create bid");
      }
    }),

  // Approve bid (admin only) - Also rejects all other bids for the same tender
  approve: adminProcedure
    .input(approveBidSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await approveBid(input.bidId);
        return result;
      } catch (error) {
        throw handleProcedureError(error, "Failed to approve bid");
      }
    }),
});
