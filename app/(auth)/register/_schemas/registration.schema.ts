import { z } from "zod";

// User validation schema with password confirmation validation
export const userSchema = z
  .object({
    full_name: z
      .string()
      .min(2, { message: "Full name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email format" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/, {
        message:
          "Must include uppercase, lowercase, number, and special character",
      }),
    confirm_password: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

// Vendor validation schema
export const vendorSchema = z.object({
  vendor_contact: z
    .string()
    .min(1, { message: "Contact number is required" })
    .regex(/^\d{10,12}$/, { message: "Must be 10-12 digits" }),
  vendor_pan_number: z
    .string()
    .min(1, { message: "PAN card number is required" })
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
      message: "Must be in format ABCDE1234F",
    }),
  vendor_adhar_doc: z.any().optional(),
  vendor_pan_doc: z.any().optional(),
});

// Business validation schema
export const businessSchema = z.object({
  biz_legal_name: z.string().min(1, { message: "Legal name is required" }),
  biz_trade_name: z.string().min(1, { message: "Trade name is required" }),
  biz_classification: z
    .string()
    .min(1, { message: "Business classification is required" }),
  biz_reg_number: z
    .string()
    .min(1, { message: "Registration number is required" }),
  biz_reg_doc: z.any().optional(),
  biz_established_year: z
    .string()
    .min(1, { message: "Established year is required" }),
  biz_addr_line1: z.string().min(1, { message: "Address line 1 is required" }),
  biz_addr_line2: z.string().optional().default(""),
  biz_locality: z.string().min(1, { message: "Locality is required" }),
  biz_city: z.string().min(1, { message: "City is required" }),
  biz_pin_code: z
    .string()
    .min(1, { message: "PIN code is required" })
    .regex(/^\d{5,10}$/, { message: "Must be 5-10 digits" }),
  biz_state: z.string().min(1, { message: "State is required" }),
  biz_country: z.string().min(1, { message: "Country is required" }),
  biz_gst_number: z.string().min(1, { message: "GST number is required" }),
  biz_gst_doc: z.any().optional(),
  biz_bank_doc: z.any().optional(),
  biz_msme_cert_doc: z.any().optional().nullable(),
  biz_has_msme: z.boolean().default(false),
  biz_website: z.string().optional().default(""),
  biz_email: z.string().email({ message: "Invalid email address" }),
  biz_phone: z
    .string()
    .min(1, { message: "Company phone is required" })
    .regex(/^[0-9]{10,15}$/, { message: "Must be 10-15 digits" }),
  biz_3_year_turnover: z
    .string()
    .min(1, { message: "Last three years turnover is required" }),
  biz_employee_count: z.number().default(0),
});

// Complete registration schema
export const registrationSchema = z.object({
  user: userSchema,
  vendor: vendorSchema,
  business: businessSchema,
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
