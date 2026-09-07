import { getPdfFileQuery } from "@/utils/s3FolderQuery";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const useDeleteFileFromS3 = (): [
  (fileName: string) => Promise<string>,
  { isLoading: boolean },
] => {
  const { mutateAsync, isPending } = trpc.s3.deleteFile.useMutation();

  const deleteFile = async (fileName: string): Promise<string> => {
    try {
      const { fileName: completeFileName } = getPdfFileQuery(fileName);

      const response = await mutateAsync({
        fileName: completeFileName,
      });

      if (!response?.success) {
        throw new Error(`Failed to delete file ${fileName}`);
      }

      return response.message;
    } catch (error) {
      toast.error(`Failed to delete file ${fileName}`);
      throw error;
    }
  };

  return [deleteFile, { isLoading: isPending }];
};

export default useDeleteFileFromS3;
