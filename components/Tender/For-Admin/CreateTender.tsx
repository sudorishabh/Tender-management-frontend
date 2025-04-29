"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import ItemInfo from "./CreateTenderCards/ItemInfo";
import TenderSupportDocument from "./CreateTenderCards/TenderSupportDocument";
import VenderDocRequirement from "./CreateTenderCards/VenderDocRequirement";
import KeyDates from "./CreateTenderCards/KeyDates";
import TenderFeeDetails from "./CreateTenderCards/TenderFeeDetails";
import TenderPreQualifications from "./CreateTenderCards/TenderPreQualifications";
import CreateTenderPreview from "./CreateTenderCards/CreateTenderPreview";
import {
  useCreateTenderMutation,
  useGetSavedTenderQuery,
  useSaveTenderMutation,
} from "@/Redux/tender/tenderApi";
import { toast } from "sonner";
import { useGetCategoriesNamesQuery } from "@/Redux/category/categoryApi";
import { useDeleteFileUrlMutation } from "@/Redux/s3-files/s3-files-Api";
import { validateTenderData } from "@/lib/helper";
import {
  ITenderPreQualification,
  ITenderSupportDocument,
} from "@/app/Types/Tender-Types";
import { Check } from "lucide-react";
import VendorSelection from "./CreateTenderCards/VendorSelection";
import useUploadFileToS3 from "@/hooks/useUploadFileToS3";
import { ApiError } from "@/app/Types";
import { ErrorCodes } from "@/lib/errorCodes";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { createTenderNavData } from "@/lib/CreateTenderNavbar";
import { ITenderFormData } from "@/app/Types/Tender-Types";
import CreateTenderSkeleton from "@/components/Shared/skeleton/CreateTenderSkeleton";

const tenderFromDefaultValues: ITenderFormData = {
  // Item Info
  itemInfo: {
    company: "Teri",
    department: "",
    tenderNumber: "",
    tenderType: "",
    tenderScope: "",
    category: "",
    title: "",
    description: "",
    technicalPreBidQualification: "",
    technicalWeightage: "",
    commercialWeightage: "",
  },
  // Key Dates
  keyDates: {
    prePublishDate: null,
    publishDate: null,
    tenderSaleCloseDate: null,
    clarificationStartDate: null,
    clarificationEndDate: null,
    revisionPublishmentDate: null,
    bidSubmissionEndDate: null,
    bidOpenDate: null,
  },
  // Tender Fee Details

  tenderFeeDetails: {
    documentFee: "",
    feePayableAt: "",
    EMD: "",
    emdPayableAt: "",
    tenderLocation: "",
    tenderValue: "",
  },

  // Tender Support Documents
  tenderSupportDocuments: [
    {
      documentName: "",
      documentPurpose: "",
      document: "",
    },
  ],

  // Bidder Documents
  venderDocRequirement: [
    {
      name: "",
      type: "",
      purpose: "",
    },
  ],

  // Tender Pre-Qualifications
  tenderPreQualifications: [
    {
      title: "",
      description: "",
      score: "",
    },
  ],
};

// Add these interfaces to handle saved tender data types
interface ITenderSupportDocResponse {
  name: string;
  purpose: string;
  doc_s3_name: string;
}

interface IBidderDocumentsReqResponse {
  name: string;
  format: string;
  purpose: string;
}

interface ITenderPreQualificationResponse {
  title: string;
  description: string;
  score: string;
}

