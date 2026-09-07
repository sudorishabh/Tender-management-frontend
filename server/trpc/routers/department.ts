import { router, publicProcedure } from "../trpc";
import { handleProcedureError } from "../errorHandler";
import { db } from "@/server/db";
import { departmentTable } from "@/server/db/schema";

export const departmentRouter = router({
  getAll: publicProcedure.query(async () => {
    try {
      const data = await db.select().from(departmentTable);
      return { success: true, data };
    } catch (error) {
      throw handleProcedureError(error, "Failed to fetch departments");
    }
  }),
});
