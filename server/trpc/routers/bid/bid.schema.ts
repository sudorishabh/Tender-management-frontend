import { z } from "zod";

// Vendor document upload schema
export const vendorDocUploadSchema = z.object({
  vdr_id: z.number(),
  vdr_name: z.string(),
  doc_s3_key: z.string().min(1, "Document is required"),
});

export type VendorDocUpload = z.infer<typeof vendorDocUploadSchema>;

// Create bid schema
export const createBidSchema = z.object({
  optionalInfo: z.string().optional(),
  tenderId: z.string().trim().min(1, "Tender ID is required"),
  bid_fee_doc_key: z.string().min(1, "Bid fee document is required"),
  technical_doc_key: z.string().optional(),
  financial_doc_key: z.string().optional(),
  vendorDocuments: z.array(vendorDocUploadSchema).optional(),
});

export type CreateBidInput = z.infer<typeof createBidSchema>;

// Tender bids query schema
export const tenderBidsSchema = z.object({
  tenderId: z.string().trim().min(1, "Tender ID is required"),
});

export type TenderBidsInput = z.infer<typeof tenderBidsSchema>;

// Bid by ID params schema
export const bidByIdParamsSchema = z.object({
  bidId: z.string().trim().min(1, "Bid ID is required"),
});

export type BidByIdParamsInput = z.infer<typeof bidByIdParamsSchema>;

// All bids query schema
export const allBidsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type AllBidsQueryInput = z.infer<typeof allBidsQuerySchema>;

// Vendor purchased bids query schema — vendorId is now derived from the session, not client input
export const vendorPurchasedBidsSchema = z.object({});
export type VendorPurchasedBidsInput = z.infer<typeof vendorPurchasedBidsSchema>;

// Vendor approved bids query schema — vendorId is now derived from the session, not client input
export const vendorApprovedBidsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type VendorApprovedBidsInput = z.infer<typeof vendorApprovedBidsSchema>;

// Vendor bidded tenders query schema (all bids by vendor)
export const vendorPurchasedTendersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type VendorPurchasedTendersInput = z.infer<
  typeof vendorPurchasedTendersSchema
>;

// Approved bids query schema
export const approvedBidsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type ApprovedBidsQueryInput = z.infer<typeof approvedBidsQuerySchema>;

// Is bid submitted query schema — userId is now derived from the session, not client input
export const isBidSubmittedSchema = z.object({
  tenderId: z.string().trim().min(1, "Tender ID is required"),
});

export type IsBidSubmittedInput = z.infer<typeof isBidSubmittedSchema>;

// Tender ID params schema
export const tenderIdParamsSchema = z.object({
  tenderId: z.string().trim().min(1, "Tender ID is required"),
});

export type TenderIdParamsInput = z.infer<typeof tenderIdParamsSchema>;

// Set rejected bid body schema
export const setRejectedBidSchema = z.object({
  message: z.string().trim().optional(),
});

export type SetRejectedBidInput = z.infer<typeof setRejectedBidSchema>;

// Approve bid schema
export const approveBidSchema = z.object({
  bidId: z.string().trim().min(1, "Bid ID is required"),
});

export type ApproveBidInput = z.infer<typeof approveBidSchema>;
