import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UnauthorizedError, ForbiddenError } from "./errors";
import { ROLES } from "./constants";

export interface AuthContext {
  user_id: number;
  email: string;
  role: ROLES;
}

/**
 * Get authenticated user from NextAuth session
 */
export async function getAuthUser(): Promise<AuthContext> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new UnauthorizedError("Authentication required", "UNAUTHORIZED");
  }

  const user = session.user as {
    id: string;
    email?: string | null;
    role?: string;
  };
  return {
    user_id: parseInt(user.id),
    email: user.email!,
    role: user.role as ROLES,
  };
}

/**
 * Verify user has required role
 */
export function verifyRole(user: AuthContext, allowedRoles: ROLES[]): void {
  if (!allowedRoles.includes(user.role)) {
    throw new ForbiddenError("Insufficient permissions", "FORBIDDEN");
  }
}

/**
 * Combine auth check and role verification
 * Use this in API routes to require authentication and optionally specific roles
 */
export async function requireAuth(
  allowedRoles?: ROLES[]
): Promise<AuthContext> {
  const user = await getAuthUser();

  if (allowedRoles && allowedRoles.length > 0) {
    verifyRole(user, allowedRoles);
  }

  return user;
}