const CreateTender = () => {
  const [active, setActive] = useState<number>(0);
  const [vendorSelection, setVendorSelection] = useState<{
    selectedVendors: string[];
    selectedCategories: string[];
  }>({
    selectedVendors: [],
    selectedCategories: ["all"],
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { categories } = useSelector((state: RootState) => state.categorySlice);

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetCategoriesNamesQuery({}, { skip: categories.length > 0 });

  const { data: savedTenderData } = useGetSavedTenderQuery(id, {
    skip: !id,
  });

  const [createTender, { isLoading: isCreateTenderLoading }] =
    useCreateTenderMutation();

  const [uploadFile, { isLoading: isSupportDocumentUploading }] =
    useUploadFileToS3();

  const [saveTender, { isLoading: isSaveTenderLoading }] =
    useSaveTenderMutation();

  const [deleteFileUrl] = useDeleteFileUrlMutation();

  const progressPercentage = useMemo(() => {
    return Math.round((active / (createTenderNavData.length - 1)) * 100);
  }, [active]);

  const handleVendorSelectionChange = useCallback(
    (newSelection: {
      selectedVendors: string[];
      selectedCategories: string[];
    }) => {
      setVendorSelection(newSelection);
    },
    []
  );

  const methods = useForm<ITenderFormData>({
    defaultValues: tenderFromDefaultValues,
    mode: "onChange",
  });

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
        venderDocRequirement: savedTenderData?.bidderDocumentsReq?.map(
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
        methods.reset(resetData, { keepDefaultValues: false });
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
  }, [savedTenderData, methods]);

  const formValues = methods?.watch();

  const onSave = useCallback(async () => {
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
        venderDocRequirement,
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
        venderDocRequirement,
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

  const onSubmit = async (data: ITenderFormData) => {
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
        methods.reset();
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

  const isLoading = isCreateTenderLoading || isSupportDocumentUploading;

  // Render the current step based on active state
  const renderStep = useCallback(() => {
    switch (active) {
      case 0:
        return (
          <ItemInfo
            setActive={setActive}
            categoriesData={
              categories.length > 0 ? categories : categoriesData?.categories
            }
            onSave={onSave}
            isSavingTender={isSaveTenderLoading}
          />
        );
      case 1:
        return (
          <TenderSupportDocument
            setActive={setActive}
            onSave={onSave}
            isSavingTender={isSaveTenderLoading}
          />
        );
      case 2:
        return (
          <VenderDocRequirement
            setActive={setActive}
            onSave={onSave}
            isSavingTender={isSaveTenderLoading}
          />
        );
      case 3:
        return (
          <KeyDates
            setActive={setActive}
            onSave={onSave}
            isSavingTender={isSaveTenderLoading}
          />
        );
      case 4:
        return (
          <TenderFeeDetails
            setActive={setActive}
            onSave={onSave}
            isSavingTender={isSaveTenderLoading}
          />
        );
      case 5:
        return (
          <TenderPreQualifications
            setActive={setActive}
            onSave={onSave}
            isSavingTender={isSaveTenderLoading}
          />
        );
      case 6:
        return (
          <VendorSelection
            setActive={setActive}
            categoriesData={
              categories.length > 0 ? categories : categoriesData?.categories
            }
            vendorSelection={vendorSelection}
            setVendorSelection={handleVendorSelectionChange}
            onSave={onSave}
            isSavingTender={isSaveTenderLoading}
          />
        );
      case 7:
        return (
          <CreateTenderPreview
            isLoading={isLoading}
            setActive={setActive}
            isPreviewData={formValues}
          />
        );
      default:
        return null;
    }
  }, [
    active,
    categoriesData,
    onSave,
    isSaveTenderLoading,
    formValues,
    vendorSelection,
    categories,
    handleVendorSelectionChange,
    isLoading,
  ]);

  // Show loader while categories are loading
  if (isCategoriesLoading) {
    return <CreateTenderSkeleton />;
  }

  return (
    <div className='w-full mb-8'>
      <div className='border-b mb-8'>
        <div className='container mx-auto px-6 py-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Create Tender</h1>
          <p className='text-gray-600 mt-2 max-w-2xl'>
            Fill in the required information through this multi-step form to
            create a new tender. Complete all sections to ensure your tender
            meets all compliance requirements.
          </p>

          <div className='mt-6 w-full h-2 bg-gray-200 rounded-full overflow-hidden'>
            <div
              className='h-full bg-primary transition-all duration-300 ease-in-out'
              style={{ width: `${progressPercentage}%` }}></div>
          </div>

          <div className='flex items-center justify-between mt-2'>
            <span className='text-sm font-medium text-gray-700'>
              Step {active + 1} of {createTenderNavData.length}
            </span>
            <span className='text-sm font-medium text-gray-700'>
              {progressPercentage}% Complete
            </span>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-6 flex justify-between gap-5 h-full'>
        <div className='w-80 shrink-0'>
          <div className='sticky top-24 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
            <div className='pt-4 pb-2 px-4 bg-gray-50 border-b'>
              <h2 className='font-semibold text-gray-900'>
                Tender Creation Steps
              </h2>
            </div>
            <div className='p-2'>
              {createTenderNavData?.map((data, i) => (
                <div
                  key={data.title}
                  className={`flex items-start gap-3 hover:bg-gray-50 cursor-pointer rounded p-3 transition-all
                   ${
                     active === i
                       ? "bg-primary/5 border-l-4 border-primary"
                       : ""
                   }`}
                  onClick={() => setActive(i)}>
                  <div
                    className={`flex items-center justify-center rounded-full w-8 h-8 mt-0.5 ${
                      i < active
                        ? "bg-green-100 text-green-700"
                        : active === i
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                    {i < active ? (
                      <Check size={16} />
                    ) : (
                      <data.icon
                        size={16}
                        className='text-primary'
                      />
                    )}
                  </div>
                  <div>
                    <p
                      className={`font-medium text-sm ${
                        active === i ? "text-primary" : "text-gray-900"
                      }`}>
                      {data.title}
                    </p>
                    <p className='text-xs text-gray-500 mt-0.5'>
                      {data.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className='flex-1 max-w-3x'>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              {renderStep()}
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default CreateTender;
