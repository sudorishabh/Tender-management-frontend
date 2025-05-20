import React from "react";
import { CalendarClock, CheckCircle, Mail } from "lucide-react";
import { primaryButtonStyle } from "@/app/Styles";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const registrationSuccessful = () => {
  return (
    <div className='min-h-screen flex justify-center items-center p-4 bg-gray-50'>
      <div className='bg-white max-w-2xl w-full p-8 md:p-12 rounded-xl shadow-lg'>
        <div className='flex flex-col items-center'>
          <div className='h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6'>
            <CheckCircle className='h-12 w-12 text-green-600' />
          </div>

          <h1 className='text-3xl font-bold text-gray-900 text-center'>
            Registration Submitted Successfully
          </h1>

          <p className='mt-4 text-lg text-gray-600 text-center max-w-md'>
            Thank you for registering with our Tender Management System.
          </p>

          <div className='w-full max-w-md my-8 space-y-6'>
            <div className='flex items-start gap-4'>
              <div className='mt-1'>
                <CalendarClock className='h-6 w-6 text-blue-600' />
              </div>
              <div>
                <h3 className='font-medium text-gray-900'>Review Timeline</h3>
                <p className='text-gray-600 mt-1'>
                  Your application will be reviewed within 24-72 hours by our
                  team.
                </p>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <div className='mt-1'>
                <Mail className='h-6 w-6 text-blue-600' />
              </div>
              <div>
                <h3 className='font-medium text-gray-900'>
                  Email Confirmation
                </h3>
                <p className='text-gray-600 mt-1'>
                  You will receive an email notification once your registration
                  has been approved.
                </p>
              </div>
            </div>
          </div>

          <div className='w-full max-w-md pt-6 border-t border-gray-200'>
            <Link href={"/"}>
              <Button
                className={cn(primaryButtonStyle, " w-full h-11 text-base")}>
                Return to Home Page
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default registrationSuccessful;
