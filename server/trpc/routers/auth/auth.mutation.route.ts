import { publicProcedure, router, superAdminProcedure } from "../../trpc";
import { handleProcedureError } from "../../errorHandler";
import {
  acceptAdminInviteSchema,
  sendAdminInviteSchema,
  vendorRegistrationSchema,
} from "./auth.schema";
import {
  acceptAdminInvite,
  registerVendorService,
  sendAdminInvite,
} from "./auth.service";

export const authMutationRoute = router({
  register: publicProcedure
    .input(vendorRegistrationSchema)
    .mutation(async ({ input }) => {
      try {
        await registerVendorService(input);
        return {
          success: true,
          message: "Registration successful. Please sign in.",
        };
      } catch (error) {
        throw handleProcedureError(error, "Registration failed");
      }
    }),

  // Accept admin invite
  acceptInvite: publicProcedure
    .input(acceptAdminInviteSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await acceptAdminInvite(input);
        return result;
      } catch (error) {
        throw handleProcedureError(error, "Failed to accept invite");
      }
    }),

  // Send admin invite
  sendAdminInvite: superAdminProcedure
    .input(sendAdminInviteSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = Number(ctx.user.id);
        const result = await sendAdminInvite(input, userId);
        return result;
      } catch (error) {
        throw handleProcedureError(error, "Failed to send admin invite");
      }
    }),
});
