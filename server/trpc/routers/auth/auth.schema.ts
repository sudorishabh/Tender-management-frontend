import { z } from "zod";

export const vendorRegistrationSchema = z.object({
  user: z.object({
    email: z
      .string()
      .trim()
      .email("Invalid email format")
      .min(1, "Email is required")
      .toLowerCase(),
    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),
    full_name: z.string().trim().min(1, "Name is required"),
  }),
  vendor: z.object({
    vendor_contact: z
      .string()
      .trim()
      .regex(/^\d{10,15}$/, "Contact number must be between 10 to 15 digits"),
    vendor_pan_number: z.string().trim().min(1, "PAN card number is required"),
    vendor_pan_doc_key: z
      .string()
      .trim()
      .min(1, "PAN card document key is required"),
    vendor_adhar_doc_key: z
      .string()
      .trim()
      .min(1, "Aadhar card document key is required"),
  }),
  business: z.object({
    biz_legal_name: z.string().trim().min(1, "Legal name is required"),
    biz_trade_name: z.string().trim().optional(),
    biz_classification: z
      .string()
      .trim()
      .min(1, "Business classification is required"),
    biz_reg_number: z.string().trim().min(1, "Registration number is required"),
    biz_addr_line1: z.string().trim().min(1, "Address line one is required"),
    biz_addr_line2: z.string().trim().optional(),
    biz_locality: z.string().trim().min(1, "Locality is required"),
    biz_city: z.string().trim().min(1, "City is required"),
    biz_state: z.string().trim().min(1, "State is required"),
    biz_pin_code: z.string().trim().min(1, "Pin code is required"),
    biz_country: z.string().trim().min(1, "Country is required"),
    biz_established_year: z
      .string()
      .trim()
      .min(1, "Established year is required"),
    biz_msme_cert_doc_key: z.string().trim().optional(),
    biz_email: z.string().trim().email().toLowerCase(),
    biz_phone: z.string().trim(),
    biz_3_year_turnover: z
      .string()
      .trim()
      .min(1, "Last three years turnover is required"),
    biz_website: z.string().trim().optional(),
    biz_gst_number: z.string().trim().min(1, "GST number is required"),
    biz_gst_doc_key: z.string().trim().min(1, "GST document key is required"),
    biz_bank_doc_key: z
      .string()
      .trim()
      .min(1, "Cheque passbook image key is required"),
    biz_reg_doc_key: z
      .string()
      .trim()
      .min(1, "Registration document key is required"),
  }),
  vendor_source: z.enum(["direct", "invite"], {
    errorMap: () => ({ message: "Vendor source must be 'direct' or 'invite'" }),
  }),
});

export type VendorRegistrationType = z.infer<typeof vendorRegistrationSchema>;

export const acceptAdminInviteSchema = z
  .object({
    token: z.string().trim().min(1, "Token is required"),
    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),
    confirm_password: z.string().trim().min(1, "Please confirm your password"),
    full_name: z.string().trim().min(1, "Full name is required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type AcceptAdminInviteInput = z.infer<typeof acceptAdminInviteSchema>;

export const sendAdminInviteSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  full_name: z.string().trim().min(1, "Full name is required"),
});

export type SendAdminInviteInput = z.infer<typeof sendAdminInviteSchema>;
