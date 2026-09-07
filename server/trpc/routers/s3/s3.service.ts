import { unlink } from "fs/promises";
import path from "path";
import { InternalServerError, ApiError } from "@/lib/server/errors";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

/**
 * Returns a local URL for viewing/downloading a file.
 */
export async function getFileUrlService(
  fileName: string,
  _fileType: string
): Promise<string> {
  return `/api/files/${fileName}`;
}

/**
 * Deletes a file from the local uploads directory.
 */
export async function deleteFileService(fileName: string): Promise<void> {
  try {
    const filePath = path.join(UPLOADS_DIR, fileName);
    if (!filePath.startsWith(UPLOADS_DIR)) {
      throw new Error("Invalid file path");
    }
    await unlink(filePath);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new InternalServerError("Failed to delete file", "DELETE_ERROR");
  }
}

/**
 * Deletes multiple files from the local uploads directory.
 */
export async function deleteMultipleFilesService(
  fileNames: string[]
): Promise<void> {
  try {
    await Promise.all(fileNames.map((fileName) => deleteFileService(fileName)));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new InternalServerError(
      "Failed to delete files",
      "DELETE_MULTIPLE_ERROR"
    );
  }
}
