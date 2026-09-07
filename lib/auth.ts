import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { db } from "@/server/db";
import { usersTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" }, // store token in cookie (JWT) — cookie + JWT style
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;

        const userRow = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, email))
          .limit(1);
        const user = userRow[0];
        if (!user) return null;

        const valid = await compare(password, user.password);
        if (!valid) return null;

        // NextAuth requires an object with at least an id or name/email
        return {
          id: String(user.user_id),
          email: user.email,
          name: user.full_name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // on initial signin, `user` is defined
      if (user) {
        token.role =
          (user as { role?: "vendor" | "admin" | "super_admin" }).role ??
          token.role;
        token.name = user.name ?? token.name;
      }
      return token;
    },
    async session({ session, token }) {
      // attach role and name to session object available on client/server
      (session.user as { id?: string; role?: unknown; name?: string | null }) =
        {
          ...session.user,
          id: token.sub,
          role: token.role,
          name: token.name as string | null,
        };
      return session;
    },
  },
  cookies: {
    // You can configure cookie name / options here
    sessionToken: {
      name: process.env.NEXTAUTH_COOKIE_NAME || "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};
