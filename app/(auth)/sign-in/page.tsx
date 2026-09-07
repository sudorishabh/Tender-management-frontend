"use client";

import React, { Suspense } from "react";
import { ShieldCheck, Info, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/_components/ui/separator";
import { useSearchParams } from "next/navigation";
import SignInForm from "./_components/SignInForm";

const SuccessMessage = () => {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  if (message !== "account-created") return null;

  return (
    <div className='bg-green-50 border border-green-200 p-4 mb-4'>
      <div className='flex items-center space-x-2'>
        <CheckCircle className='h-5 w-5 text-green-500' />
        <div>
          <p className='text-green-800 font-medium'>
            Account Created Successfully!
          </p>
          <p className='text-green-700 text-sm'>
            Your admin account has been created. Please sign in with your
            credentials.
          </p>
        </div>
      </div>
    </div>
  );
};

const SignIn = () => {
  return (
    <div className='bg-gray-50 min-h-screen flex flex-col items-center justify-center'>
      <div className='w-full max-w-md'>
        {/* Success Message */}
        <Suspense fallback={null}>
          <SuccessMessage />
        </Suspense>

        {/* Header */}
        <div className='mb-2 '>
          <div className='px-6 pb-2'>
            <h1 className='text-2xl font-semibold text-gray-900 text-center'>
              Sign In
            </h1>
            <p className='text-gray-600 mt- text-center'>
              Welcome back! Sign in to access your account.
            </p>
          </div>
        </div>

        {/* Main Form */}
        <div className='bg-white rounded-md shadow-lg border border-gray-300'>
          <div className='p-6'>
            <div className='space-y-6'>
              <div className='bg-primary/5 p-4 rounded-md border border-primary/30 flex  gap-3'>
                <Info
                  className='text-primary shrink-0'
                  size={18}
                />
                <p className='text-xs text-gray-700'>
                  Enter your credentials to access your vendor dashboard and
                  manage your tenders.
                </p>
              </div>

              <SignInForm />

              <div className='flex items-center pt-1'>
                <Separator className='flex-1' />
                <span className='px-3 text-xs text-gray-500'>OR</span>
                <Separator className='flex-1' />
              </div>

              <div className='text-center'>
                <p className='text-sm text-gray-600'>
                  Don&apos;t have an account?
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

export default SignIn;
