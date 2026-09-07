export interface ITableBid {
  bid_id: number;
  tender_id: number;

  created_at: Date;
  bid_status: "selected" | "ranked" | "under_review" | "rejected" | "approved";
  biz_legal_name: string | null;
  biz_classification: string | null;
  tender_title: string | null;
  tender_number: string | null;
  bid_rejection_msg: string | null;
  bid_total_score?: number | null;
}
