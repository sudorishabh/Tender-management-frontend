"use client";
import { ApiError, ISigninInputs } from "@/app/Types";
import { useLoginUserMutation } from "@/Redux/auth/authApi";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { primaryButtonStyle } from "@/app/Styles";
import { ErrorCodes } from "@/lib/errorCodes";
import { cn } from "@/lib/utils";

const SigninForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISigninInputs>();

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
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='bg-white shadow-sm border-b mb-8 rounded-t-xl'>
          <div className='px-6 py-8'>
            <div className='flex items-center gap-3 mb-4 justify-center'>
              <div className='bg-primary/10 rounded-full p-3'>
                <LogIn className='h-6 w-6 text-primary' />
              </div>
            </div>
            <h1 className='text-3xl font-bold text-gray-900 text-center'>
              Sign In
            </h1>
            <p className='text-gray-600 mt-2 text-center'>
              Welcome back! Sign in to access your account.
            </p>
          </div>
        </div>

        {/* Main Form */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
          <div className='p-6'>
            <div className='space-y-6'>
              <div className='bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-center gap-3'>
                <Info
                  className='text-blue-600 shrink-0'
                  size={18}
                />
                <p className='text-sm text-gray-700'>
                  Enter your credentials to access your vendor dashboard and
                  manage your tenders.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className='space-y-5'>
                <div className='space-y-1.5'>
                  <label
                    htmlFor='email'
                    className='text-sm font-medium text-gray-700 flex items-center gap-1.5'>
                    <Mail
                      size={15}
                      className='text-gray-500'
                    />
                    Email Address
                    <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <Input
                      id='email'
                      type='email'
                      placeholder='you@example.com'
                      className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30 pl-3'
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      defaultValue={
                        localStorage.getItem("rememberedEmail") || ""
                      }
                    />
                  </div>
                  {errors.email && (
                    <p className='text-red-600 text-[0.85rem] ml-0.5 mt-1.5'>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className='space-y-1.5'>
                  <div className='flex items-center justify-between'>
                    <label
                      htmlFor='password'
                      className='text-sm font-medium text-gray-700 flex items-center gap-1.5'>
                      <Lock
                        size={15}
                        className='text-gray-500'
                      />
                      Password
                      <span className='text-red-500'>*</span>
                    </label>
                    <Link
                      href='/forgot-password'
                      className='text-xs text-primary hover:text-primary/90 hover:underline font-medium'>
                      Forgot password?
                    </Link>
                  </div>
                  <div className='relative'>
                    <Input
                      id='password'
                      type={showPassword ? "text" : "password"}
                      placeholder='••••••••••'
                      className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30 pr-10 placeholder:text-gray-400'
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />
                    <button
                      type='button'
                      className='absolute inset-y-0 right-0 flex items-center pr-3'
                      onClick={togglePasswordVisibility}>
                      {showPassword ? (
                        <EyeOff className='h-4 w-4 text-gray-400 hover:text-gray-600' />
                      ) : (
                        <Eye className='h-4 w-4 text-gray-400 hover:text-gray-600' />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className='text-red-600 text-[0.85rem] ml-0.5 mt-1.5'>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className='flex items-center space-x-2 mt-2'>
                  <Checkbox
                    id='remember'
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                    className='data-[state=checked]:bg-primary data-[state=checked]:border-primary'
                  />
                  <label
                    htmlFor='remember'
                    className='text-sm text-gray-600 cursor-pointer flex items-center'>
                    Remember me
                  </label>
                </div>

                <Button
                  type='submit'
                  className={cn(primaryButtonStyle, {
                    "w-full": true,
                    "opacity-50": isLoading,
                  })}
                  disabled={isLoading}>
                  {isLoading ? (
                    <div className='flex items-center justify-center'>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className='flex items-center justify-center'>
                      <span>Sign in</span>
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </div>
                  )}
                </Button>
              </form>

              <div className='flex items-center pt-2 my-3'>
                <Separator className='flex-1' />
                <span className='px-3 text-xs text-gray-500'>OR</span>
                <Separator className='flex-1' />
              </div>

              <div className='text-center'>
                <p className='text-sm text-gray-600'>
                  Don&apos;t have an account?{" "}
                  <Link
                    href='/register'
                    className='text-primary hover:text-primary/90 font-medium hover:underline'>
                    Register Now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-center mt-6'>
          <ShieldCheck className='h-4 w-4 text-gray-400 mr-1.5' />
          <p className='text-xs text-gray-500'>
            Secure authentication. We don&apos;t store your password.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SigninForm;
