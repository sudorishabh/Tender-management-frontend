import { generateUniqueId, getPdfFileQuery } from "@/lib/helper";
import { useGetUploadUrlMutation } from "@/Redux/s3-files/s3-files-Api";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

const useUploadFileToS3 = (): [
  (fileInput: File | FileList, type: string) => Promise<string>,
  { isLoading: boolean }
] => {
  const [getUploadUrl] = useGetUploadUrlMutation();
  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = async (
    fileInput: File | FileList,
    type: string
  ): Promise<string> => {
    try {
      setIsLoading(true);
      const file = fileInput instanceof FileList ? fileInput[0] : fileInput;
      const uniqueFileName = generateUniqueId(file?.name);
      const { fileName, fileType } = getPdfFileQuery(uniqueFileName);

      const response = await getUploadUrl({
        fileName,
        contentType: fileType,
      }).unwrap();

      if (!response?.success || !response?.uploadUrl) {
        throw new Error(`Failed to get upload URL for ${type} document`);
      }

      await axios.put(response.uploadUrl, file);
      return uniqueFileName;
    } catch (error) {
      toast.error(`Failed to upload ${type} document`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return [uploadFile, { isLoading }];
};

export default useUploadFileToS3;
