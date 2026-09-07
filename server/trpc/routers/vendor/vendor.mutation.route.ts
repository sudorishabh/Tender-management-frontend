import { router, adminProcedure, vendorProcedure } from "../../trpc";
import { handleProcedureError } from "../../errorHandler";
import {
  updateVendorStatusSchema,
  updateVendorProfileSchema,
  updateVendorByAdminSchema,
} from "./vendor.schema";
import {
  updateVendorByAdmin,
  updateVendorStatus,
  updateVendorProfile,
} from "./vendor.service";

export const vendorMutationRoute = router({
  // Update vendor by admin
  updateByAdmin: adminProcedure
    .input(updateVendorByAdminSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await updateVendorByAdmin(input);
        return result;
      } catch (error) {
        throw handleProcedureError(error, "Failed to update vendor");
      }
    }),

  // Update vendor status only (admin)
  vendorStatusUpdateAdmin: adminProcedure
    .input(updateVendorStatusSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await updateVendorStatus(input);
        return result;
      } catch (error) {
        throw handleProcedureError(error, "Failed to update vendor status");
      }
    }),

  // Update vendor's own profile (vendor only)
  updateMyProfile: vendorProcedure
    .input(updateVendorProfileSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = Number(ctx.user.id);
        const result = await updateVendorProfile(userId, input);
        return result;
      } catch (error) {
        throw handleProcedureError(error, "Failed to update profile");
      }
    }),
});
