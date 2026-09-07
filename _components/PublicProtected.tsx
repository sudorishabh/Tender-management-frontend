"use client";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PageLoading from "./Shared/PageLoading";

interface Props {
  children: React.ReactNode;
}

const PublicProtected: FC<Props> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (status !== "loading") {
      if (status === "authenticated") {
        router.replace("/");
        return;
      }

      setIsAuthorized(true);
    }
  }, [status, router]);

  if (status === "loading" || isAuthorized === null) {
    return <PageLoading />;
  }

  if (isAuthorized === false) {
    return null;
  }

  return <>{children}</>;
};

export default PublicProtected;
