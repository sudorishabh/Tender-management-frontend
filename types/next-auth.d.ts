import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extended user type with role information
   */
  interface User extends DefaultUser {
    role: "vendor" | "admin" | "super_admin";
  }

  /**
   * Extended session type
   */
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: "vendor" | "admin" | "super_admin";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /**
   * Extended JWT token type
   */
  interface JWT extends DefaultJWT {
    role?: "vendor" | "admin" | "super_admin";
  }
}
