import { ICategoryInfo } from "@/Types/Category-Types";
import React, { FC } from "react";

interface Props {
  data: {
    category: ICategoryInfo;
  };
}

const CategoryInfo: FC<Props> = ({ data }) => {
  return (
    <div className='p-4 flex flex-col gap-4'>
      <div className='flex'>
        <p className='w-[20rem] text-gray-700 font-medium'>Category Type</p>
        <span>
          {data?.category?.is_sub_category ? "Sub Category" : "Main Category"}
        </span>
      </div>
      <div className='flex'>
        <p className='w-[20rem] text-gray-700 font-medium'>Status</p>
        <span>{data?.category?.status}</span>
      </div>
      <div className='flex'>
        <p className='w-[20rem] text-gray-700 font-medium'>Scope</p>
        <span>{data?.category?.scope}</span>
      </div>
    </div>
  );
};

export default CategoryInfo;
