import {
  IItemInfo,
  IKeyDate,
  ITenderFeeDetails,
  ITenderPreQualification,
  ITenderSupportDocument,
  IVenderDocRequirement,
} from "@/Types/Tender-Types";
// import { toast } from "sonner";

export function capitalizeFirstLetter(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const generateUniqueId = (fileName: string) => {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 10)}-${fileName}`;
};

export const validateTenderData = (data: {
  itemInfo: IItemInfo;
  keyDates: IKeyDate;
  tenderFeeDetails: ITenderFeeDetails;
  tenderSupportDocuments: ITenderSupportDocument[];
  venderDocRequirement: IVenderDocRequirement[];
  tenderPreQualifications: ITenderPreQualification[];
}): boolean => {
  // Item Info validation
  const itemInfo = data.itemInfo;
  if (
    !itemInfo.company ||
    !itemInfo.department ||
    !itemInfo.tenderNumber ||
    !itemInfo.tenderType ||
    !itemInfo.tenderScope ||
    !itemInfo.category ||
    !itemInfo.title ||
    !itemInfo.description ||
    !itemInfo.technicalWeightage ||
    !itemInfo.commercialWeightage
  ) {
    return false;
  }

  // Key Dates validation
  const keyDates = data.keyDates;
  if (
    !keyDates.prePublishDate ||
    !keyDates.publishDate ||
    !keyDates.tenderSaleCloseDate ||
    !keyDates.clarificationStartDate ||
    !keyDates.clarificationEndDate ||
    !keyDates.revisionPublishmentDate ||
    !keyDates.bidSubmissionEndDate ||
    !keyDates.bidOpenDate
  ) {
    return false;
  }

  // Tender Fee Details validation
  const tenderFeeDetails = data.tenderFeeDetails;
  if (
    !tenderFeeDetails.documentFee ||
    !tenderFeeDetails.feePayableAt ||
    !tenderFeeDetails.EMD ||
    !tenderFeeDetails.emdPayableAt ||
    !tenderFeeDetails.tenderLocation ||
    !tenderFeeDetails.tenderValue
  ) {
    return false;
  }

  // Tender Support Documents validation
  const tenderSupportDocuments = data.tenderSupportDocuments;
  if (tenderSupportDocuments.length === 0) {
    return false;
  }
  for (const doc of tenderSupportDocuments) {
    if (!doc.documentName || !doc.documentPurpose || !doc.document) {
      return false;
    }
  }

  // Vendor Document Requirements validation
  const venderDocRequirement = data.venderDocRequirement;
  if (venderDocRequirement.length === 0) {
    return false;
  }
  for (const doc of venderDocRequirement) {
    if (!doc.name || !doc.type || !doc.purpose) {
      return false;
    }
  }

  // Tender Pre-Qualifications validation
  const tenderPreQualifications = data.tenderPreQualifications;
  if (tenderPreQualifications.length === 0) {
    return false;
  }
  for (const qual of tenderPreQualifications) {
    if (!qual.title || !qual.description || !qual.score) {
      return false;
    }
  }

  return true;
};

export const getPdfFileQuery = (fileName: string) => {
  return {
    fileName: `${process.env.NEXT_PUBLIC_AWS_S3_PDF_FOLDER}/${fileName}`,
    fileType: "application/pdf",
  };
};

// export const uploadFileToS3 = async (
//   fileInput: File | FileList,
//   type: "pan" | "registration",
//   getUploadUrl: string
// ): Promise<string> => {
//   const file = fileInput instanceof FileList ? fileInput[0] : fileInput;
//   const fileName = generateUniqueId(file?.name);
//   try {
//     const response = await getUploadUrl({
//       fileName: `${process.env.NEXT_PUBLIC_AWS_S3_PDF_FOLDER}/${fileName}`,
//       contentType: file?.type,
//     }).unwrap();

//     if (!response?.success || !response?.uploadUrl) {
//       throw new Error(`Failed to get upload URL for ${type} document`);
//     }

//     await axios.put(response.uploadUrl, file);
//     return fileName;
//   } catch (err) {
//     toast.error(`Failed to upload ${type} document`);
//     throw err;
//   }
// };
