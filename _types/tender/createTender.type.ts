export interface ITenderItemInfo {
  tender_department: string;
  tender_remark: string;
  tender_number: string;
  tender_type: string | undefined;
  tender_scope: string | undefined;
  tender_title: string;
  tender_description: string;
  tender_contract_document: string;
  // New timeline fields
  tender_release_date: string | Date | null;
  tender_query_deadline: string | Date | null;
  tender_query_response_date: string | Date | null;
  tender_bid_submission_deadline: string | Date | null;
  tender_technical_bid_opening: string | Date | null;
  tender_financial_bid_opening: string | Date | null;
  tender_opening_venue: string;
  tender_project_duration: string;
  tender_doc_fee: string;
  tender_emd: string;
  tender_location: string;
}

export interface ITenderVendorDocRequirement {
  vdr_name: string;
  vdr_document?: string;
  vdr_document_key?: string;
  vdr_doc_type?: string;
}

export interface ITenderPreQualification {
  tpq_title: string;
  tpq_description: string;
  tpq_score: string;
}

// Step-based form structure types
export interface ITenderStep1 {
  tender_id: string;
  tender_department: string;
  tender_number: string;
  tender_type: string | undefined;
  tender_scope: string | undefined;
  tender_title: string;
  tender_description: string;
  tender_contract_document: string | FileList;
  tender_location: string;
  tender_opening_venue: string; // Venue of opening of technical and financial details
  tender_project_duration: string; // Project timeframe (e.g., "07 months")
  tender_is_technical_doc: boolean; // Whether technical document is required
  tender_is_financial_doc: boolean; // Whether financial document is required
  tender_doc_fee: string; // Tender document fee
  tender_emd: string; // Earnest Money Deposit
  invited_emails?: string[]; // Email invitations (for Limited tenders only)
}

export interface ITenderStep2Item {
  vdr_name: string;
}

export type ITenderStep2 = ITenderStep2Item[];

export interface ITenderStep3 {
  tender_release_date: Date | null; // 1. Release of tender
  tender_query_deadline: Date | null; // 2. Last date for submission of written questions by bidders
  tender_query_response_date: Date | null; // 3. Response to the queries
  tender_bid_submission_deadline: Date | null; // 4. Last date for submission of technical bid and financial bid response
  tender_technical_bid_opening: Date | null; // 5. Opening of technical bid
  tender_financial_bid_opening: Date | null; // 6. Financial bid opening of only technically qualified bidders
}

export interface ITenderFormSteps {
  step1: ITenderStep1;
  step2: ITenderStep2;
  step3: ITenderStep3;
}

export interface ITenderFormData {
  // Step 1: Primary Information
  tender_department: string;
  tender_number: string;
  tender_type: string;
  tender_scope: string;
  tender_title: string;
  tender_description: string;
  tender_contract_document: string;
  tender_location: string;

  // Step 2: Required Submissions
  vendor_doc_requirement: ITenderVendorDocRequirement[];

  // Step 3: Bid Deadlines
  tender_release_date: string | Date | null;
  tender_query_deadline: string | Date | null;
  tender_query_response_date: string | Date | null;
  tender_bid_submission_deadline: string | Date | null;
  tender_technical_bid_opening: string | Date | null;
  tender_financial_bid_opening: string | Date | null;
  tender_opening_venue: string;
  tender_project_duration: string;

  // Step 4: Fee Details
  tender_doc_fee: string;
  tender_emd: string;

  // Email invitations (for Limited tenders only)
  invited_emails?: string[];
}
