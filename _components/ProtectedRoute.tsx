"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC, ReactNode, useEffect } from "react";
import PageLoading from "./Shared/PageLoading";
import type { DbRole } from "@/lib/auth/types";

interface Props {
  children: ReactNode;
  requiredRole?: DbRole; // Optional: for more granular protection
}

const ProtectedRoute: FC<Props> = ({ children, requiredRole }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to sign-in if not authenticated
    if (status === "unauthenticated") {
      router.push("/sign-in");
      return;
    }

    // Optional: Check if user has required role
    if (requiredRole && session?.user?.role !== requiredRole) {
      router.push("/"); // or redirect to appropriate dashboard
    }
  }, [status, session, requiredRole, router]);

  // Show loading while checking authentication
  if (status === "loading") {
    return <PageLoading />;
  }

  // Show loading before redirect if not authenticated
  if (status === "unauthenticated") {
    return <PageLoading />;
  }

  // User is authenticated (and has required role if specified)
  return <>{children}</>;
};

export default ProtectedRoute;
