import { ITenderFormData } from "@/Types/Tender-Types";
import {
  FileText,
  Calendar,
  Coins,
  Award,
  Users,
  Eye,
  File,
  ListCheck,
} from "lucide-react";

export const createTenderNavData = [
  {
    title: "Primary information",
    icon: FileText,
    description: "Basic tender details and requirements",
  },
  {
    title: "Required files",
    icon: File,
    description: "Upload supporting documents",
  },
  {
    title: "Required submissions",
    icon: Users,
    description: "Documents vendors need to submit",
  },
  {
    title: "Bid deadlines",
    icon: Calendar,
    description: "Important dates and timeline",
  },
  {
    title: "Fee details",
    icon: Coins,
    description: "Tender fees and payment information",
  },
  {
    title: "Eligibility details",
    icon: Award,
    description: "Vendor qualification requirements",
  },
  {
    title: "Vendor selection",
    icon: ListCheck,
    description: "Select whom to select the tender",
  },
  {
    title: "Review & Publish",
    icon: Eye,
    description: "Final preview and tender publishing",
  },
];

export const tenderFromDefaultValues: ITenderFormData = {
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
  vendorDocRequirement: [
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
