import { unlink } from "fs/promises";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

/**
 * Returns a local URL to serve the file via /api/files/
 */
export async function getDownloadUrl(fileKey: string): Promise<string> {
  return `/api/files/${fileKey}`;
}

/**
 * Deletes a file from the local uploads folder.
 */
export async function deleteFile(fileKey: string): Promise<void> {
  const filePath = path.join(UPLOADS_DIR, fileKey);
  if (!filePath.startsWith(UPLOADS_DIR)) {
    throw new Error("Invalid file path");
  }
  await unlink(filePath);
}

/**
 * Deletes multiple files from the local uploads folder.
 */
export async function deleteFiles(fileKeys: string[]): Promise<void> {
  await Promise.all(fileKeys.map((key) => deleteFile(key)));
}
