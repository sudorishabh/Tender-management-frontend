import { router, publicProcedure } from "../../trpc";
import { z } from "zod";
import { handleProcedureError } from "../../errorHandler";
import { getInviteDetails } from "./auth.service";

export const authQueryRoute = router({
  getInviteDetails: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      try {
        const result = await getInviteDetails(input);
        return { success: true, data: result };
      } catch (error) {
        throw handleProcedureError(error, "Invite not found");
      }
    }),
});
