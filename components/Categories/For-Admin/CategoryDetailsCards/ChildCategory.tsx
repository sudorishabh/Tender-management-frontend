import { useGetChildCategoriesQuery } from "@/Redux/category/categoryApi";
import { LoaderCircle } from "lucide-react";
import React, { FC } from "react";

interface Props {
  categoryMain: string;
}
const ChildCategory: FC<Props> = ({ categoryMain }) => {
  const { data, isLoading } = useGetChildCategoriesQuery(categoryMain);
  if (isLoading)
    return (
      <div className='w-full mt-40 flex items-center justify-center text-center'>
        <LoaderCircle className='animate-spin mx-auto' />
      </div>
    );

  if (!data?.childCategories) {
    return (
      <div className='w-full my-10 flex items-center justify-center text-center'>
        <h1 className='text-red-500 text-xl'>Data not available</h1>
      </div>
    );
  }

  return <div>ChildCategory</div>;
};

export default ChildCategory;
