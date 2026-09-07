import { z } from "zod";
import { VENDOR_STATUS } from "@/enum/vendorStatus.enum";

// Get all vendors query schema
export const vendorsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.string().optional(),
  search: z.string().optional(),
});

export type VendorsQueryInput = z.infer<typeof vendorsQuerySchema>;

// Get vendor details params schema
export const vendorDetailsParamsSchema = z.object({
  id: z.string().min(1, "Vendor ID is required"),
});

export type VendorDetailsParamsInput = z.infer<
  typeof vendorDetailsParamsSchema
>;

// Update vendor status schema
export const updateVendorStatusSchema = z.object({
  vendorId: z.string().min(1, "Vendor ID is required"),
  status: z.nativeEnum(VENDOR_STATUS),
});

export type UpdateVendorStatusInput = z.infer<typeof updateVendorStatusSchema>;

// Vendor for selection query schema
export const vendorForSelectionSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type VendorForSelectionInput = z.infer<typeof vendorForSelectionSchema>;

// Update vendor by admin schema
export const updateVendorByAdminSchema = z.object({
  user: z.object({
    full_name: z.string().min(1, "Full name is required"),
    vendor_status: z.nativeEnum(VENDOR_STATUS),
    vendor_contact: z.string().min(1, "Contact number is required"),
    vendor_alt_contact: z.string().optional(),
    vendor_pan_number: z.string().optional(),
  }),
  business: z.object({
    biz_legal_name: z.string(),
    biz_trade_name: z.string().optional(),
    biz_classification: z.string().optional(),
    biz_reg_number: z.string().optional(),
    biz_established_year: z.string().optional(),
    biz_addr_line1: z.string().optional(),
    biz_addr_line2: z.string().optional(),
    biz_locality: z.string().optional(),
    biz_city: z.string().optional(),
    biz_pin_code: z.string().optional(),
    biz_country: z.string().optional(),
    biz_state: z.string().optional(),
    biz_gst_number: z.string().optional(),
    biz_website: z.string().optional(),
    biz_email: z.string().optional(),
    biz_phone: z.string().optional(),
    biz_3_year_turnover: z.string().optional(),
    biz_employee_count: z.number().nullable().optional(),
  }),
  vendor_id: z.string().min(1, "Vendor ID is required"),
});

export type UpdateVendorByAdminInput = z.infer<
  typeof updateVendorByAdminSchema
>;

// Vendor dashboard query schema (for pagination)
export const vendorDashboardQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type VendorDashboardQueryInput = z.infer<
  typeof vendorDashboardQuerySchema
>;

// Update vendor profile by vendor (self-edit) schema
export const updateVendorProfileSchema = z.object({
  user: z.object({
    full_name: z.string().min(1, "Full name is required"),
    vendor_contact: z.string().min(1, "Contact number is required"),
    vendor_alt_contact: z.string().optional(),
  }),
  business: z.object({
    biz_legal_name: z.string().optional(),
    biz_trade_name: z.string().min(1, "Trade name is required").optional(),
    biz_classification: z.string().optional(),
    biz_established_year: z.string().optional(),
    biz_addr_line1: z.string().optional(),
    biz_addr_line2: z.string().optional(),
    biz_locality: z.string().optional(),
    biz_city: z.string().optional(),
    biz_state: z.string().optional(),
    biz_pin_code: z.string().optional(),
    biz_country: z.string().optional(),
    biz_website: z.string().optional(),
    biz_email: z.string().email().optional().or(z.literal("")),
    biz_phone: z.string().optional(),
    biz_gst_number: z.string().optional(),
    biz_3_year_turnover: z.string().optional(),
    biz_employee_count: z.number().optional(),
  }),
});

export type UpdateVendorProfileInput = z.infer<
  typeof updateVendorProfileSchema
>;
