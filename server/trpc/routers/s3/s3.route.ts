import { publicProcedure, router } from "../../trpc";
import { handleProcedureError } from "../../errorHandler";
import { deleteFileSchema, fileUrlSchema } from "./s3.schema";
import { deleteFileService, getFileUrlService } from "./s3.service";

export const s3Router = router({
  getFileUrl: publicProcedure.input(fileUrlSchema).query(async ({ input }) => {
    try {
      const fileUrl = await getFileUrlService(input.fileName, input.fileType);
      return {
        success: true,
        fileUrl,
      };
    } catch (error) {
      throw handleProcedureError(error, "Failed to get file URL");
    }
  }),

  deleteFile: publicProcedure
    .input(deleteFileSchema)
    .mutation(async ({ input }) => {
      try {
        await deleteFileService(input.fileName);
        return {
          success: true,
          message: "File deleted successfully",
        };
      } catch (error) {
        throw handleProcedureError(error, "Failed to delete file");
      }
    }),
});
