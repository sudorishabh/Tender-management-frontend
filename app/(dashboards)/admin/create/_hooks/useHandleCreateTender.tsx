import { trpc } from "@/lib/trpc";
import { ITenderFormSteps } from "@/_types/tender/createTender.type";
import { toast } from "sonner";
import useUploadFileToS3 from "@/hooks/useUploadFileToS3";
import useDeleteFileFromS3 from "@/hooks/useDeleteFileFromS3";
import { UseFormReturn } from "react-hook-form";
import { convertStep3DatesToStrings } from "@/utils/dateUtils";

interface IHandleCreateTenderProps {
  data: ITenderFormSteps;
  setActive: (active: number) => void;
  form: UseFormReturn<ITenderFormSteps>;
}

// Validation helper function
const validateTenderData = (data: ITenderFormSteps): string[] => {
  const errors: string[] = [];
  const { step1, step3 } = data;

  // Check required fields
  if (!step1.tender_title?.trim()) errors.push("Tender Title");
  if (!step1.tender_department?.trim()) errors.push("Department");
  if (!step1.tender_type) errors.push("Tender Type");
  if (!step1.tender_scope) errors.push("Tender Scope");
  if (!step1.tender_description?.trim()) errors.push("Description");
  if (!step1.tender_location?.trim()) errors.push("Location");

  // Numeric validations
  const docFee = Number(step1.tender_doc_fee);
  if (!step1.tender_doc_fee || isNaN(docFee) || docFee <= 0) {
    errors.push("Document Fee (must be greater than 0)");
  }

  const emd = Number(step1.tender_emd);
  if (!step1.tender_emd || isNaN(emd) || emd <= 0) {
    errors.push("EMD (must be greater than 0)");
  }

  // Check dates
  if (!step3.tender_release_date) errors.push("Release Date");
  if (!step3.tender_query_deadline) errors.push("Query Deadline");
  if (!step3.tender_query_response_date) errors.push("Query Response Date");
  if (!step3.tender_bid_submission_deadline)
    errors.push("Bid Submission Deadline");
  if (!step3.tender_technical_bid_opening) errors.push("Technical Bid Opening");
  if (!step3.tender_financial_bid_opening) errors.push("Financial Bid Opening");

  return errors;
};

const useHandleCreateTender = () => {
  const createTender = trpc.tender.create.useMutation({
    onSuccess: () => { },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const isCreateTenderLoading = createTender.isPending;
  const [deleteFileFromS3] = useDeleteFileFromS3();
  const [uploadFile, { isLoading: isDocumentUploading }] = useUploadFileToS3();

  const handleCreateTender = async ({
    data,
    setActive,
    form,
  }: IHandleCreateTenderProps) => {
    let uploadedContractDocKey: string | null = null;

    try {
      // CLIENT-SIDE VALIDATION
      const validationErrors = validateTenderData(data);
      if (validationErrors.length > 0) {
        toast.error(
          `Cannot submit tender. Missing required fields: ${validationErrors
            .slice(0, 3)
            .join(", ")}${validationErrors.length > 3
              ? `, and ${validationErrors.length - 3} more`
              : ""
          }`,
          {
            duration: 5000,
            description:
              "Please complete all required fields before submitting.",
          }
        );

        // Navigate to first incomplete step
        if (validationErrors.some((e) => e.includes("Date"))) {
          setActive(2); // Key Dates step
        } else {
          setActive(0); // Primary Info step
        }

        return;
      }

      const { step1 } = data;

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
          const uploadedKey = await uploadFile(file, "Contract Document");
          if (!uploadedKey) {
            throw new Error(
              "Failed to upload contract document, please try again"
            );
          }
          contractDocKey = uploadedKey;
          uploadedContractDocKey = uploadedKey;
        }
      }

      const tenderType = step1.tender_type ?? "";
      const tenderScope = step1.tender_scope ?? "";

      const formData = {
        ...data,
        step1: {
          ...data.step1,
          tender_contract_document: contractDocKey,
          tender_type: tenderType,
          tender_scope: tenderScope,
          tender_id: data.step1.tender_id ? Number(data.step1.tender_id) : undefined,
          tender_doc_fee: Number(data.step1.tender_doc_fee),
          tender_emd: Number(data.step1.tender_emd),
        },
        // Convert dates to local strings to preserve exact time
        step3: convertStep3DatesToStrings(data.step3),
      };

      await createTender.mutateAsync(formData);
      toast.success("Tender submitted for review successfully", {
        description: "Your tender has been submitted and is awaiting approval.",
      });
      form.reset();
      setActive(0);
    } catch (error) {
      // Enhanced error handling
      let errorMessage = "Tender creation failed. Please try again.";

      if (error && typeof error === "object" && "message" in error) {
        errorMessage = (error as { message: string }).message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        duration: 5000,
        description: "Please check your input and try again.",
      });

      // Clean up uploaded files on error
      if (uploadedContractDocKey) {
        try {
          await deleteFileFromS3(uploadedContractDocKey);
        } catch (cleanupError) {
          console.error("Failed to cleanup uploaded file:", cleanupError);
        }
      }
    }
  };

  const isLoading = isCreateTenderLoading || isDocumentUploading;

  return [
    handleCreateTender,
    {
      isLoading,
    },
  ];
};

export default useHandleCreateTender;
