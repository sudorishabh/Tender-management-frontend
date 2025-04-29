import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";

const HomeBanner = () => {
  return (
    <div className='relative mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-accent to-accent'>
      {/* Decorative elements */}
      <div className='absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-10'></div>
      <div className='absolute bottom-0 left-0 h-48 w-48 -translate-x-1/4 translate-y-1/4 rounded-full bg-white opacity-10'></div>
      <div className='absolute top-1/2 left-1/4 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-5'></div>

      <div className='relative z-10 px-8 py-10'>
        <div className='mx-auto max-w-4xl'>
          <h1 className='mb-3 text-3xl font-bold leading-tight text-white md:text-4xl'>
            Your Gateway to Exclusive{" "}
            <span className='text-blue-100'>Tender Opportunities</span>
          </h1>

          <p className='mb-6 max-w-2xl text-blue-50 text-lg'>
            Access and win tenders from TERI and partners. Join thousands of
            successful vendors on our platform!
          </p>

          <div className='flex flex-wrap items-center gap-4'>
            <Link href='/sign-in'>
              <Button className='bg-white text-blue-600 hover:bg-blue-50 border-0 font-medium rounded-lg px-6 py-2.5 transition-all shadow-sm'>
                Sign In
              </Button>
            </Link>
            <Link href='/register'>
              <Button
                variant='outline'
                className='border-white border bg-transparent text-white hover:bg-transparent hover:text-blue-100 font-medium rounded-lg px-6 py-2.5 transition-all'>
                Register
              </Button>
            </Link>
            <Link
              href='/about'
              className='flex items-center mt-1 md:mt-0 text-blue-50 hover:text-white transition-colors ml-2'>
              <span className='underline-offset-4 hover:underline'>
                Learn More
              </span>
              <ChevronRight className='h-4 w-4 ml-1' />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom wave pattern */}
      <div className='absolute bottom-0 left-0 right-0'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 1440 100'
          className='w-full h-6 text-white fill-current opacity-20'>
          <path d='M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,90.7C960,96,1056,96,1152,90.7C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'></path>
        </svg>
      </div>
    </div>
  );
};

export default HomeBanner;
