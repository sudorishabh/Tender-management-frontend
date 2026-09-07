import { and, count, desc, eq, like, or, SQL } from "drizzle-orm";
import { db } from "@/server/db";
import {
  businessTable,
  usersTable,
  vendorProfileTable,
} from "@/server/db/schema";
import { VENDOR_STATUS } from "@/enum/vendorStatus.enum";
import {
  VendorsQueryInput,
  VendorForSelectionInput,
  UpdateVendorStatusInput,
  UpdateVendorByAdminInput,
} from "./vendor.schema";
import {
  ApiError,
  NotFoundError,
  InternalServerError,
} from "@/lib/server/errors";
import { sendMail } from "@/lib/server/email";
import { vendorStatusUpdatedEmail } from "@/lib/server/templates/vendor.templates";

// MUTATION
////////////////////////////////////////////////////////////////////

export const updateVendorStatus = async (data: UpdateVendorStatusInput) => {
  try {
    const { vendorId, status } = data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.transaction(async (tx: any) => {
      await tx
        .update(vendorProfileTable)
        .set({ vendor_status: status })
        .where(eq(vendorProfileTable.vendor_id, Number(vendorId)));

      const [user] = await tx
        .select({
          full_name: usersTable.full_name,
          email: usersTable.email,
        })
        .from(usersTable)
        .innerJoin(
          vendorProfileTable,
          eq(usersTable.user_id, vendorProfileTable.user_id)
        )
        .where(eq(vendorProfileTable.vendor_id, Number(vendorId)))
        .limit(1);

      if (user) {
        const { html, text, subject } = vendorStatusUpdatedEmail({
          vendorName: user.full_name || "Vendor",
          status,
        });

        await sendMail({
          to: user.email,
          subject,
          text,
          html,
        });
      }
    });

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new InternalServerError(
      "Failed to update vendor status",
      "UPDATE_VENDOR_STATUS_ERROR"
    );
  }
};

/**
 * Update vendor details by admin
 */
export const updateVendorByAdmin = async (data: UpdateVendorByAdminInput) => {
  try {
    const { user, business, vendor_id } = data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.transaction(async (tx: any) => {
      // Get user_id from vendor_id
      const [vendorProfile] = await tx
        .select({ user_id: vendorProfileTable.user_id })
        .from(vendorProfileTable)
        .where(eq(vendorProfileTable.vendor_id, Number(vendor_id)))
        .limit(1);

      if (!vendorProfile) {
        throw new NotFoundError("Vendor not found", "VENDOR_NOT_FOUND");
      }

      await Promise.all([
        // Update business table
        tx
          .update(businessTable)
          .set({
            biz_legal_name: business.biz_legal_name,
            biz_trade_name: business.biz_trade_name,
            biz_classification: business.biz_classification,
            biz_reg_number: business.biz_reg_number,
            biz_established_year: business.biz_established_year,
            biz_addr_line1: business.biz_addr_line1,
            biz_addr_line2: business.biz_addr_line2,
            biz_locality: business.biz_locality,
            biz_city: business.biz_city,
            biz_country: business.biz_country,
            biz_state: business.biz_state,
            biz_pin_code: business.biz_pin_code,
            biz_gst_number: business.biz_gst_number,
            biz_website: business.biz_website,
            biz_email: business.biz_email,
            biz_phone: business.biz_phone,
            biz_3_year_turnover: business.biz_3_year_turnover,
            biz_employee_count: business.biz_employee_count,
          })
          .where(eq(businessTable.vendor_id, Number(vendor_id))),

        // Update vendor profile table
        tx
          .update(vendorProfileTable)
          .set({
            vendor_contact: user.vendor_contact,
            vendor_alt_contact: user.vendor_alt_contact,
            vendor_pan_number: user.vendor_pan_number,
            vendor_status: user.vendor_status,
          })
          .where(eq(vendorProfileTable.vendor_id, Number(vendor_id))),

        // Update users table
        tx
          .update(usersTable)
          .set({
            full_name: user.full_name,
          })
          .where(eq(usersTable.user_id, vendorProfile.user_id)),
      ]);
    });

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new InternalServerError(
      "Failed to update vendor",
      "UPDATE_VENDOR_ERROR"
    );
  }
};

/**
 * Update vendor profile by vendor (self-edit)
 */
