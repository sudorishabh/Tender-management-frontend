import { ITenderFormSteps } from "@/_types/tender/createTender.type";
import useUploadFileToS3 from "@/hooks/useUploadFileToS3";
import useDeleteFileFromS3 from "@/hooks/useDeleteFileFromS3";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { convertStep3DatesToStrings } from "@/utils/dateUtils";

import { trpc } from "@/lib/trpc";

interface IHandleSaveCreateTenderProps {
  data: ITenderFormSteps;
  id: string;
}

const useHandleSaveCreateTender = () => {
  const saveTenderMutation = trpc.tender.save.useMutation();
  const isSaveTenderLoading = saveTenderMutation.isPending;

  const [uploadFile, { isLoading: isDocumentUploading }] = useUploadFileToS3();
  const [deleteFileFromS3] = useDeleteFileFromS3();

  const router = useRouter();

  const handleSaveTender = async ({
    data,
  }: IHandleSaveCreateTenderProps) => {
    let uploadedContractDocKey: string | null = null;

    try {
      const { step1 } = data;

      // Minimal validation for save (only title required)
      if (!step1.tender_title?.trim()) {
        toast.error("Title is required for saving", {
          description: "Please provide at least a title.",
        });
        return;
      }

      // Handle tender_contract_document upload if it's a FileList
      let contractDocKey = "";
      if (step1.tender_contract_document) {
        if (typeof step1.tender_contract_document === "string") {
          // Already a string (S3 URL), use as-is
          contractDocKey = step1.tender_contract_document;
        } else if (
          step1.tender_contract_document instanceof FileList &&
          step1.tender_contract_document.length > 0
        ) {
          // It's a FileList, upload the file
          const file = step1.tender_contract_document[0];

          // FIX: Remove incorrect type casting, pass File directly
          const uploadedKey = await uploadFile(file, "Contract Document");

          if (!uploadedKey) {
            throw new Error(
              "Failed to upload contract document, please try again"
            );
          }
          contractDocKey = uploadedKey;
          uploadedContractDocKey = uploadedKey; // Track for cleanup
        }
      }

      const formData = {
        ...data,
        step1: {
          ...data.step1,
          tender_contract_document: contractDocKey,
          tender_id: data.step1.tender_id ? Number(data.step1.tender_id) : undefined,
          tender_doc_fee: data.step1.tender_doc_fee ? Number(data.step1.tender_doc_fee) : undefined,
          tender_emd: data.step1.tender_emd ? Number(data.step1.tender_emd) : undefined,
        },
        // Convert dates to local strings to preserve exact time
        step3: convertStep3DatesToStrings(data.step3),
      };

      const result = await saveTenderMutation.mutateAsync(formData);

      if (result?.success) {
        if (result?.tenderId) {
          router.replace(`?id=${result?.tenderId}`, { scroll: false });
        }
        toast.success("Tender saved successfully", {
          description: "Your draft has been saved and can be edited later.",
        });
      }
    } catch (error) {
      // Enhanced error handling with S3 cleanup
      let errorMessage = "Tender saving failed. Please try again.";

      if (error && typeof error === "object" && "message" in error) {
        errorMessage = (error as { message: string }).message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        duration: 5000,
      });

      // S3 CLEANUP: Delete uploaded file if save failed
      if (uploadedContractDocKey) {
        try {
          await deleteFileFromS3(uploadedContractDocKey);
          console.info("Cleaned up uploaded file after save error");
        } catch (cleanupError) {
          console.error("Failed to cleanup uploaded file:", cleanupError);
        }
      }
    }
  };

  const isLoading = isSaveTenderLoading || isDocumentUploading;
  return [
    handleSaveTender,
    {
      isLoading,
    },
  ];
};

export default useHandleSaveCreateTender;
