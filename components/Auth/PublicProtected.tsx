"use client";
import { RootState } from "@/Redux/store";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface Props {
  children: React.ReactNode;
}

const PublicProtected: FC<Props> = ({ children }) => {
  const { isLoggedIn, isRefreshing: isLoading } = useSelector(
    (state: RootState) => state.authSlice
  );

  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        router.replace("/");
        return;
      }

      setIsAuthorized(true);
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading || isAuthorized === null) {
    return (
      <div className='w-full pt-40 flex bg-background items-center justify-center text-center'>
        <LoaderCircle className='animate-spin mx-auto' />
      </div>
    );
  }

  if (isAuthorized === false) {
    return null;
  }

  return <>{children}</>;
};

export default PublicProtected;
