import React, { FC } from "react";
import {
  Building,
  FolderTree,
  LoaderCircle,
  Plus,
  SearchX,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetVendorCategoriesQuery } from "@/Redux/category/categoryApi";
import VendorCategoriesTable from "./VendorCategoriesTable";
import { primaryButtonStyle } from "@/app/Styles";

interface Props {
  id: string;
}
const ManageVendorCategories: FC<Props> = ({ id }) => {
  const { data, isLoading } = useGetVendorCategoriesQuery(id);

  if (isLoading) {
    return (
      <div className='w-full mt-40 flex items-center justify-center text-center'>
        <LoaderCircle className='animate-spin mx-auto' />
      </div>
    );
  }

  return (
    <div className='container mt-10 mx-auto px-6 space-y-6 mb-12'>
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
        <div className='p-4 bg-gray-50 border-b flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <FolderTree
              size={18}
              className='text-primary'
            />
            <h2 className='font-semibold text-gray-900'>Categories</h2>
          </div>

          <div className='flex items-center gap-3'>
            <div className='flex mr-4 items-center gap-2 text-sm text-gray-500'>
              <Building
                size={16}
                className='text-gray-400'
              />
              <span>
                Total Vendor&apos;s Categories:{" "}
                {data?.vendorCategories?.length || 0}
              </span>
            </div>
            {/* {isVendorCategoryDelete.length > 0 && (
              <Button
                className='flex items-center gap-2 rounded-mmd bg-red-200 hover:bg-red-300 text-red-900'
                // onClick={handleDeleteCategories}
                // disabled={deletingMultiple}
              >
                {false ? (
                  <LoaderCircle className='animate-spin size-4' />
                ) : (
                  <Trash className='size-4' />
                )}
                Delete Selected ({isVendorCategoryDelete.length})
              </Button>
            )} */}
            <Link href={`/admin/vendors/${id}/category/add`}>
              <Button className={primaryButtonStyle}>
                <Plus className='size-4' />
                Add New Category
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className='bg-white p-20 flex flex-col items-center justify-center'>
            <LoaderCircle
              className='animate-spin mb-4 text-primary'
              size={36}
            />
          </div>
        ) : data?.vendorCategories?.length > 0 ? (
          <VendorCategoriesTable
            data={data.vendorCategories}
            id={id}
            // setIsCategoryDelete={setIsCategoryDelete}
            // isCategoryDelete={isCategoryDelete}
          />
        ) : (
          <div className='bg-white p-20 flex flex-col items-center justify-center'>
            <SearchX
              className='mb-4 text-gray-400'
              size={48}
            />
            <h3 className='text-gray-700 font-medium text-lg mb-1'>
              No categories found
            </h3>
            <p className='text-gray-500'>Add new vendor&apos;s category now</p>
            <Link
              href={`/admin/vendors/category/add/${id}`}
              className='mt-4'>
              <Button className='flex items-center gap-2 bg-primary hover:bg-primary/90 text-white'>
                <Plus className='size-4' />
                Add New Category
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageVendorCategories;
