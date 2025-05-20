export interface IBidCard {
  id: string;
  dd_number: string;
  dd_date: string;
  bank_number: string;
  bank_branch: string;
  created_at: string;
  technical_score: number;
  financial_score: number;
  total_score: number;
  status: string;
  business_name: string;
  business_classification: string;
  ranking?: number;
  rejection_message?: string;
  vendor_email?: string;
  vendor_name?: string;
}

export interface IBidTableRow {
  id: string;
  tender_id: string;
  dd_number: string;
  dd_date: string;
  bank_number: string;
  bank_branch: string;
  created_at: string;
  technical_score: number;
  financial_score: number;
  total_score: number;
  status: string;
  business_name: string;
  business_classification: string;
  tender_title: string;
  tender_number: string;
  rejection_message?: string;
}

export interface IBidsResponse {
  success: boolean;
  bids: IBidTableRow[];
}

export interface IBidsOnTenderResponse {
  hasMore: boolean;
  page: number;
  bids: IBidCard[];
  success: boolean;
}
