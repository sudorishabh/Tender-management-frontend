"use client";
import React, { FC, useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

const GeneralWrapper: FC<Props> = ({ children }) => {
  useEffect(() => {
    scrollTo(0, 0);
  }, []);
  return (
    <div className='max-w-[80rem] mx-auto lg:px-2 xl:px-4 my-10 sm:px-6'>
      {children}
    </div>
  );
};

export default GeneralWrapper;
