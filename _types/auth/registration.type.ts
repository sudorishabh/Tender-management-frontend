export interface IVendorRegistrationForm {
  user: {
    full_name: string;
    email: string;
    password: string;
    confirm_password: string;
  };
  vendor: {
    vendor_contact: string;
    vendor_pan_number: string;
    vendor_adhar_doc: FileList | null;
    vendor_pan_doc: FileList | null;
  };
  business: {
    biz_legal_name: string;
    biz_trade_name: string;
    biz_classification: string;
    biz_reg_number: string;
    biz_reg_doc: FileList | null;
    biz_established_year: string;
    biz_addr_line1: string;
    biz_addr_line2: string;
    biz_locality: string;
    biz_city: string;
    biz_pin_code: string;
    biz_state: string;
    biz_country: string;
    biz_gst_number: string;
    biz_gst_doc: FileList | null;
    biz_bank_doc: FileList | null;
    biz_msme_cert_doc: FileList | null;
    biz_has_msme: boolean;
    biz_website: string;
    biz_email: string;
    biz_phone: string;
    biz_3_year_turnover: string;
    biz_employee_count: number;
  };
}
