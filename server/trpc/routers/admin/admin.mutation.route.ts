import { router, superAdminProcedure } from "../../trpc";
import { z } from "zod";
import { handleProcedureError } from "../../errorHandler";
import { deleteAdmin } from "./admin.service";

export const adminMutationRoute = router({
  // Delete admin
  delete: superAdminProcedure.input(z.number()).mutation(async ({ input }) => {
    try {
      const result = await deleteAdmin(input);
      return result;
    } catch (error) {
      throw handleProcedureError(error, "Failed to delete admin");
    }
  }),
});
