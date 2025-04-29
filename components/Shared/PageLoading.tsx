import { LoaderCircle } from "lucide-react";
import React from "react";

const PageLoading = () => {
  return (
    <div className='w-full mt-40 flex items-center justify-center text-center'>
      <LoaderCircle className='animate-spin mx-auto' />
    </div>
  );
};

export default PageLoading;
