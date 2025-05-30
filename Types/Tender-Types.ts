export interface IItemInfo {
  company: string;
  department: string;
  tenderNumber: string;
  tenderType: string;
  tenderScope: string;
  category: string;
  title: string;
  description: string;
  technicalPreBidQualification: string;
  technicalWeightage: string;
  commercialWeightage: string;
}

export interface IKeyDate {
  prePublishDate: string | Date | null;
  publishDate: string | Date | null;
  tenderSaleCloseDate: string | Date | null;
  clarificationStartDate: string | Date | null;
  clarificationEndDate: string | Date | null;
  revisionPublishmentDate: string | Date | null;
  bidSubmissionEndDate: string | Date | null;
  bidOpenDate: string | Date | null;
}

export interface ITenderFeeDetails {
  documentFee: string;
  feePayableAt: string;
  EMD: string;
  emdPayableAt: string;
  tenderLocation: string;
  tenderValue: string;
}

export interface ITenderSupportDocument {
  documentName: string;
  documentPurpose: string;
  document: Blob | File | string;
}

export interface IVendorDocRequirement {
  name: string;
  type: string;
  purpose: string;
}

export interface ITenderPreQualification {
  title: string;
  description: string;
  score: string;
}

export interface ITenderCard {
  id: string;
  title: string;
  status: string;
  tenderNumber: string;
  bidEndDate: string;
  documentFee: string;
  emd: string;
  department: string;
  type: string;
  scope: string;
  category: string;
  location: string;
}

export interface ITenderFormData {
  itemInfo: IItemInfo;
  keyDates: {
    prePublishDate: string | Date | null;
    publishDate: string | Date | null;
    tenderSaleCloseDate: string | Date | null;
    clarificationStartDate: string | Date | null;
    clarificationEndDate: string | Date | null;
    revisionPublishmentDate: string | Date | null;
    bidSubmissionEndDate: string | Date | null;
    bidOpenDate: string | Date | null;
  };
  tenderFeeDetails: ITenderFeeDetails;
  tenderSupportDocuments: ITenderSupportDocument[];
  vendorDocRequirement: IVendorDocRequirement[];
  tenderPreQualifications: ITenderPreQualification[];
}

export interface ISavedTenderCard {
  category: string;
  createdAt: string;
  id: number;
  tenderNumber: string;
  title: string;
  updatedAt: string;
}
export interface ISavedTender {
  hasMore: boolean;
  page: number;
  savedTenders: ISavedTenderCard[];
  success: boolean;
}

export interface IAllTenderCard {
  id: number;
  title: string;
  tenderNumber: string;
  bidEndDate: string;
  documentFee: string;
  emd: string;
  department: string;
  type: string;
  status: string;
  scope: string;
  category: string;
  location: string;
}

export interface ITenderSupportDocResponse {
  name: string;
  purpose: string;
  doc_s3_name: string;
}

export interface IBidderDocumentsReqResponse {
  name: string;
  format: string;
  purpose: string;
}

export interface ITenderPreQualificationResponse {
  title: string;
  description: string;
  score: string;
}

export interface ITenderVendorSelection {
  selectedVendors: string[];
  selectedCategories: string[];
}

export interface ILiveTenders {
  hasMore: boolean;
  page: number;
  tenders: IAllTenderCard[];
  success: boolean;
}
