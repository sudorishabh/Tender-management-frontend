"use client";
import Heading from "@/_components/Shared/Heading";
import PageLoading from "@/_components/Shared/PageLoading";
import BuyTender from "./_components/BuyTender";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";
import React, { use, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ROLES } from "@/lib/server/constants";

const Buy = ({ params }: { params: Promise<{ tenderId: string }> }) => {
  const resolvedParams = use(params);
  const { tenderId } = resolvedParams;
  const router = useRouter();

  const { data: session, status } = useSession();
  const user = session?.user as { id?: string; role?: string } | undefined;
  const isAuthenticated = status === "authenticated";

  const userId = user?.id;

  const role = user?.role;

  // userId is no longer sent as client input — the server derives it from the session.
  const { data, isLoading } = trpc.bid.isBidSubmitted.useQuery(
    {
      tenderId: String(tenderId),
    },
    {
      enabled: !!tenderId && !!userId && role === ROLES.VENDOR,
    }
  );

  // Handle redirects based on authentication and bid status
  useEffect(() => {
    // Priority 1: Check authentication first
    const isUnauthorized = !isAuthenticated || role !== ROLES.VENDOR;
    if (isUnauthorized) {
      router.push("/sign-in");
      toast.error("Please register or sign in as a vendor to bid");
      return;
    }

    // Priority 2: Check if bid already submitted
    if (data?.isSubmitted) {
      router.push(`/tender/${tenderId}`);
      toast.error("You have already submitted a bid for this tender");
    }
  }, [isAuthenticated, role, data, router, tenderId]);

  if (
    !isAuthenticated ||
    role !== ROLES.VENDOR ||
    isLoading ||
    data?.isSubmitted
  ) {
    return <PageLoading />;
  }

  return (
    <div className='pt-[3.5rem]'>
      <Heading
        title={`TERI - Tender Management`}
        description='A platform for vendors to bid'
        keywords='Tender, Vendor, Projects'
      />
      <BuyTender tenderId={tenderId} />
    </div>
  );
};

export default Buy;
