import React, { FC } from "react";

interface Props {
  children: React.ReactNode;
}

const GeneralWrapper: FC<Props> = ({ children }) => {
  return (
    <div className='max-w-[80rem] mx-auto px-4 my-8 pt-12 sm:px-6 lg:px-8'>
      {children}
    </div>
  );
};

export default GeneralWrapper;
