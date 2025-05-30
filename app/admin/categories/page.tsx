"use client";
import { useEffect, useRef, useState } from "react";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
import { toast } from "sonner";
import PageError from "@/components/Shared/PageError";
import {
  useDeleteCategoriesMutation,
  useGetCategoriesQuery,
} from "@/Redux/category/categoryApi";
import AdminManageVendorSkeleton from "@/components/Shared/skeleton/AdminManageVendorSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { setCategorySearch } from "@/Redux/category/categorySlice";
import { Button } from "@/components/ui/button";
import {
  LoaderCircle,
  Trash,
  FolderTree,
  Plus,
  SearchX,
  Building,
} from "lucide-react";
import Link from "next/link";
import CategoriesTable from "@/components/Categories/For-Admin/CategoriesTable";
import { secondaryButtonStyle2 } from "@/app/Styles";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const Categories = () => {
  const pageRef = useRef(1);
  const categorySearch = useSelector(
    (state: RootState) => state.categorySlice.categorySearch
  );

  const [isCategoryDelete, setIsCategoryDelete] = useState<string[]>([]);
  const { data, isLoading, isError, refetch, isFetching } =
    useGetCategoriesQuery({
      page: pageRef.current,
      limit: 10,
      search: categorySearch,
    });

  const dispatch = useDispatch();

  const [deleteCategories, { isLoading: deletingMultiple }] =
    useDeleteCategoriesMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, 500);
    return () => clearTimeout(timer);
  }, [categorySearch, refetch]);

  async function handleDeleteCategories() {
    try {
      const deleted = await deleteCategories(isCategoryDelete).unwrap();
      if (deleted.success) {
        toast.success("Categories Deleted Successfully");
        setIsCategoryDelete([]);
      }
    } catch {
      toast.error("Error Deleting Categories");
    }
  }

  if (isError) {
    return <PageError message='Error fetching categories' />;
  }
  if (isLoading) return <AdminManageVendorSkeleton />;
  console.log(data);
  return (
    <AdminPagesWrapper>
      <div>
        <div className='w-full bg-white'>
          <div className='container mx-auto px-6 py-8'>
            <h1 className='text-3xl font-bold text-gray-900'>
              Manage Categories
            </h1>
            <p className='text-gray-600 mt-2 max-w-2xl'>
              Organize your tenders by creating and managing categories. These
              categories help vendors find relevant tenders more easily.
            </p>
          </div>
        </div>

        <div className='container mx-auto px-6 space-y-6'>
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
            <div className='p-4 bg-gray-50 border-b flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <FolderTree
                  size={18}
                  className='text-primary'
                />
                <h2 className='font-semibold text-gray-900'>Categories</h2>
                <div>
                  <Input
                    placeholder='Search by name or short name'
                    value={categorySearch}
                    className='w-[20rem] bg-white rounded-mmd'
                    onChange={(e) =>
                      dispatch(setCategorySearch(e.target.value))
                    }
                  />
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <div className='flex mr-4 items-center gap-2 text-sm text-gray-500'>
                  <Building
                    size={16}
                    className='text-gray-400'
                  />
                  <span>Total Categories: {data?.totalCategories || 0}</span>
                </div>
                {isCategoryDelete.length > 0 && (
                  <Button
                    className='flex items-center gap-2 rounded-mmd bg-red-200 hover:bg-red-300 text-red-900'
                    onClick={handleDeleteCategories}
                    disabled={deletingMultiple}>
                    {deletingMultiple ? (
                      <LoaderCircle className='animate-spin size-4' />
                    ) : (
                      <Trash className='size-4' />
                    )}
                    Delete Selected ({isCategoryDelete.length})
                  </Button>
                )}
                <Link href='/admin/categories/add'>
                  <Button className={cn(secondaryButtonStyle2, "h-8")}>
                    <Plus className='size-4' />
                    Create Category
                  </Button>
                </Link>
              </div>
            </div>

            {data?.categories?.length ? (
              <CategoriesTable
                data={data}
                setIsCategoryDelete={setIsCategoryDelete}
                isCategoryDelete={isCategoryDelete}
                hasMore={data.hasMore}
                isFetching={isFetching}
                refetch={refetch}
                pageRef={pageRef}
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
                <p className='text-gray-500'>
                  Get started by creating your first category
                </p>
                <Link
                  href='/admin/categories/add'
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
      </div>
    </AdminPagesWrapper>
  );
};

export default Categories;
