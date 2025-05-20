"use client";
import React, { useState } from "react";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
import { toast } from "sonner";
import PageError from "@/components/Shared/PageError";
import {
  useDeleteCategoriesMutation,
  useGetCategoriesQuery,
} from "@/Redux/category/categoryApi";
import dynamic from "next/dynamic";
import AdminManageVendorSkeleton from "@/components/Shared/skeleton/AdminManageVendorSkeleton";

const ManageCategories = dynamic(
  () => import("@/components/Categories/For-Admin/ManageCategories")
);

const Categories = () => {
  const [isCategoryDelete, setIsCategoryDelete] = useState<string[]>([]);
  const { data, isLoading, isError } = useGetCategoriesQuery({});
  const [deleteCategories, { isLoading: deletingMultiple }] =
    useDeleteCategoriesMutation();

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
  return (
    <AdminPagesWrapper>
      <ManageCategories
        isCategoryDelete={isCategoryDelete}
        setIsCategoryDelete={setIsCategoryDelete}
        handleDeleteCategories={handleDeleteCategories}
        deletingMultiple={deletingMultiple}
        categoriesData={data}
      />
    </AdminPagesWrapper>
  );
};

export default Categories;
