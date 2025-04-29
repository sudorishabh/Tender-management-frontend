"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  useCreateCategoryMutation,
  useEditCategoryMutation,
  useGetCategoriesParentsNameQuery,
  useGetCategoryQuery,
} from "@/Redux/category/categoryApi";
import { toast } from "sonner";
import { LoaderCircle, Check, HelpCircle, ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formLabelStyle, inputStyle, primaryButtonStyle } from "@/app/Styles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import InfoCard from "@/components/Shared/InfoCard";
import PageLoading from "@/components/Shared/PageLoading";

interface FormData {
  name: string;
  shortName: string;
  type: "main category" | "sub category";
  scope: "product" | "service";
  status: "active" | "inactive";
  subCategoryMain: string;
}

const CreateEditCategory = ({ categoryId }: { categoryId?: string }) => {
  const router = useRouter();
  const isEditMode = Boolean(categoryId);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      shortName: "",
      type: "main category",
      scope: "product",
      status: "active",
      subCategoryMain: "",
    },
  });

  const {
    data: categoryDataById,
    isSuccess: isSuccessCategory,
    isLoading: isLoadingCategory,
  } = useGetCategoryQuery(categoryId, {
    skip: !isEditMode,
  });
  const { data: categoriesNames, isLoading: isCategoriesNameLoading } =
    useGetCategoriesParentsNameQuery({});
  const [createCategory, { isLoading: isCreateLoading }] =
    useCreateCategoryMutation();
  const [editCategory, { isLoading: isEditLoading }] =
    useEditCategoryMutation();
  const isLoading = isCreateLoading || isEditLoading;

  const [categories, setCategories] = useState<{ name: string; id: string }[]>(
    []
  );
  useEffect(() => {
    if (categoriesNames?.categories) {
      setCategories(categoriesNames.categories);
    }
  }, [categoriesNames]);

  useEffect(() => {
    if (isEditMode && categoryDataById && isSuccessCategory) {
      const category = categoryDataById.category;
      reset({
        name: category.name,
        shortName: category.shortName,
        type: category.type.toLowerCase() as "main category" | "sub category",
        scope: category.scope as "product" | "service",
        status: category.status as "active" | "inactive",
        subCategoryMain: category.sub_category_main || "",
      });
    }
  }, [isEditMode, categoryDataById, isSuccessCategory, reset]);

  const watchType = watch("type");

  const onSubmit = async (data: FormData) => {
    if (data.type === "sub category" && !data.subCategoryMain) {
      toast.error("Please select a Parent Category");
      return;
    }
    try {
      const categoryPayload = {
        name: data.name,
        shortName: data.shortName.toUpperCase(),
        type: data.type,
        scope: data.scope,
        status: data.status,
        isSubCategory: data.type === "sub category",
        subCategoryMain:
          data.type === "sub category" ? data.subCategoryMain : null,
      };
      if (isEditMode) {
        const response = await editCategory({
          data: categoryPayload,
          id: categoryId,
        }).unwrap();
        if (response) {
          router.push("/admin/categories");
          toast.success("Category updated successfully");
        }
      } else {
        const response = await createCategory(categoryPayload).unwrap();
        if (response) {
          router.push("/admin/categories");
          toast.success("Category created successfully");
        }
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save category. Please try again."
      );
    }
  };

  if (isCategoriesNameLoading || isLoadingCategory) {
    return <PageLoading />;
  }

  return (
    <div className='container mx-auto px-6 py-8'>
      <div className='flex flex-col w-full gap-6'>
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
                  {isEditMode ? "Edit Category" : "Create New Category"}
                </h1>
                <p className='text-gray-600 mt-1'>
                  {isEditMode
                    ? "Update category details and properties for your organization's catalog"
                    : "Define new categories to organize products and services for your organization"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-center'>
          <div className=' max-w-[61rem] flex items-start w-full gap-6'>
            <InfoCard
              title={isEditMode ? "Edit Category" : "Create New Category"}
              className='flex-1'>
              <form
                className='flex flex-col gap-6'
                onSubmit={handleSubmit(onSubmit)}>
                {/* Category Name */}
                <div className='flex flex-col'>
                  <label className={formLabelStyle}>Category Name</label>
                  <Input
                    className={inputStyle}
                    type='text'
                    placeholder='Enter Category Name'
                    {...register("name", {
                      required: "Category name is required",
                    })}
                  />
                  {errors.name && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Short Name */}
                <div className='flex flex-col'>
                  <label className={formLabelStyle}>Short Name</label>
                  <Input
                    className={inputStyle}
                    type='text'
                    maxLength={3}
                    placeholder='Enter Short Name (max 3 characters)'
                    {...register("shortName", {
                      required: "Short Name is required",
                    })}
                  />
                  {errors.shortName && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.shortName.message}
                    </p>
                  )}
                </div>

                {/* Category Type */}
                <div className='flex flex-col'>
                  <label className={formLabelStyle}>Category Type</label>
                  <Controller
                    name='type'
                    control={control}
                    rules={{ required: "Please select a category type" }}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className='flex items-center gap-14 mt-2'>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem
                            value='main category'
                            id='r1'
                          />
                          <label htmlFor='r1'>Main Category</label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem
                            value='sub category'
                            id='r2'
                            className='custom-radio'
                          />
                          <label htmlFor='r2'>Sub Category</label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.type && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.type.message}
                    </p>
                  )}
                </div>

                {/* Parent Category for Sub Category */}
                {watchType === "sub category" && (
                  <div className='flex flex-col'>
                    <label
                      className={formLabelStyle}
                      htmlFor='parent-category'>
                      Parent Category
                    </label>
                    <Controller
                      name='subCategoryMain'
                      control={control}
                      rules={{
                        required:
                          watchType === "sub category"
                            ? "Please select a Parent Category"
                            : false,
                      }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}>
                          <SelectTrigger className='bg-white rounded-xl'>
                            <SelectValue placeholder='Select Parent Category' />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.name.toLowerCase()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.subCategoryMain && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.subCategoryMain.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Scope */}
                <div className='flex flex-col'>
                  <label className={formLabelStyle}>Scope</label>
                  <Controller
                    name='scope'
                    control={control}
                    rules={{ required: "Please select a scope" }}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className='flex items-center gap-14 mt-2'>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem
                            value='product'
                            id='s1'
                          />
                          <label htmlFor='s1'>Product</label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem
                            value='service'
                            id='s2'
                          />
                          <label htmlFor='s2'>Service</label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.scope && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.scope.message}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className='flex flex-col'>
                  <label className={formLabelStyle}>Status</label>
                  <Controller
                    name='status'
                    control={control}
                    rules={{ required: "Please select a status" }}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className='flex items-center gap-14 mt-2'>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem
                            value='active'
                            id='st1'
                          />
                          <label htmlFor='st1'>Active</label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem
                            value='inactive'
                            id='st2'
                          />
                          <label htmlFor='st2'>Inactive</label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.status && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.status.message}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className='flex justify-end gap-3 mt-4'>
                  <Button
                    type='button'
                    variant='outline'
                    className='rounded-lg font-medium'
                    onClick={() => router.push("/admin/categories")}>
                    Cancel
                  </Button>
                  <Button
                    className={cn(primaryButtonStyle, "px-5")}
                    type='submit'
                    disabled={isLoading}>
                    {isLoading ? (
                      <LoaderCircle
                        className='animate-spin mr-2'
                        size={16}
                      />
                    ) : (
                      <Save
                        size={16}
                        className='mr-2'
                      />
                    )}
                    {isEditMode ? "Update Category" : "Create Category"}
                  </Button>
                </div>
              </form>
            </InfoCard>

            <Card
              className={cn(
                "w-full max-w-[20rem] bg-gradient-to-br from-amber-100 to-orange-50 border-0"
              )}>
              <CardHeader className='pb-2'>
                <CardTitle className='text-lg mb-5 font-semibold flex items-center gap-2'>
                  <HelpCircle
                    size={18}
                    className='text-amber-600'
                  />
                  Important Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-5 text-sm'>
                  <li className='flex gap-2'>
                    <Check
                      size={16}
                      className='text-green-600 mt-0.5 flex-shrink-0'
                    />
                    <span>Category names should be clear and descriptive</span>
                  </li>
                  <li className='flex gap-2'>
                    <Check
                      size={16}
                      className='text-green-600 mt-0.5 flex-shrink-0'
                    />
                    <span>
                      Short names are used for codes and should be unique (max 3
                      characters)
                    </span>
                  </li>
                  <li className='flex gap-2'>
                    <Check
                      size={16}
                      className='text-green-600 mt-0.5 flex-shrink-0'
                    />
                    <span>
                      Sub-categories must have a parent main category selected
                    </span>
                  </li>
                  <li className='flex gap-2'>
                    <Check
                      size={16}
                      className='text-green-600 mt-0.5 flex-shrink-0'
                    />
                    <span>
                      Choose appropriate scopes to determine where categories
                      appear
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEditCategory;
