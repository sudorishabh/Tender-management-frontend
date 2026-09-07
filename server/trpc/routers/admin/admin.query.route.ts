import { router, adminProcedure, superAdminProcedure } from "../../trpc";
import { handleProcedureError } from "../../errorHandler";
import { adminDashboard, getAllAdmins } from "./admin.service";

export const adminQueryRoute = router({
  // Get admin dashboard
  getDashboard: adminProcedure.query(async () => {
    try {
      const result = await adminDashboard();
      return { success: true, ...result };
    } catch (error) {
      throw handleProcedureError(error, "Failed to fetch dashboard data");
    }
  }),

  // Get all admins 👍
  getAll: superAdminProcedure.query(async () => {
    try {
      const data = await getAllAdmins();
      return { success: true, data };
    } catch (error) {
      throw handleProcedureError(error, "Failed to fetch admins");
    }
  }),
});
