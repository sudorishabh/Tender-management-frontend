import { useState } from "react";
import { toast } from "sonner";

const useUploadFileToS3 = (): [
  (fileInput: FileList | File, type: string, folder?: string) => Promise<string>,
  { isLoading: boolean },
] => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (
    fileInput: FileList | File,
    type: string,
    folder: string = "pdf"
  ): Promise<string> => {
    try {
      setUploading(true);
      const file = fileInput instanceof FileList ? fileInput[0] : fileInput;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload ${type} document`);
      }

      const data = await response.json();

      if (!data.success || !data.key) {
        throw new Error(`Failed to upload ${type} document`);
      }

      return data.key;
    } catch (error) {
      toast.error(`Failed to upload ${type} document`);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return [uploadFile, { isLoading: uploading }];
};

export default useUploadFileToS3;
