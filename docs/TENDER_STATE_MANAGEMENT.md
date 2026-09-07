# Tender State Management

This document describes the centralized tender state logic used across the application.

## Key Concepts

### `tender_is_active` Field

The `tender_is_active` field **ONLY** indicates approval/publish status:

| Value   | Meaning                                                        |
| ------- | -------------------------------------------------------------- |
| `false` | Tender is under review by Super Admin (not visible to vendors) |
| `true`  | Super Admin has approved and published the tender              |

**Important:** This field does NOT determine if a tender is live, open, or closed. Those states are calculated from dates.

---

## Tender State Logic (Date-Based)

All tender states are calculated **strictly from dates**, not from `tender_is_active`.

### State Definitions

| State         | Condition                                 | Vendor Behavior                     | Admin Behavior                     |
| ------------- | ----------------------------------------- | ----------------------------------- | ---------------------------------- |
| **SCHEDULED** | `current_date < release_date`             | Tender is hidden                    | Shows as "Scheduled" or "Upcoming" |
| **LIVE**      | `release_date <= current_date < deadline` | Can view tender and submit bids     | Shows as "Accepting Bids"          |
| **CLOSED**    | `current_date >= deadline`                | Shows as "Closed", bidding disabled | Can view all bids and evaluate     |

### Visualization

```
Timeline: ────────────────────────────────────────────────────────>
                    │                              │
              release_date                  bid_deadline
                    │                              │
    ┌───────────────┼──────────────────────────────┼───────────────┐
    │  SCHEDULED    │           LIVE               │    CLOSED     │
    │  (hidden)     │  (visible, can bid)          │ (no bidding)  │
    └───────────────┴──────────────────────────────┴───────────────┘
```

---

## Document Visibility

Technical and Financial documents have their own visibility rules:

| Document Type           | Visibility Rule                                        |
| ----------------------- | ------------------------------------------------------ |
| **Technical Documents** | Hidden until `tender_technical_bid_opening` has passed |
| **Financial Documents** | Hidden until `tender_financial_bid_opening` has passed |

---

## API Reference

### Server-Side Helpers

Located in: `lib/server/tenderStateHelpers.ts`

```typescript
import {
  getTenderState,
  getTenderTimelineStatus,
  canVendorsViewTender,
  canSubmitBid,
  canViewBids,
  canShowTechnicalDocuments,
  canShowFinancialDocuments,
  isTenderLive,
  getCurrentTimeFormatted,
  TenderState,
} from "@/lib/server/tenderStateHelpers";
```

#### Functions

| Function                            | Description                                          |
| ----------------------------------- | ---------------------------------------------------- |
| `getTenderState(tender)`            | Returns `TenderState.SCHEDULED`, `LIVE`, or `CLOSED` |
| `getTenderTimelineStatus(tender)`   | Returns comprehensive timeline status with all flags |
| `canVendorsViewTender(tender)`      | Check if tender is visible to vendors                |
| `canSubmitBid(tender)`              | Check if bid submission is allowed                   |
| `canViewBids(tender)`               | Check if bids should be visible to admins            |
| `canShowTechnicalDocuments(tender)` | Check if technical docs are visible                  |
| `canShowFinancialDocuments(tender)` | Check if financial docs are visible                  |
| `isTenderLive(tender)`              | Shorthand for checking if tender is in LIVE state    |
| `getCurrentTimeFormatted()`         | Get current time as SQL datetime string              |

### Client-Side Helpers

Located in: `utils/tenderStateHelpers.ts`

```typescript
import {
  getTenderState,
  isTenderLive,
  isTenderClosed,
  isTenderScheduled,
  canVendorsViewTender,
  canSubmitBid,
  canShowTechnicalDocuments,
  canShowFinancialDocuments,
  getTenderStateDisplay,
  TenderState,
} from "@/utils/tenderStateHelpers";
```

---

## Usage Examples

### Checking if vendor can submit a bid

```typescript
// Server-side
import { canSubmitBid } from "@/lib/server/tenderStateHelpers";

if (!canSubmitBid(tender)) {
  throw new BadRequestError("Bid submission deadline has passed");
}

// Client-side
import { canSubmitBid } from "@/utils/tenderStateHelpers";

const canBid = canSubmitBid(tender);
```

### Getting tender display state

```typescript
import { getTenderStateDisplay } from "@/utils/tenderStateHelpers";

const stateText = getTenderStateDisplay(tender); // "Live", "Closed", or "Scheduled"
```

### Checking document visibility

```typescript
import { getTenderTimelineStatus } from "@/lib/server/tenderStateHelpers";

const status = getTenderTimelineStatus(tender);

if (status.canShowTechnicalDoc) {
  // Show technical document
}

if (status.canShowFinancialDoc) {
  // Show financial document
}
```

---

## Files Modified

The following files use the centralized tender state helpers:

### Backend

- `server/trpc/routers/tender/tender.service.ts` - Uses `isTenderLive()`, `getCurrentTimeFormatted()`
- `server/trpc/routers/bid/bid.service.ts` - Uses `getTenderTimelineStatus()`, `canSubmitBid()`

### Frontend

- `app/tender/buy/[tenderId]/_components/BuyTender.tsx` - Validates tender is live before allowing purchase
- `app/tender/[tenderId]/_components/Tender.tsx` - Uses `isLive` from API response
- `app/_components/TenderCard.tsx` - Displays Live/Closed based on `isLive` flag
- `app/(dashboards)/admin/live/_components/LiveTenders.tsx` - Filters by tender state tabs

---

## Backwards Compatibility

The API responses continue to include an `isLive` boolean flag for frontend compatibility:

- `isLive: true` → Tender is in LIVE state (open for bidding)
- `isLive: false` → Tender is CLOSED (deadline has passed)
