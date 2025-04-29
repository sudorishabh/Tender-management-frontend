"use client";
import {
  ArrowLeft,
  LoaderCircle,
  FileText,
  Tag,
  Users,
  FileCode2,
} from "lucide-react";
import React, { FC, useState } from "react";
import CategoryInfo from "@/components/Categories/For-Admin/CategoryDetailsCards/CategoryInfo";
import ChildCategory from "@/components/Categories/For-Admin/CategoryDetailsCards/ChildCategory";
import CategoryVenders from "@/components/Categories/For-Admin/CategoryDetailsCards/CategoryVenders";
import CategoryTenders from "@/components/Categories/For-Admin/CategoryDetailsCards/CategoryTenders";
import { useGetCategoryQuery } from "@/Redux/category/categoryApi";
import { useRouter } from "next/navigation";
interface Props {
  categoryId: string;
}

const CategoryDetails: FC<Props> = ({ categoryId }) => {
  const [active, setActive] = useState(0);
  const { data, isLoading } = useGetCategoryQuery(categoryId);

  const router = useRouter();

  if (isLoading)
    return (
      <div className='w-full mt-40 flex items-center justify-center text-center'>
        <LoaderCircle className='animate-spin mx-auto' />
      </div>
    );

  // Define navigation data similar to createTenderNavData
  const categoryNavData = [
    {
      title: "Category Information",
      icon: (
        <FileText
          size={18}
          className='text-primary'
        />
      ),
      description: "Basic category details and properties",
    },
    ...(data && data?.category?.is_sub_category !== true
      ? [
          {
            title: "Child Categories",
            icon: (
              <Tag
                size={18}
                className='text-primary'
              />
            ),
            description: "View and manage sub-categories",
          },
        ]
      : []),
    {
      title: "Vendors",
      icon: (
        <Users
          size={18}
          className='text-primary'
        />
      ),
      description: "Vendors associated with this category",
    },
    {
      title: "Tenders",
      icon: (
        <FileCode2
          size={18}
          className='text-primary'
        />
      ),
      description: "Tenders published under this category",
    },
  ];

  return (
    <div className='container mx-auto px-6 py-8'>
      <div className='w-full bg-white border-b mb-8'>
        <div className='container mx-auto py-8'>
          <div className='flex items-center mb-4'>
            <button
              onClick={() => router.back()}
              className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors mr-4'>
              <ArrowLeft className='size-6' />
            </button>
            <div className='ml-4'>
              <h1 className='text-3xl font-bold text-gray-900'>
                Category Details
              </h1>
              <p className='text-gray-600 mt-1'>
                View and manage details for
                <span className='font-semibold text-gray-900 ml-1'>
                  {data?.category?.name || "this category"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Tab Navigation */}
      <div className='mb-6 border-b border-gray-200'>
        <div className='flex gap-1 overflow-x-auto hide-scrollbar'>
          {categoryNavData.map((item, i) => (
            <button
              key={item.title}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-5 py-4 whitespace-nowrap font-medium text-sm transition-all 
              ${
                active === i
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}>
              <span
                className={`${
                  active === i ? "text-primary" : "text-gray-500"
                }`}>
                {item.icon}
              </span>
              {item.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
        {active === 0 && <CategoryInfo data={data} />}
        {active === 1 && data && data?.category?.is_sub_category === false && (
          <ChildCategory categoryMain={data?.category.name} />
        )}
        {active ===
          (data && data?.category?.is_sub_category !== true ? 2 : 1) && (
          <CategoryVenders categoryId={categoryId} />
        )}
        {active ===
          (data && data?.category?.is_sub_category !== true ? 3 : 2) && (
          <CategoryTenders categoryId={categoryId} />
        )}
      </div>
    </div>
  );
};

export default CategoryDetails;