export const updateVendorProfile = async (
  userId: number,
  data: {
    user: {
      full_name: string;
      vendor_contact: string;
      vendor_alt_contact?: string;
    };
    business: {
      biz_legal_name?: string;
      biz_trade_name?: string;
      biz_classification?: string;
      biz_established_year?: string;
      biz_addr_line1?: string;
      biz_addr_line2?: string;
      biz_locality?: string;
      biz_city?: string;
      biz_state?: string;
      biz_pin_code?: string;
      biz_country?: string;
      biz_website?: string;
      biz_email?: string;
      biz_phone?: string;
      biz_gst_number?: string;
      biz_3_year_turnover?: string;
      biz_employee_count?: number;
    };
  }
) => {
  try {
    const { user, business } = data;

    // Get vendor_id from user_id
    const [vendorProfile] = await db
      .select({ vendor_id: vendorProfileTable.vendor_id })
      .from(vendorProfileTable)
      .where(eq(vendorProfileTable.user_id, userId))
      .limit(1);

    if (!vendorProfile) {
      throw new NotFoundError(
        "Vendor profile not found",
        "VENDOR_PROFILE_NOT_FOUND"
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.transaction(async (tx: any) => {
      await Promise.all([
        // Update users table (full_name)
        tx
          .update(usersTable)
          .set({
            full_name: user.full_name,
          })
          .where(eq(usersTable.user_id, userId)),

        // Update vendor profile table
        tx
          .update(vendorProfileTable)
          .set({
            vendor_contact: user.vendor_contact,
            vendor_alt_contact: user.vendor_alt_contact,
          })
          .where(eq(vendorProfileTable.user_id, userId)),

        // Update business table
        tx
          .update(businessTable)
          .set({
            biz_legal_name: business.biz_legal_name,
            biz_trade_name: business.biz_trade_name,
            biz_classification: business.biz_classification,
            biz_established_year: business.biz_established_year,
            biz_addr_line1: business.biz_addr_line1,
            biz_addr_line2: business.biz_addr_line2,
            biz_locality: business.biz_locality,
            biz_city: business.biz_city,
            biz_state: business.biz_state,
            biz_pin_code: business.biz_pin_code,
            biz_country: business.biz_country,
            biz_website: business.biz_website,
            biz_email: business.biz_email,
            biz_phone: business.biz_phone,
            biz_gst_number: business.biz_gst_number,
            biz_3_year_turnover: business.biz_3_year_turnover,
            biz_employee_count: business.biz_employee_count,
          })
          .where(eq(businessTable.vendor_id, vendorProfile.vendor_id)),
      ]);
    });

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new InternalServerError(
      "Failed to update profile",
      "UPDATE_PROFILE_ERROR"
    );
  }
};

// QUERY
////////////////////////////////////////////////////////////////////

export const vendors = async (data: VendorsQueryInput) => {
  try {
    const { page = 1, limit = 10, status, search } = data;
    const offset = (Number(page) - 1) * Number(limit);

    let conditions: SQL | undefined = eq(usersTable.role, "vendor");

    if (status && status !== "all" && typeof status === "string") {
      conditions = and(
        conditions,
        eq(vendorProfileTable.vendor_status, status as VENDOR_STATUS)
      );
    }

    if (search && typeof search === "string") {
      conditions = and(
        conditions,
        or(
          like(usersTable.full_name, `%${search}%`),
          like(usersTable.email, `%${search}%`),
          like(businessTable.biz_legal_name, `%${search}%`),
          like(businessTable.biz_trade_name, `%${search}%`)
        )
      );
    }

    const vendors = await db
      .select({
        vendor_id: vendorProfileTable.vendor_id,
        email: usersTable.email,
        created_at: usersTable.created_at,
        full_name: usersTable.full_name,
        vendor_status: vendorProfileTable.vendor_status,
        business_name: businessTable.biz_legal_name,
      })
      .from(vendorProfileTable)
      .where(conditions)
      .limit(Number(limit))
      .offset(offset)
      .leftJoin(usersTable, eq(usersTable.user_id, vendorProfileTable.user_id))
      .leftJoin(
        businessTable,
        eq(vendorProfileTable.vendor_id, businessTable.vendor_id)
      )
      .orderBy(desc(usersTable.created_at), desc(usersTable.user_id));

    const [totalVendors] = await db
      .select({ count: count() })
      .from(vendorProfileTable)
      .leftJoin(usersTable, eq(usersTable.user_id, vendorProfileTable.user_id))
      .leftJoin(
        businessTable,
        eq(vendorProfileTable.vendor_id, businessTable.vendor_id)
      )
      .where(conditions);

    const totalCount = totalVendors.count;
    const totalPages = Math.ceil(totalCount / Number(limit));

    return {
      vendors,
      totalVendors: totalCount,
      totalPages,
      page: Number(page),
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new InternalServerError(
      "Failed to fetch vendors",
      "FETCH_VENDORS_ERROR"
    );
  }
};

/**
 * Get vendor details by ID
 */
export const vendorDetails = async (vendorId: string) => {
  try {
    const [vendorDetails] = await db
      .select({
        vendor: {
          vendor_id: vendorProfileTable.vendor_id,
          user_id: vendorProfileTable.user_id,
        },
        user: {
          user_id: usersTable.user_id,
          email: usersTable.email,
          role: usersTable.role,
          created_at: usersTable.created_at,
          full_name: usersTable.full_name,
          vendor_id: vendorProfileTable.vendor_id,
          vendor_code: vendorProfileTable.vendor_code,
          vendor_source: vendorProfileTable.vendor_source,
          vendor_status: vendorProfileTable.vendor_status,
          vendor_contact: vendorProfileTable.vendor_contact,
          vendor_alt_contact: vendorProfileTable.vendor_alt_contact,
          vendor_pan_number: vendorProfileTable.vendor_pan_number,
          vendor_pan_doc_key: vendorProfileTable.vendor_pan_doc_key,
          vendor_image_key: vendorProfileTable.vendor_image_key,
          vendor_adhar_doc_key: vendorProfileTable.vendor_adhar_doc_key,
          vendor_rejection_reason: vendorProfileTable.vendor_rejection_reason,
          vendor_updated_at: vendorProfileTable.updated_at,
        },
        business: {
          business_id: businessTable.business_id,
          biz_legal_name: businessTable.biz_legal_name,
          biz_trade_name: businessTable.biz_trade_name,
          biz_classification: businessTable.biz_classification,
          biz_reg_number: businessTable.biz_reg_number,
          biz_reg_doc_key: businessTable.biz_reg_doc_key,
          biz_established_year: businessTable.biz_established_year,
          biz_addr_line1: businessTable.biz_addr_line1,
          biz_addr_line2: businessTable.biz_addr_line2,
          biz_locality: businessTable.biz_locality,
          biz_city: businessTable.biz_city,
          biz_pin_code: businessTable.biz_pin_code,
          biz_country: businessTable.biz_country,
          biz_state: businessTable.biz_state,
          biz_gst_number: businessTable.biz_gst_number,
          biz_gst_doc_key: businessTable.biz_gst_doc_key,
          biz_bank_doc_key: businessTable.biz_bank_doc_key,
          biz_msme_cert_doc_key: businessTable.biz_msme_cert_doc_key,
          biz_website: businessTable.biz_website,
          biz_email: businessTable.biz_email,
          biz_phone: businessTable.biz_phone,
          biz_3_year_turnover: businessTable.biz_3_year_turnover,
          biz_employee_count: businessTable.biz_employee_count,
          biz_created_at: businessTable.created_at,
          biz_updated_at: businessTable.updated_at,
        },
      })
      .from(vendorProfileTable)
      .where(eq(vendorProfileTable.vendor_id, Number(vendorId)))
      .leftJoin(usersTable, eq(usersTable.user_id, vendorProfileTable.user_id))
      .leftJoin(
        businessTable,
        eq(vendorProfileTable.vendor_id, businessTable.vendor_id)
      )
      .limit(1);

    if (!vendorDetails) {
      throw new NotFoundError("Vendor not found", "VENDOR_NOT_FOUND");
    }

    return vendorDetails;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new InternalServerError(
      "Failed to fetch vendor details",
      "FETCH_VENDOR_DETAILS_ERROR"
    );
  }
};

/**
 * Get approved vendors for selection in tender creation
 */
export const vendorForSelection = async (data: VendorForSelectionInput) => {
  try {
    const { search, page = 1, limit = 10 } = data;
    const offset = (Number(page) - 1) * Number(limit);

    let conditions = and(
      eq(usersTable.role, "vendor"),
      eq(vendorProfileTable.vendor_status, VENDOR_STATUS.APPROVED)
    );

    if (search) {
      const searchTerm = `%${search}%`;
      conditions = and(
        conditions,
        or(
          like(usersTable.full_name, searchTerm),
          like(usersTable.email, searchTerm)
        )
      );
    }

    // Get vendors without category joins to avoid duplicates
    const vendors = await db
      .select({
        user_id: usersTable.user_id,
        full_name: usersTable.full_name,
        email: usersTable.email,
      })
      .from(usersTable)
      .where(conditions)
      .leftJoin(
        vendorProfileTable,
        eq(usersTable.user_id, vendorProfileTable.user_id)
      )
      .limit(Number(limit))
      .offset(offset)
      .orderBy(desc(usersTable.created_at))
      .groupBy(usersTable.user_id);

    // Count total vendors
    const [totalVendors] = await db
      .select({ count: count() })
      .from(usersTable)
      .leftJoin(
        vendorProfileTable,
        eq(usersTable.user_id, vendorProfileTable.user_id)
      )
      .where(conditions);

    const totalCount = totalVendors.count;
    const totalPages = Math.ceil(totalCount / Number(limit));

    return {
      vendors,
      page: Number(page),
      totalPages,
      totalCount,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new InternalServerError(
      "Failed to fetch vendors for selection",
      "FETCH_VENDORS_SELECTION_ERROR"
    );
  }
};

/**
 * Get vendor profile by user ID (for vendor self-view)
 */
export const vendorProfileByUserId = async (userId: number) => {
  try {
    const [vendorDetails] = await db
      .select({
        user: {
          user_id: usersTable.user_id,
          email: usersTable.email,
          role: usersTable.role,
          created_at: usersTable.created_at,
          full_name: usersTable.full_name,
          vendor_id: vendorProfileTable.vendor_id,
          vendor_code: vendorProfileTable.vendor_code,
          vendor_status: vendorProfileTable.vendor_status,
          vendor_contact: vendorProfileTable.vendor_contact,
          vendor_alt_contact: vendorProfileTable.vendor_alt_contact,
          vendor_pan_number: vendorProfileTable.vendor_pan_number,
          vendor_pan_doc_key: vendorProfileTable.vendor_pan_doc_key,
          vendor_image_key: vendorProfileTable.vendor_image_key,
          vendor_adhar_doc_key: vendorProfileTable.vendor_adhar_doc_key,
        },
        business: {
          business_id: businessTable.business_id,
          biz_legal_name: businessTable.biz_legal_name,
          biz_trade_name: businessTable.biz_trade_name,
          biz_classification: businessTable.biz_classification,
          biz_reg_number: businessTable.biz_reg_number,
          biz_reg_doc_key: businessTable.biz_reg_doc_key,
          biz_established_year: businessTable.biz_established_year,
          biz_addr_line1: businessTable.biz_addr_line1,
          biz_addr_line2: businessTable.biz_addr_line2,
          biz_locality: businessTable.biz_locality,
          biz_city: businessTable.biz_city,
          biz_pin_code: businessTable.biz_pin_code,
          biz_country: businessTable.biz_country,
          biz_state: businessTable.biz_state,
          biz_msme_cert_doc_key: businessTable.biz_msme_cert_doc_key,
          biz_gst_number: businessTable.biz_gst_number,
          biz_gst_doc_key: businessTable.biz_gst_doc_key,
          biz_bank_doc_key: businessTable.biz_bank_doc_key,
          biz_website: businessTable.biz_website,
          biz_email: businessTable.biz_email,
          biz_phone: businessTable.biz_phone,
          biz_3_year_turnover: businessTable.biz_3_year_turnover,
          biz_employee_count: businessTable.biz_employee_count,
        },
      })
      .from(vendorProfileTable)
      .where(eq(vendorProfileTable.user_id, userId))
      .leftJoin(usersTable, eq(usersTable.user_id, vendorProfileTable.user_id))
      .leftJoin(
        businessTable,
        eq(vendorProfileTable.vendor_id, businessTable.vendor_id)
      )
      .limit(1);

    if (!vendorDetails) {
      throw new NotFoundError(
        "Vendor profile not found",
        "VENDOR_PROFILE_NOT_FOUND"
      );
    }

    return { vendorDetails };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new InternalServerError(
      "Failed to fetch vendor profile",
      "FETCH_VENDOR_PROFILE_ERROR"
    );
  }
};
