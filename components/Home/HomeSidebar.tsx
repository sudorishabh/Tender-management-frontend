import React from "react";
import { MessageSquare, Phone, Mail } from "lucide-react";

import { borderStyle } from "@/app/Styles";
import { cn } from "@/lib/utils";

const HomeSidebar = () => {
  return (
    <div className='w-full md:w-80 space-y-6 order-first md:order-last'>
      {/* Support/Help Card */}
      <div className={cn("rounded-2xl border overflow-hidden", borderStyle)}>
        <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100'>
          <div className='flex items-center'>
            <div className='bg-primary/5 p-1.5 rounded-md mr-2.5'>
              <MessageSquare className='h-4 w-4 text-accent' />
            </div>
            <h3 className='font-semibold text-gray-800 text-sm'>Need Help?</h3>
          </div>
        </div>

        <div className='p-4 space-y-3'>
          <p className='text-sm text-gray-600'>
            Our support team is available to assist you with any questions.
          </p>

          <div className='flex items-center py-2.5 px-3 bg-gray-50 rounded-lg border border-gray-100'>
            <Phone className='h-4 w-4 text-blue-500 mr-3' />
            <div>
              <div className='text-xs text-gray-500'>Call Support</div>
              <div className='text-sm font-medium text-gray-700'>
                +91 9876543210
              </div>
            </div>
          </div>

          <div className='flex items-center py-2.5 px-3 bg-gray-50 rounded-lg border border-gray-100'>
            <Mail className='h-4 w-4 text-blue-500 mr-3' />
            <div>
              <div className='text-xs text-gray-500'>Email Support</div>
              <div className='text-sm font-medium text-gray-700'>
                support@teri.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSidebar;
