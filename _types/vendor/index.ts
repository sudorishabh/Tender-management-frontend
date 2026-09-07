export interface ITableVendor {
  vendor_id: number;
  email: string | null;
  created_at: Date | null;
  full_name: string | null;
  vendor_status: "pending" | "rejected" | "approved";
  business_name: string | null;
}

export interface IVendor {
  user_id: number;
  email: string;
  role: string;
  created_at: Date;
  full_name: string;
  vendor_code: string;
  vendor_status: "pending" | "rejected" | "approved";
  vendor_contact: string;
  vendor_alt_contact: string;
  vendor_pan_number: string;
  vendor_pan_doc_key: string;
  vendor_image_key: string;
  vendor_adhar_doc_key: string;
}

export interface IBusiness {
  business_id: number;
  biz_legal_name: string;
  biz_trade_name: string;
  biz_classification: string;
  biz_reg_number: string;
  biz_established_year: number;
  biz_addr_line1: string;
  biz_addr_line2: string;
  biz_locality: string;
  biz_city: string;
  biz_pin_code: string;
  biz_country: string;
  biz_state: string;
  biz_reg_doc_key: string;
  biz_msme_cert_doc_key: string;
  biz_website: string;
  biz_email: string;
  biz_gst_number: string;
  biz_phone: string;
  biz_3_year_turnover: number;
}
