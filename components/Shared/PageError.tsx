import React, { FC } from "react";
import { Button } from "../ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  message?: string;
}

const PageError: FC<Props> = ({ message }) => {
  return (
    <div className='flex flex-col mt-24 items-center justify-center h-72 text-center'>
      <AlertTriangle className='h-12 w-12 text-red-500 mb-4' />
      <h3 className='text-xl font-semibold text-gray-900 mb-2'>
        Error Loading Data
      </h3>
      <p className='text-gray-700 max-w-md'>
        {message ||
          "There was a problem loading the data. Please try again or contact support."}
      </p>
      <Button
        className='mt-4'
        variant='outline'
        onClick={() => window.location.reload()}>
        Try Again
      </Button>
    </div>
  );
};

export default PageError;
