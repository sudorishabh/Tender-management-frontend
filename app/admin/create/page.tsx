"use client";
import React, { useCallback, useEffect, useState } from "react";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
import dynamic from "next/dynamic";
import CreateTenderSkeleton from "@/components/Shared/skeleton/CreateTenderSkeleton";
import { useRouter } from "next/navigation";
import {
  useCreateTenderMutation,
  useGetSavedTenderQuery,
  useSaveTenderMutation,
} from "@/Redux/tender/tenderApi";
import { toast } from "sonner";
import { useDeleteFileUrlMutation } from "@/Redux/s3-files/s3-files-Api";
import { useSearchParams } from "next/navigation";
import {
  IBidderDocumentsReqResponse,
  ITenderFormData,
  ITenderPreQualification,
  ITenderPreQualificationResponse,
  ITenderSupportDocResponse,
  ITenderSupportDocument,
  ITenderVendorSelection,
} from "@/Types/Tender-Types";
import { useForm } from "react-hook-form";
import { ErrorCodes } from "@/lib/errorCodes";
import useUploadFileToS3 from "@/hooks/useUploadFileToS3";
import { ApiError } from "@/Types";
import { validateTenderData } from "@/lib/helper";
import { tenderFromDefaultValues } from "@/lib/CreateTenderConstants";

const CreateTender = dynamic(
  () => import("@/components/Tender/For-Admin/CreateTender"),
  {
    loading: () => <CreateTenderSkeleton />,
  }
);

