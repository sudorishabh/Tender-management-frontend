import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Session } from "next-auth";

/**
 * Create tRPC context for each request
 * This provides authentication data to all tRPC procedures using NextAuth
 */
export async function createContext({ req }: { req: Request }) {
  // Get NextAuth session (now properly typed)
  const session = await getServerSession(authOptions);

  return {
    session,
    req,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

/**
 * Authenticated context with user information
 */
export type AuthenticatedContext = Context & {
  user: NonNullable<Session["user"]>;
};
