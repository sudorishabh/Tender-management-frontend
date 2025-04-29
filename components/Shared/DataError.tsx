import React, { FC } from "react";

interface Props {
  message: string;
}

const DataError: FC<Props> = ({ message }) => {
  return (
    <div className='w-full mt-16 flex items-center justify-center text-center'>
      <h1 className='text-red-600 text-xl'>
        {message || "There is no data available"}
      </h1>
    </div>
  );
};

export default DataError;