const Create = () => {
  const [active, setActive] = useState<number>(0);
  const [vendorSelection, setVendorSelection] =
    useState<ITenderVendorSelection>({
      selectedVendors: [],
      selectedCategories: ["all"],
    });

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const form = useForm<ITenderFormData>({
    defaultValues: tenderFromDefaultValues,
    mode: "onChange",
  });

  // load saved tender data
  const { data: savedTenderData } = useGetSavedTenderQuery(id, {
    skip: !id,
  });

  // create tender
  const [createTender, { isLoading: isCreateTenderLoading }] =
    useCreateTenderMutation();

  // upload file to s3
  const [uploadFile, { isLoading: isSupportDocumentUploading }] =
    useUploadFileToS3();

  // save tender
  const [saveTender, { isLoading: isSaveTenderLoading }] =
    useSaveTenderMutation();

  // delete file from s3
  const [deleteFileUrl] = useDeleteFileUrlMutation();

  // handle vendor selection change
  const handleVendorSelectionChange = useCallback(
    (newSelection: {
      selectedVendors: string[];
      selectedCategories: string[];
    }) => {
      setVendorSelection(newSelection);
    },
    []
  );

  // reset form data
  useEffect(() => {
    if (savedTenderData) {
      const resetData = {
        itemInfo: {
          company: savedTenderData?.tender?.company || "Teri",
          department: savedTenderData?.tender?.department || "",
          tenderNumber: savedTenderData?.tender?.tender_number || "",
          tenderType: savedTenderData?.tender?.type || "",
          tenderScope: savedTenderData?.tender?.scope || "",
          category: savedTenderData?.tender?.category || "",
          title: savedTenderData?.tender?.title || "",
          description: savedTenderData?.tender?.description || "",
          technicalPreBidQualification:
            savedTenderData?.tender?.tech_prebid_qual || "",
          technicalWeightage: savedTenderData?.tender?.tech_weightage || "",
          commercialWeightage:
            savedTenderData?.tender?.commercial_weightage || "",
        },
        keyDates: {
          prePublishDate: savedTenderData?.tender?.pre_publish_date || null,
          publishDate: savedTenderData?.tender?.publish_date || null,
          tenderSaleCloseDate: savedTenderData?.tender?.sale_close_date || null,
          clarificationStartDate:
            savedTenderData?.tender?.clarification_start_date || null,
          clarificationEndDate:
            savedTenderData?.tender?.clarification_end_date || null,
          revisionPublishmentDate:
            savedTenderData?.tender?.revision_publishment_date || null,
          bidSubmissionEndDate:
            savedTenderData?.tender?.bid_submission_end_date || null,
          bidOpenDate: savedTenderData?.tender?.bid_open_date || null,
        },
        tenderFeeDetails: {
          documentFee: savedTenderData?.tender?.doc_fee || "",
          feePayableAt: savedTenderData?.tender?.fee_payable_at || "",
          EMD: savedTenderData?.tender?.emd || "",
          emdPayableAt: savedTenderData?.tender?.emd_payable_at || "",
          tenderLocation: savedTenderData?.tender?.location || "",
          tenderValue: savedTenderData?.tender?.value || "",
        },
        tenderSupportDocuments: savedTenderData?.tenderSupportDocuments?.map(
          (doc: ITenderSupportDocResponse) => ({
            documentName: doc.name || "",
            documentPurpose: doc.purpose || "",
            document: doc.doc_s3_name || "",
          })
        ) || [{ documentName: "", documentPurpose: "", document: "" }],
        vendorDocRequirement: savedTenderData?.bidderDocumentsReq?.map(
          (doc: IBidderDocumentsReqResponse) => ({
            name: doc.name || "",
            type: doc.format || "",
            purpose: doc.purpose || "",
          })
        ) || [{ name: "", type: "", purpose: "" }],
        tenderPreQualifications: savedTenderData?.tenderPreQualification?.map(
          (doc: ITenderPreQualificationResponse) => ({
            title: doc.title || "",
            description: doc.description || "",
            score: doc.score || "",
          })
        ) || [{ title: "", description: "", score: "" }],
      };
      setTimeout(() => {
        form.reset(resetData, { keepDefaultValues: false });
        if (
          savedTenderData?.vendorSelection &&
          savedTenderData?.categorySelection
        ) {
          setVendorSelection({
            selectedVendors:
              savedTenderData?.vendorSelection?.map(
                (vendorSelected: { vendor_id: number }) =>
                  vendorSelected.vendor_id
              ) || [],
            selectedCategories:
              savedTenderData?.categorySelection.length > 0
                ? savedTenderData?.categorySelection?.map(
                    (categorySelected: { category: string }) =>
                      categorySelected.category
                  )
                : ["all"],
          });
        }
      }, 5);
    }
  }, [savedTenderData, form]);

  const formValues = form?.watch();

  // handle save tender
  const handleSaveTender = useCallback(async () => {
    let tenderSupportDocumentsNames: {
      documentName: string;
      documentPurpose: string;
      documentS3Name: string;
    }[] = [];

    try {
      const {
        itemInfo,
        keyDates,
        tenderFeeDetails,
        tenderSupportDocuments,
        vendorDocRequirement,
        tenderPreQualifications,
      } = formValues;

      if (
        itemInfo.title === "" ||
        itemInfo.tenderNumber === "" ||
        itemInfo.category === ""
      ) {
        toast.error(
          "Title, Tender number and Category are required for saving"
        );
        return;
      }
      const uploadPromises = tenderSupportDocuments.map(
        async (doc: ITenderSupportDocument) => {
          if (doc.document === "") {
            return {
              documentName: doc.documentName,
              documentPurpose: doc.documentPurpose,
              documentS3Name: "",
            };
          } else if (typeof doc.document === "string") {
            return {
              documentName: doc.documentName,
              documentPurpose: doc.documentPurpose,
              documentS3Name: doc.document,
            };
          } else {
            const file = Array.isArray(doc.document)
              ? doc.document[0]
              : doc.document;
            const fileName = await uploadFile(file, "support document");

            if (!fileName) {
              throw new Error(
                "Failed to upload support document, please try again"
              );
            }

            return {
              documentName: doc.documentName,
              documentPurpose: doc.documentPurpose,
              documentS3Name: fileName,
            };
          }
        }
      );

      try {
        const results = await Promise.all(uploadPromises);
        tenderSupportDocumentsNames = results.filter(
          (
            doc
          ): doc is {
            documentName: string;
            documentPurpose: string;
            documentS3Name: string;
          } => doc !== null
        );
      } catch (error) {
        toast.error("Failed to upload one or more documents");
        throw error;
      }

      const formData = {
        tenderId: Number(id),
        itemInfo,
        keyDates,
        tenderFeeDetails,
        tenderSupportDocuments: tenderSupportDocumentsNames,
        vendorDocRequirement,
        tenderPreQualifications,
        vendorSelection,
      };

      const result = await saveTender(formData).unwrap();
      if (result?.success) {
        if (result?.tenderId) {
          router.replace(`?id=${result?.tenderId}`, { scroll: false });
        }
        toast.success("Tender saved successfully");
      }
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.data?.errorCode && ErrorCodes[apiError.data.errorCode]) {
        toast.error(ErrorCodes[apiError.data.errorCode]);
      } else {
        toast.error("Tender saving failed. Please try again.");
      }
    }
  }, [formValues, id, router, saveTender, uploadFile, vendorSelection]);

  // handle create tender
  const handleCreateTender = async (data: ITenderFormData) => {
    let tenderSupportDocumentsNames: {
      documentName: string;
      documentPurpose: string;
      documentS3Name: string;
    }[] = [];
    try {
      const isVal = validateTenderData(data);
      if (!isVal) {
        toast.error("Please fill all required fields before publishing");
        return;
      }
      const uploadPromises = data?.tenderSupportDocuments.map(
        async (doc: ITenderSupportDocument) => {
          const file = Array.isArray(doc.document)
            ? doc.document[0]
            : doc.document;

          const fileName = await uploadFile(file, "support document");

          if (!fileName) {
            throw new Error(
              "Failed to upload support document, please try again"
            );
          }

          return {
            documentName: doc.documentName,
            documentPurpose: doc.documentPurpose,
            documentS3Name: fileName,
          };
        }
      );

      try {
        const results = await Promise.all(uploadPromises);
        tenderSupportDocumentsNames = results.filter(
          (
            doc
          ): doc is {
            documentName: string;
            documentPurpose: string;
            documentS3Name: string;
          } => doc !== null
        );
      } catch (error) {
        toast.error("Failed to upload one or more documents");
        throw error;
      }

      const formData = {
        ...data,
        itemInfo: {
          ...data.itemInfo,
          tenderNumber: data.itemInfo.tenderNumber,
          technicalWeightage: data.itemInfo.technicalWeightage,
          commercialWeightage: data.itemInfo.commercialWeightage,
        },
        tenderPreQualifications: data.tenderPreQualifications.map(
          (preQualification: ITenderPreQualification) => ({
            ...preQualification,
            score: preQualification.score,
          })
        ),
        tenderSupportDocuments: tenderSupportDocumentsNames,
        vendorSelection,
        savedTenderId: Number(id) || null,
      };

      const result = await createTender(formData).unwrap();
      if (result?.success) {
        toast.success("Tender created successfully");
        form.reset();
        setActive(0);
      }
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.data?.errorCode && ErrorCodes[apiError.data.errorCode]) {
        toast.error(ErrorCodes[apiError.data.errorCode]);
      } else {
        toast.error("Tender creation failed. Please try again.");
      }

      if (tenderSupportDocumentsNames.length > 0) {
        await Promise.all(
          tenderSupportDocumentsNames.map((doc) =>
            deleteFileUrl({
              fileName: `${process.env.NEXT_PUBLIC_AWS_S3_PDF_FOLDER}/${doc.documentS3Name}`,
            })
          )
        );
      }
    }
  };

  const isCreatingTender = isCreateTenderLoading || isSupportDocumentUploading;

  return (
    <AdminPagesWrapper>
      <CreateTender
        active={active}
        setActive={setActive}
        form={form}
        handleSaveTender={handleSaveTender}
        handleCreateTender={handleCreateTender}
        isCreatingTender={isCreatingTender}
        isSaveTenderLoading={isSaveTenderLoading}
        handleVendorSelectionChange={handleVendorSelectionChange}
        vendorSelection={vendorSelection}
      />
    </AdminPagesWrapper>
  );
};

export default Create;
