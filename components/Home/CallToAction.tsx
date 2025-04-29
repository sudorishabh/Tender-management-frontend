import { Link } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const CallToAction = () => {
  return (
    <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-8 rounded-xl text-white text-center mb-8 overflow-hidden relative'>
      <div className='absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2'></div>
      <div className='absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/4'></div>
      <h2 className='text-xl md:text-2xl font-bold mb-4 relative'>
        Ready to streamline your tender management?
      </h2>
      <p className='text-blue-100 mb-6 max-w-xl mx-auto'>
        Join thousands of organizations and vendors who are already saving time
        and resources with our platform.
      </p>
      <div className='flex flex-wrap gap-4 justify-center'>
        <Link href='/register'>
          <Button className='bg-white text-blue-700 hover:bg-blue-50 px-6 py-2 rounded-lg'>
            Register Now
          </Button>
        </Link>
        <Link href='/about'>
          <Button
            variant='outline'
            className='bg-transparent border-white text-white hover:bg-blue-700 px-6 py-2 rounded-lg'>
            Learn More
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CallToAction;
