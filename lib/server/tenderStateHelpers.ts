/**
 * Tender State Helpers
 *
 * Single source of truth for tender state calculation.
 *
 * Key Concepts:
 * - tender_is_active: ONLY indicates approval/publish status (Super Admin approved)
 * - Tender states are calculated STRICTLY from dates
 *
 * Tender State Logic (Date-Based):
 *
 * 1. NOT_YET_OPEN (Scheduled):
 *    - current_date < release_date
 *    - Hidden from vendors, visible in admin dashboard as "Scheduled"
 *
 * 2. OPEN (Live):
 *    - release_date <= current_date < deadline
 *    - Visible to vendors, can submit bids
 *    - Submitted bids hidden from both vendors and admins
 *
 * 3. CLOSED:
 *    - current_date >= deadline
 *    - Shown as "Closed" to vendors, bidding disabled
 *    - Admin can see all bids and evaluate
 *
 * Document Visibility:
 * - Technical: Hidden until tender_technical_bid_opening has passed
 * - Financial: Hidden until tender_financial_bid_opening has passed
 */

import { normalizeDbDate } from "@/utils/normalizeDbDate";

// Tender state enum
export enum TenderState {
  SCHEDULED = "scheduled", // Not yet released
  LIVE = "live", // Open for bidding
  CLOSED = "closed", // Deadline passed
}

// Input type for tender state calculation
export interface TenderDates {
  tender_is_active?: boolean | null;
  tender_release_date?: Date | string | null;
  tender_bid_submission_deadline?: Date | string | null;
  tender_technical_bid_opening?: Date | string | null;
  tender_financial_bid_opening?: Date | string | null;
}

// Output type for tender timeline status
export interface TenderTimelineStatus {
  state: TenderState;
  isApproved: boolean;
  isReleased: boolean;
  isBidSubmissionOpen: boolean;
  isBidSubmissionClosed: boolean;
  canShowTechnicalDoc: boolean;
  canShowFinancialDoc: boolean;
  releaseDate: Date | null;
  bidDeadline: Date | null;
  technicalOpeningDate: Date | null;
  financialOpeningDate: Date | null;
}

/**
 * Get the current tender state based on dates
 *
 * @param tender - Object containing tender date fields
 * @param currentTime - Optional current time for testing (defaults to now)
 * @returns The tender state (scheduled, live, closed)
 */
export function getTenderState(
  tender: TenderDates,
  currentTime?: Date,
): TenderState {
  const now = currentTime || new Date();
  const releaseDate = normalizeDbDate(tender.tender_release_date);
  const bidDeadline = normalizeDbDate(tender.tender_bid_submission_deadline);

  // If release date is in the future, tender is scheduled (not yet open)
  if (releaseDate && releaseDate > now) {
    return TenderState.SCHEDULED;
  }

  // If bid deadline has passed, tender is closed
  if (bidDeadline && bidDeadline <= now) {
    return TenderState.CLOSED;
  }

  // Otherwise, tender is live (open for bidding)
  return TenderState.LIVE;
}

/**
 * Get comprehensive tender timeline status
 *
 * @param tender - Object containing tender date fields
 * @param currentTime - Optional current time for testing
 * @returns Complete timeline status with all flags
 */
export function getTenderTimelineStatus(
  tender: TenderDates,
  currentTime?: Date,
): TenderTimelineStatus {
  const now = currentTime || new Date();
  const releaseDate = normalizeDbDate(tender.tender_release_date);
  const bidDeadline = normalizeDbDate(tender.tender_bid_submission_deadline);
  const technicalOpeningDate = normalizeDbDate(
    tender.tender_technical_bid_opening,
  );
  const financialOpeningDate = normalizeDbDate(
    tender.tender_financial_bid_opening,
  );

  const state = getTenderState(tender, now);
  const isApproved = tender.tender_is_active === true;
  const isReleased = releaseDate ? releaseDate <= now : false;
  const isBidSubmissionOpen = state === TenderState.LIVE;
  const isBidSubmissionClosed = state === TenderState.CLOSED;
  const canShowTechnicalDoc = technicalOpeningDate
    ? technicalOpeningDate <= now
    : false;
  const canShowFinancialDoc = financialOpeningDate
    ? financialOpeningDate <= now
    : false;

  return {
    state,
    isApproved,
    isReleased,
    isBidSubmissionOpen,
    isBidSubmissionClosed,
    canShowTechnicalDoc,
    canShowFinancialDoc,
    releaseDate,
    bidDeadline,
    technicalOpeningDate,
    financialOpeningDate,
  };
}

