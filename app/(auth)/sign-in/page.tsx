"use client";
import SigninForm from "@/components/Auth/Signin/SigninForm";
import { useLoginUserMutation } from "@/Redux/auth/authApi";
import { ApiError, ISigninInputs } from "@/Types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ErrorCodes } from "@/lib/errorCodes";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const router = useRouter();

  async function onSubmit(data: ISigninInputs) {
    try {
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", data.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      const result = await loginUser(data).unwrap();
      if (result.success) {
        router.push("/");
        toast.success("Sign In Successfully!");
      }
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.data?.errorCode && ErrorCodes[apiError.data.errorCode]) {
        toast.error(ErrorCodes[apiError.data.errorCode]);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  }

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setRememberMe(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SigninForm
      isLoading={isLoading}
      onSubmit={onSubmit}
      showPassword={showPassword}
      togglePasswordVisibility={togglePasswordVisibility}
      rememberMe={rememberMe}
      setRememberMe={setRememberMe}
    />
  );
};

export default SignIn;
