# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Tender Management System** built with Next.js 15 (App Router), featuring role-based access control for three user types: **Vendors**, **Admins**, and **Super Admins**. The application manages the full tender lifecycle including creation, bidding, evaluation, and vendor management.

## Development Commands

### Core Commands

- `pnpm dev` - Start development server with Turbopack (runs on http://localhost:3000)
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Database Commands (Drizzle ORM)

- `pnpm db:generate` - Generate database migrations from schema changes
- `pnpm db:migrate` - Apply pending migrations to database
- `pnpm db:studio` - Open Drizzle Studio GUI for database management

Note: Database schema is defined in `server/db/schema.ts`

## Architecture Overview

### Technology Stack

- **Framework**: Next.js 15 with App Router (Server Components + Client Components)
- **Database**: MySQL with Drizzle ORM
- **API Layer**: tRPC v11 for type-safe API calls
- **Authentication**: NextAuth.js with role-based access control
- **State Management**:
  - React Context for tender/vendor state (`context/`)
  - TanStack Query (React Query) for server state via tRPC
- **File Storage**: AWS S3 for document uploads
- **UI Components**: Radix UI primitives + shadcn/ui patterns
- **Styling**: Tailwind CSS

### Directory Structure & Key Patterns

#### Frontend Structure

- `app/` - Next.js App Router pages

  - `(auth)/` - Route group for authentication pages (sign-in, register, accept-invite)
  - `(dashboards)/` - Route group containing role-specific dashboards
    - `admin/` - Admin dashboard pages (tenders, bids, vendors, categories)
    - `vendor/` - Vendor dashboard pages (available tenders, purchased tenders, profile)
    - `super/` - Super Admin pages
  - `api/` - API routes (tRPC handler, NextAuth, S3 presigned URLs, etc.)
  - `tender/[tenderId]/` - Public tender details pages

- `_components/` - React components (aliased as `@/components/*` via webpack config)

  - **IMPORTANT**: Path alias `@/components` maps to `_components/` folder (see `next.config.ts:66-73`)
  - `ui/` - Radix-based UI primitives (button, dialog, dropdown, etc.)
  - `Bid/`, `Vendor/`, `Header/`, `Shared/` - Feature-specific components
  - `AppSidebar.tsx` - Universal sidebar supporting admin/vendor/super roles
  - `DashboardWrapper.tsx` - Layout wrapper for dashboard pages
  - `ProtectedRoute.tsx`, `PublicProtected.tsx`, `SuperAdminProtected.tsx` - Auth guards

- `_types/` - TypeScript type definitions
  - `auth/`, `bids/`, `tender/`, `vendor/` - Domain-specific types

#### Backend Structure (Server-Side)

- `server/trpc/` - tRPC configuration and routers

  - `routers/` - API route definitions organized by domain
    - `auth/` - Authentication (sign-in, register, session management)
    - `tender/` - Tender CRUD, status management, vendor selection
    - `bid/` - Bid submission, evaluation, ranking, approval
    - `vendor/` - Vendor profile management, categories
    - `admin.ts` - Admin-specific operations (dashboard stats, vendor approval)
    - `s3.ts` - S3 presigned URL generation for file uploads
  - `trpc.ts` - tRPC instance with middleware and procedure definitions:
    - `publicProcedure` - No authentication required
    - `protectedProcedure` - Requires authenticated user
    - `adminProcedure` - Requires admin or super_admin role
    - `vendorProcedure` - Requires vendor role
    - `superAdminProcedure` - Requires super_admin role
  - `context.ts` - Request context creation (includes NextAuth session)

- `server/db/` - Database layer

  - `schema.ts` - Drizzle schema definitions for all tables
  - `index.ts` - Database connection pool setup
  - `migrations/` - Generated SQL migration files

- `server/services/` - Business logic layer (queries/mutations separated)

  - `tender/`, `bid/`, `vendor-query.service.ts`, `admin-query.service.ts`, etc.

- `server/validations/` - Zod schemas for input validation

#### Supporting Directories

- `context/` - React Context providers (TenderContext, VendorContext)
- `hooks/` - Custom React hooks
  - `useUploadFileToS3.tsx` - S3 file upload with presigned URLs
  - `useDeleteFileFromS3.tsx` - S3 file deletion
  - `useLogout.tsx` - NextAuth sign-out wrapper
- `lib/` - Shared utilities
  - `trpc.ts` - Client-side tRPC setup
  - `constants.ts` - Business constants (departments, business classifications, etc.)
  - `server/` - Server-only utilities (auth, email, S3, error handling)
  - `seo.config.ts`, `structured-data.ts` - SEO configuration
- `enum/` - Enumerations used across the app

### Database Schema Highlights

Key tables (see `server/db/schema.ts`):

- `users` - User accounts with role enum (vendor/admin/super_admin)
- `vendor_profiles` - Vendor-specific data (status: pending/approved/rejected)
- `businesses` - Business information linked to vendors
- `tenders` - Tender records (status: draft/live/closed/cancelled/review/rescheduled)
- `bids` - Bid submissions (status: under_review/ranked/selected/approved/rejected)
- `tender_vendor_selections` - M:N relationship for vendor invites to tenders
- `vendor_doc_requirements` - Required documents per tender
- `bid_vendor_docs` - Uploaded bid documents
- `notifications` - User notifications
- `admin_invites` - Admin invite tokens

### tRPC Usage Patterns

**Client-side (in components):**

```typescript
import { trpc } from "@/lib/trpc";

// Query example
const { data, isLoading } = trpc.tender.getDetails.useQuery(1);

// Mutation example
const { mutate } = trpc.tender.create.useMutation();
```

**Server-side (in routers):**

```typescript
export const tenderRouter = router({
  getTenderById: protectedProcedure
    .input(z.object({ tenderId: z.number() }))
    .query(async ({ input, ctx }) => {
      // Business logic here
    }),
});
```

### Authentication & Authorization

- **NextAuth** handles session management (see `app/api/auth/[...nextauth]/route.ts`)
- Session data flows through tRPC context to all procedures
- Role-based procedures in `server/trpc/trpc.ts` enforce access control:
  - Check `ctx.session.user.role` for authorization
  - Throw `TRPCError` with code `UNAUTHORIZED` or `FORBIDDEN` for violations

### File Upload Pattern

1. Frontend requests presigned URL: `trpc.s3.getPresignedUrl.useMutation()`
2. Upload file directly to S3 using presigned URL
3. Store S3 key in database
4. Use `useUploadFileToS3` and `useDeleteFileFromS3` hooks for convenience

### Component Import Alias

**CRITICAL**: Due to webpack alias configuration (see `next.config.ts`), always use:

```typescript
import { Button } from "@/components/ui/button"; // NOT "@/_components/ui/button"
```

This alias ensures legacy imports resolve to the `_components/` folder.

### Route Protection

- Use `<ProtectedRoute>` wrapper in components requiring authentication
- Use `<PublicProtected>` for pages that should redirect authenticated users
- Use `<SuperAdminProtected>` for super admin-only pages
- Server-side: Use appropriate tRPC procedures (`adminProcedure`, `vendorProcedure`, etc.)

### Styling Conventions

- Tailwind CSS utility classes throughout
- Global styles in `app/globals.css`
- Component variants using `class-variance-authority` (CVA)
- Theme-agnostic components (supports light mode via next-themes)

### Error Handling

- tRPC errors use standard codes: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `BAD_REQUEST`
- Frontend displays errors using `sonner` toast notifications
- See `lib/server/errors.ts` for standardized error utilities

### State Management Strategy

- **Server state**: TanStack Query via tRPC (auto-caching, refetching)
- **Local UI state**: React useState/useReducer
- **Shared app state**: React Context (TenderContext, VendorContext)
- Avoid prop drilling by using context for deeply nested shared state

### Testing Database Connections

Use `server/db/index.ts` exports:

- `testConnection()` - Verify database connectivity
- `closeConnection()` - Graceful shutdown

## Common Workflows

### Adding a New tRPC Endpoint

1. Define business logic in `server/services/`
2. Add route in appropriate router (e.g., `server/trpc/routers/tender.ts`)
3. Export from `server/trpc/routers/index.ts` in `appRouter`
4. Use in frontend via `trpc.[routerName].[procedureName]`

### Creating a New Protected Page

1. Add page to `app/(dashboards)/[role]/` directory
2. Wrap content with appropriate route guard component
3. Use tRPC hooks with proper procedure (admin/vendor/protected)

### Database Schema Changes

1. Modify `server/db/schema.ts`
2. Run `pnpm db:generate` to create migration
3. Review generated SQL in `server/db/migrations/`
4. Run `pnpm db:migrate` to apply migration

### Adding S3 File Upload

1. Request presigned URL: `trpc.s3.getPresignedUrl.useMutation()`
2. Upload file to presigned URL via `fetch` or `axios`
3. Store returned S3 key in database via another mutation
4. Or use `useUploadFileToS3` hook for all-in-one solution

## Important Notes

- **Package Manager**: Uses pnpm (version 10.15.0+) - do not use npm or yarn
- **Path Aliases**: `@/*` maps to project root, `@/components/*` redirects to `_components/*`
- **Database**: Requires `DATABASE_URL` environment variable (MySQL connection string)
- **AWS**: Requires S3 credentials in environment variables for file uploads
- **NextAuth**: Requires `NEXTAUTH_SECRET` and `NEXTAUTH_URL` environment variables
- **Turbopack**: Development uses experimental Turbopack for faster builds
- **SEO**: Comprehensive metadata and structured data configured (see `lib/seo.config.ts`)
- **Components**: Many deleted from git history but still referenced - check file existence before editing
