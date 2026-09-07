export interface ISavedTenderResponse {
  tender: {
    tender_id: number;
    tender_number: string | null;
    tender_department: string | null;
    tender_remark: string | null;
    tender_type: string | null;
    tender_scope: string | null;
    tender_title: string | null;
    tender_description: string | null;
    tender_contract_document: string | null;
    tender_doc_fee: string | null;
    tender_emd: string | null;
    tender_location: string | null;
    // New timeline fields
    tender_release_date: Date | null;
    tender_query_deadline: Date | null;
    tender_query_response_date: Date | null;
    tender_bid_submission_deadline: Date | null;
    tender_technical_bid_opening: Date | null;
    tender_financial_bid_opening: Date | null;
    tender_opening_venue: string | null;
    tender_project_duration: string | null;
    tender_status: string | null;
    tender_select_all: boolean | null;
    created_at: Date;
    updated_at: Date;
  };
  bidderDocumentsReq: {
    vdr_id: number;
    tender_id: number;
    vdr_name: string;
    created_at: Date;
    updated_at: Date;
  }[];
  vendorSelection: {
    tvs_id: number;
    tender_id: number;
    vendor_id: number;
  }[];
}
