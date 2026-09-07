import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { Context, AuthenticatedContext } from "./context";
import { ROLES } from "@/lib/server/constants";
import { ZodError } from "zod";

/**
 * Initialize tRPC with context and superjson transformer
 */
export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        // Include the error code for frontend handling
        code: error.code,
        // Include Zod validation errors if present
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
        // Provide a user-friendly message
        message: shape.message,
      },
    };
  },
});

export const router = t.router;

/**
 * Public procedure - accessible to everyone
 */
export const publicProcedure = t.procedure;

/**
 * Protected procedure - requires authentication via NextAuth
 * Returns properly typed context with user
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  // Check NextAuth session
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user, // Now properly typed, no 'as any' needed
    } as AuthenticatedContext,
  });
});

/**
 * Admin-only procedure - requires admin or super_admin role
 */
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const role = ctx.user.role; // Type-safe access

  if (role !== ROLES.ADMIN && role !== ROLES.SUPER_ADMIN) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }

  return next({ ctx });
});

/**
 * Vendor-only procedure - requires vendor role
 */
export const vendorProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const role = ctx.user.role; // Type-safe access

  if (role !== ROLES.VENDOR) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Vendor access required",
    });
  }

  return next({ ctx });
});

/**
 * Super Admin-only procedure - requires super_admin role
 */
export const superAdminProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const role = ctx.user.role; // Type-safe access

    if (role !== ROLES.SUPER_ADMIN) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Super Admin access required",
      });
    }

    return next({ ctx });
  }
);
