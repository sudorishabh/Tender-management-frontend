import { ITenderFormSteps } from "@/_types/tender/createTender.type";
import { FileText, Calendar, Users, Eye } from "lucide-react";

export const createTenderNavData = [
  {
    title: "Primary information",
    icon: FileText,
    description: "Basic tender details and requirements",
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
    title: "Review & Submit",
    icon: Eye,
    description: "Final preview and submit for approval",
  },
];

// Combined form default values (ITenderFormSteps)
export const tenderFormDefaultValues: ITenderFormSteps = {
  step1: {
    tender_id: "",
    tender_department: "",
    tender_number: "",
    tender_type: "",
    tender_scope: "",
    tender_title: "",
    tender_description: "",
    tender_contract_document: "",
    tender_location: "",
    tender_opening_venue: "", // Venue of opening of technical and financial details
    tender_project_duration: "", // Project timeframe (e.g., "07 months")
    tender_is_technical_doc: false, // Whether technical document is required
    tender_is_financial_doc: false, // Whether financial document is required
    tender_doc_fee: "", // Tender document fee
    tender_emd: "", // Earnest Money Deposit
  },
  step2: [],
  step3: {
    tender_release_date: null, // 1. Release of tender
    tender_query_deadline: null, // 2. Last date for submission of written questions
    tender_query_response_date: null, // 3. Response to the queries
    tender_bid_submission_deadline: null, // 4. Last date for submission of bids
    tender_technical_bid_opening: null, // 5. Opening of technical bid
    tender_financial_bid_opening: null, // 6. Financial bid opening
  },
};