/**
 * Check if vendors can view this tender
 *
 * Rules:
 * - tender_is_active must be true (approved by Super Admin)
 * - current_date >= release_date (tender has been released)
 *
 * @param tender - Tender with date fields
 * @param currentTime - Optional current time
 * @returns boolean indicating if vendors can view the tender
 */
export function canVendorsViewTender(
  tender: TenderDates,
  currentTime?: Date,
): boolean {
  const now = currentTime || new Date();
  const releaseDate = normalizeDbDate(tender.tender_release_date);

  // Must be approved by Super Admin
  if (!tender.tender_is_active) {
    return false;
  }

  // Release date must have passed
  if (releaseDate && releaseDate > now) {
    return false;
  }

  return true;
}

/**
 * Check if bid submission is currently allowed
 *
 * Rules:
 * - tender_is_active must be true
 * - release_date <= current_date < bid_submission_deadline
 *
 * @param tender - Tender with date fields
 * @param currentTime - Optional current time
 * @returns boolean indicating if bid submission is allowed
 */
export function canSubmitBid(tender: TenderDates, currentTime?: Date): boolean {
  const now = currentTime || new Date();

  // Must be approved
  if (!tender.tender_is_active) {
    return false;
  }

  const state = getTenderState(tender, now);
  return state === TenderState.LIVE;
}

/**
 * Check if bids should be visible to admins
 *
 * Rules:
 * - Bids are visible only after bid_submission_deadline has passed
 *
 * @param tender - Tender with date fields
 * @param currentTime - Optional current time
 * @returns boolean indicating if bids should be visible
 */
export function canViewBids(tender: TenderDates, currentTime?: Date): boolean {
  const now = currentTime || new Date();
  const bidDeadline = normalizeDbDate(tender.tender_bid_submission_deadline);

  // Bids visible only after deadline passes
  return bidDeadline ? bidDeadline <= now : false;
}

/**
 * Check if technical documents should be visible
 *
 * Rules:
 * - Documents visible only after tender_technical_bid_opening has passed
 *
 * @param tender - Tender with date fields
 * @param currentTime - Optional current time
 * @returns boolean
 */
export function canShowTechnicalDocuments(
  tender: TenderDates,
  currentTime?: Date,
): boolean {
  const now = currentTime || new Date();
  const technicalOpeningDate = normalizeDbDate(
    tender.tender_technical_bid_opening,
  );

  return technicalOpeningDate ? technicalOpeningDate <= now : false;
}

/**
 * Check if financial documents should be visible
 *
 * Rules:
 * - Documents visible only after tender_financial_bid_opening has passed
 *
 * @param tender - Tender with date fields
 * @param currentTime - Optional current time
 * @returns boolean
 */
export function canShowFinancialDocuments(
  tender: TenderDates,
  currentTime?: Date,
): boolean {
  const now = currentTime || new Date();
  const financialOpeningDate = normalizeDbDate(
    tender.tender_financial_bid_opening,
  );

  return financialOpeningDate ? financialOpeningDate <= now : false;
}

/**
 * Get the "isLive" status for display purposes
 * This is used by TenderCard and Tender.tsx to show "Live" or "Closed"
 *
 * @param tender - Tender with date fields
 * @param currentTime - Optional current time
 * @returns boolean - true if tender is live (open for bidding)
 */
export function isTenderLive(tender: TenderDates, currentTime?: Date): boolean {
  return getTenderState(tender, currentTime) === TenderState.LIVE;
}

/**
 * Format current time as SQL datetime string for database queries
 * MySQL datetime fields are stored without timezone, so we compare with local time
 *
 * @param currentTime - Optional time (defaults to now)
 * @returns Formatted string 'YYYY-MM-DD HH:mm:ss'
 */
export function getCurrentTimeFormatted(currentTime?: Date): string {
  const now = currentTime || new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(now.getDate()).padStart(2, "0")} ${String(
    now.getHours(),
  ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
    now.getSeconds(),
  ).padStart(2, "0")}`;
}
