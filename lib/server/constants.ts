// Enums
export enum ROLES {
  VENDOR = "vendor",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

export enum VENDOR_STATUS {
  PENDING = "pending",
  REJECTED = "rejected",
  APPROVED = "approved",
}

export enum TENDER_STATUS {
  DRAFT = "draft",
  PUBLISHED = "published",
  REVIEW = "review",
  RESCHEDULED = "rescheduled",
}

export enum BID_STATUS {
  SELECTED = "selected",
  RANKED = "ranked",
  UNDER_REVIEW = "under_review",
  REJECTED = "rejected",
  APPROVED = "approved",
}

export enum NOTIFICATION_TYPE {
  BID_STATUS = "bid_status",
  TENDER_UPDATE = "tender_update",
  ACCOUNT = "account",
  CLARIFICATION = "clarification",
  SYSTEM = "system",
}

// Constants
export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: Number(process.env.ONE_HOUR_MS) || 3600000, // 1 hour
  REFRESH_TOKEN: Number(process.env.FIFTEEN_DAYS_MS) || 1296000000, // 15 days
};

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};
