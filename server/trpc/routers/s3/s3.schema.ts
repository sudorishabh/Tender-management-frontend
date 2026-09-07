import { z } from "zod";

export const fileUrlSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileType: z.string().min(1, "File type is required"),
});

export const deleteFileSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
});

export type FileUrlType = z.infer<typeof fileUrlSchema>;
export type DeleteFileType = z.infer<typeof deleteFileSchema>;
