import React from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const router = useRouter();
  const logout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout Failed!");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { logout, isLoggingOut };
};

export default useLogout;
