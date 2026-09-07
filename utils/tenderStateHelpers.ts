/**
 * Frontend Tender State Helpers
 *
 * Client-side utilities for determining tender state and visibility.
 * These mirror the server-side helpers for consistent behavior.
 *
 * Important:
 * - tender_is_active: ONLY indicates approval/publish status
 * - Tender states are calculated STRICTLY from dates
 */

// Tender state enum (matches server-side)
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

/**
 * Normalize a date from various formats to a Date object
 * Handles both Date objects and string dates correctly
 */
function normalizeDate(
  dateInput: Date | string | null | undefined
): Date | null {
  if (!dateInput) return null;

  if (typeof dateInput === "string") {
    // Parse string as local time
    const normalized = dateInput.replace("T", " ").split(".")[0];
    const [datePart, timePart] = normalized.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes, seconds] = (timePart || "00:00:00")
      .split(":")
      .map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds || 0);
  }

  // Date object - use UTC values as local values (matches server behavior)
  const year = dateInput.getUTCFullYear();
  const month = dateInput.getUTCMonth();
  const day = dateInput.getUTCDate();
  const hours = dateInput.getUTCHours();
  const minutes = dateInput.getUTCMinutes();
  const seconds = dateInput.getUTCSeconds();

  return new Date(year, month, day, hours, minutes, seconds);
}

/**
 * Get the current tender state based on dates
 *
 * @param tender - Object containing tender date fields
 * @returns The tender state (scheduled, live, closed)
 */
export function getTenderState(tender: TenderDates): TenderState {
  const now = new Date();
  const releaseDate = normalizeDate(tender.tender_release_date);
  const bidDeadline = normalizeDate(tender.tender_bid_submission_deadline);

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
 * Check if the tender is currently live (open for bidding)
 *
 * @param tender - Tender with date fields
 * @returns boolean - true if tender is live
 */
export function isTenderLive(tender: TenderDates): boolean {
  return getTenderState(tender) === TenderState.LIVE;
}

/**
 * Check if the tender is closed (deadline passed)
 *
 * @param tender - Tender with date fields
 * @returns boolean - true if tender is closed
 */
export function isTenderClosed(tender: TenderDates): boolean {
  return getTenderState(tender) === TenderState.CLOSED;
}

/**
 * Check if the tender is scheduled (not yet released)
 *
 * @param tender - Tender with date fields
 * @returns boolean - true if tender is scheduled
 */
export function isTenderScheduled(tender: TenderDates): boolean {
  return getTenderState(tender) === TenderState.SCHEDULED;
}

/**
 * Check if vendors can view this tender
 *
 * Rules:
 * - tender_is_active must be true (approved by Super Admin)
 * - current_date >= release_date (tender has been released)
 *
 * @param tender - Tender with date fields
 * @returns boolean indicating if vendors can view the tender
 */
export function canVendorsViewTender(tender: TenderDates): boolean {
  const now = new Date();
  const releaseDate = normalizeDate(tender.tender_release_date);

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
 * @param tender - Tender with date fields
 * @returns boolean indicating if bid submission is allowed
 */
export function canSubmitBid(tender: TenderDates): boolean {
  // Must be approved
  if (!tender.tender_is_active) {
    return false;
  }

  return getTenderState(tender) === TenderState.LIVE;
}

/**
 * Check if technical documents should be visible
 *
 * @param tender - Tender with date fields
 * @returns boolean
 */
export function canShowTechnicalDocuments(tender: TenderDates): boolean {
  const now = new Date();
  const technicalOpeningDate = normalizeDate(
    tender.tender_technical_bid_opening
  );

  return technicalOpeningDate ? technicalOpeningDate <= now : false;
}

/**
 * Check if financial documents should be visible
 *
 * @param tender - Tender with date fields
 * @returns boolean
 */
export function canShowFinancialDocuments(tender: TenderDates): boolean {
  const now = new Date();
  const financialOpeningDate = normalizeDate(
    tender.tender_financial_bid_opening
  );

  return financialOpeningDate ? financialOpeningDate <= now : false;
}

/**
 * Get display text for tender state
 *
 * @param tender - Tender with date fields
 * @returns Human-readable state text
 */
export function getTenderStateDisplay(tender: TenderDates): string {
  const state = getTenderState(tender);

  switch (state) {
    case TenderState.SCHEDULED:
      return "Scheduled";
    case TenderState.LIVE:
      return "Live";
    case TenderState.CLOSED:
      return "Closed";
    default:
      return "Unknown";
  }
}
