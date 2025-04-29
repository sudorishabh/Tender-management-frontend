import React from "react";
import { Card, CardContent } from "@/components/ui/card";
const Testimonial = () => {
  return (
    <div className='bg-white p-10 rounded-xl border border-gray-100/60 shadow-sm mb-8'>
      <h2 className='text-2xl font-bold mb-10 text-center text-gray-800 relative inline-block left-1/2 -translate-x-1/2'>
        Success Stories
        <span className='block h-1 w-16 bg-blue-500 mt-2 mx-auto rounded-full'></span>
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <Card className='border-0 shadow-none hover:shadow-none transition-all rounded-xl bg-slate-50/50 overflow-hidden group'>
          <div className='h-1 bg-blue-500/30 w-full group-hover:bg-blue-500 transition-all duration-300'></div>
          <CardContent className='p-8'>
            <p className='italic text-gray-700 mb-6 leading-relaxed'>
              &ldquo;The tender management platform streamlined our entire
              procurement process. We&rsquo;ve reduced our administrative
              overhead by 40% and increased our vendor diversity.&rdquo;
            </p>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-700 font-medium border border-blue-200/50'>
                MS
              </div>
              <div>
                <p className='font-medium text-gray-900'>Maria Smith</p>
                <p className='text-sm text-gray-500'>
                  Procurement Director, TechCorp
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className='border-0 shadow-none hover:shadow-none transition-all rounded-xl bg-slate-50/50 overflow-hidden group'>
          <div className='h-1 bg-green-500/30 w-full group-hover:bg-green-500 transition-all duration-300'></div>
          <CardContent className='p-8'>
            <p className='italic text-gray-700 mb-6 leading-relaxed'>
              &ldquo;As a small business, this platform opened doors to
              opportunities we wouldn&rsquo;t have found otherwise. The
              transparent process gave us confidence to compete with larger
              vendors.&rdquo;
            </p>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-700 font-medium border border-green-200/50'>
                JD
              </div>
              <div>
                <p className='font-medium text-gray-900'>James Davis</p>
                <p className='text-sm text-gray-500'>
                  CEO, Innovative Solutions Ltd
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Testimonial;
