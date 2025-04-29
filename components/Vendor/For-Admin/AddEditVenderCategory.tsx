"use client";
import React, { FC, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  useGetCategoriesNamesQuery,
  useGetVendorCategoryQuery,
  useAddVendorCategoryMutation,
  useUpdateVendorCategoryMutation,
} from "@/Redux/category/categoryApi";
import { format } from "date-fns";
import {
  CalendarIcon,
  LoaderCircle,
  HelpCircle,
  ArrowLeft,
  Save,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import InfoCard from "@/components/Shared/InfoCard";
import { formLabelStyle, inputStyle, primaryButtonStyle } from "@/app/Styles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ApiError } from "@/app/Types";
import { ErrorCodes } from "@/lib/errorCodes";

interface Props {
  vendorId: string;
  isEditMode: boolean;
  userCategoryId?: string;
}

interface FormData {
  categoryId: string;
  status: "active" | "inactive";
  expiresAt: Date | null;
  category: string;
}

interface Category {
  name: string;
  id: string;
}

const AddEditVendorCategory: FC<Props> = ({
  vendorId,
  isEditMode,
  userCategoryId,
}) => {
  const router = useRouter();

  const {
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      categoryId: "",
      category: "",
      status: "active",
      expiresAt: null,
    },
  });

  const [categories, setCategories] = useState<Category[]>([]);

  const { data: categoriesNames, isLoading: isCategoriesNameLoading } =
    useGetCategoriesNamesQuery({});

  const { data: vendorCategoryData, isLoading: isVendorCategoryLoading } =
    useGetVendorCategoryQuery(userCategoryId ?? "", {
      skip: !isEditMode || !userCategoryId,
    });

  const [addVendorCategory, { isLoading: isAddLoading }] =
    useAddVendorCategoryMutation();

  const [updateVendorCategory, { isLoading: isUpdateLoading }] =
    useUpdateVendorCategoryMutation();

  useEffect(() => {
    if (categoriesNames?.categories) {
      setCategories(categoriesNames.categories);
    }
  }, [categoriesNames]);

  useEffect(() => {
    if (isEditMode && vendorCategoryData?.vendorCategory) {
      const categoryData = vendorCategoryData.vendorCategory;
      reset({
        categoryId: categoryData.id,
        status: categoryData.status as "active" | "inactive",
        expiresAt: categoryData.expires_at
          ? new Date(categoryData.expires_at)
          : null,
        category: categoryData.category,
      });
    }
  }, [isEditMode, vendorCategoryData, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        categoryId: Number(data.categoryId),
        status: data.status,
        expiresAt: data.expiresAt ? data.expiresAt.toISOString() : null,
        category: data.category,
        vendorId: Number(vendorId),
      };

      if (isEditMode && userCategoryId) {
        await updateVendorCategory({
          ...payload,
          id: userCategoryId,
        }).unwrap();
        toast.success("Vendor category updated successfully");
        router.back();
      } else {
        await addVendorCategory(payload).unwrap();
        toast.success("Vendor category added successfully");
        reset({
          categoryId: "",
          category: "",
          status: "active",
          expiresAt: null,
        });
        router.back();
      }
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.data?.errorCode && ErrorCodes[apiError.data.errorCode]) {
        toast.error(ErrorCodes[apiError.data.errorCode]);
      } else {
        toast.error("An error occurred while saving vendor category");
      }
    }
  };

  const isLoading =
    isCategoriesNameLoading || (isEditMode && isVendorCategoryLoading);
  const loadingSubmission = isAddLoading || isUpdateLoading;

  if (isLoading) {
    return (
      <div className='flex justify-center py-8'>
        <LoaderCircle className='animate-spin h-8 w-8 text-blue-500' />
      </div>
    );
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
                  {isEditMode
                    ? "Edit Vendor Category"
                    : "Assign Category to Vendor"}
                </h1>
                <p className='text-gray-600 mt-1'>
                  {isEditMode
                    ? "Update vendor category details and permissions"
                    : "Assign categories to determine what products or services this vendor can provide"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='flex justify-center'>
          <div className='max-w-[61rem] flex items-start w-full gap-6'>
            <InfoCard
              title={
                isEditMode ? "Edit Vendor Category" : "Assign Vendor Category"
              }
              className='flex-1'>
              <form
                className='flex flex-col gap-6'
                onSubmit={handleSubmit(onSubmit)}>
                {/* Category Selection */}
                <div className='flex flex-col'>
                  <label
                    className={formLabelStyle}
                    htmlFor='category-select'>
                    Category
                  </label>
                  <Controller
                    name='categoryId'
                    control={control}
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <Select
                        disabled={isEditMode}
                        value={field.value}
                        onValueChange={(value) => {
                          const selectedCategory = categories.find(
                            (cat) => cat.id === value
                          );
                          if (selectedCategory) {
                            setValue("categoryId", selectedCategory.id, {
                              shouldValidate: true,
                            });
                            setValue("category", selectedCategory.name);
                          }
                        }}>
                        <SelectTrigger
                          id='category-select'
                          className={inputStyle}>
                          <SelectValue placeholder='Select Category' />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.categoryId && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.categoryId.message || "Category is required"}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className='flex flex-col'>
                  <label className={formLabelStyle}>Status</label>
                  <Controller
                    name='status'
                    control={control}
                    rules={{ required: "Status is required" }}
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
                      {errors.status.message || "Status is required"}
                    </p>
                  )}
                </div>

                {/* Expires At */}
                <div className='flex flex-col'>
                  <label className={formLabelStyle}>Expires At</label>
                  <Controller
                    name='expiresAt'
                    control={control}
                    rules={{
                      required: "Expiry date is required",
                      validate: (value) => {
                        if (!value) return "Please select an expiry date";
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return (
                          value >= today || "Expiry date must be in the future"
                        );
                      },
                    }}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            disabled={isEditMode}
                            className={cn(
                              inputStyle,
                              "justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}>
                            <CalendarIcon className='mr-2 h-4 w-4' />
                            {field.value ? (
                              format(field.value, "dd MMM yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className='w-auto p-0'
                          align='start'>
                          <Calendar
                            mode='single'
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today;
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.expiresAt && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.expiresAt.message}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className='flex justify-end gap-3 mt-4'>
                  <Button
                    type='button'
                    variant='outline'
                    className='rounded-lg font-medium'
                    onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button
                    className={cn(primaryButtonStyle, "px-5")}
                    type='submit'
                    disabled={loadingSubmission}>
                    {loadingSubmission ? (
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
                    {isEditMode ? "Update Category" : "Assign Category"}
                  </Button>
                </div>
              </form>
            </InfoCard>

            <Card
              className={cn(
                "w-full max-w-[20rem] bg-gradient-to-br from-blue-100 to-sky-50 border-0"
              )}>
              <CardHeader className='pb-2'>
                <CardTitle className='text-lg mb-5 font-semibold flex items-center gap-2'>
                  <HelpCircle
                    size={18}
                    className='text-blue-600'
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
                    <span>Assign only relevant categories to each vendor</span>
                  </li>
                  <li className='flex gap-2'>
                    <Check
                      size={16}
                      className='text-green-600 mt-0.5 flex-shrink-0'
                    />
                    <span>
                      Setting an expiration date will automatically deactivate
                      the category on that date
                    </span>
                  </li>
                  <li className='flex gap-2'>
                    <Check
                      size={16}
                      className='text-green-600 mt-0.5 flex-shrink-0'
                    />
                    <span>
                      Inactive categories won&apos;t appear in vendor catalogs
                      or procurement options
                    </span>
                  </li>
                  <li className='flex gap-2'>
                    <Check
                      size={16}
                      className='text-green-600 mt-0.5 flex-shrink-0'
                    />
                    <span>
                      Vendors can only submit bids for tenders in their assigned
                      categories
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

export default AddEditVendorCategory;
