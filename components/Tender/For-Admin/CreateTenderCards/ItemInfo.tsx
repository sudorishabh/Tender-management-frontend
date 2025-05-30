import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  formLabelStyle,
  inputStyle,
  primaryButtonStyle,
  secondaryButtonStyle2,
} from "@/app/Styles";
import { departments } from "@/lib/constants";
import InfoCard from "@/components/Shared/InfoCard";
import { capitalizeFirstLetter } from "@/lib/helper";
import {
  ArrowRight,
  Building,
  FileText,
  HelpCircle,
  Percent,
  Save,
  RefreshCw,
} from "lucide-react";
import { ICategoryName } from "@/Types/Category-Types";
// Helper function to generate a unique tender number
const generateUniqueTenderNumber = () => {
  const timestampPart = Date.now().toString().slice(-4);
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return timestampPart + randomPart;
};

interface Props {
  setActive: (active: number) => void;
  categoriesData: ICategoryName[];
  handleSaveTender: () => void;
  isSavingTender: boolean;
}

const ItemInfo: FC<Props> = ({
  setActive,
  categoriesData,
  handleSaveTender,
  isSavingTender,
}) => {
  const {
    control,
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  const getErrorMessage = (path: string) => {
    return path
      .split(".")
      .reduce<Record<string, unknown> | null>(
        (obj, key) =>
          obj && typeof obj === "object" && key in obj
            ? (obj[key] as Record<string, unknown>)
            : null,
        errors as Record<string, unknown>
      )
      ?.message?.toString();
  };

  // Handle generate tender number
  const handleGenerateTenderNumber = () => {
    const uniqueNumber = generateUniqueTenderNumber();
    setValue("itemInfo.tenderNumber", uniqueNumber, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <InfoCard
      title='Primary Tender Information'
      information="Provide the basic details that define this tender's purpose and scope"
      Button={
        <Button
          type='button'
          className={secondaryButtonStyle2}
          onClick={handleSaveTender}
          disabled={isSavingTender}>
          <Save />
          {isSavingTender ? "Saving..." : "Save as Draft"}
        </Button>
      }>
      <div className='flex flex-col gap-8'>
        {/* Organization Section */}
        <div className='p-4 bg-gray-50 rounded-xl border border-gray-200'>
          <div className='flex items-center gap-2 mb-4 text-gray-700'>
            <Building size={18} />
            <h3 className='font-semibold'>Organization Details</h3>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='space-y-2'>
              <label
                className={`${formLabelStyle} flex items-center gap-1`}
                htmlFor='company'>
                Company
                <span className='text-red-500'>*</span>
              </label>
              <Input
                id='company'
                defaultValue='Teri'
                readOnly
                className={`${inputStyle} bg-gray-100 focus:bg-gray-100 cursor-not-allowed`}
              />
              {errors.company && (
                <p className='text-red-500 text-xs mt-1'>
                  {errors.company.message?.toString()}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <label
                className={`${formLabelStyle} flex items-center gap-1`}
                htmlFor='department'>
                Department
                <span className='text-red-500'>*</span>
              </label>
              <Controller
                name='itemInfo.department'
                control={control}
                rules={{ required: "Department is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}>
                    <SelectTrigger
                      id='department'
                      className={inputStyle}>
                      <SelectValue placeholder='Select Department' />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem
                          key={department.key}
                          value={department.label}>
                          {department.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {getErrorMessage("itemInfo.department") && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage("itemInfo.department")}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <label
                className={`${formLabelStyle} flex items-center gap-1`}
                htmlFor='tenderNumber'>
                Tender Number
                <span className='text-red-500'>*</span>
              </label>
              <div className='flex items-center gap-2'>
                <Input
                  id='tenderNumber'
                  className={`${inputStyle} bg-gray-100 focus:bg-gray-100 cursor-not-allowed`}
                  type='text'
                  placeholder='Generate number'
                  readOnly
                  {...register("itemInfo.tenderNumber", {
                    required: "Tender number is required",
                  })}
                />
                <Button
                  type='button'
                  className='h-9 w-12 p-0 bg-primary/20 shadow-none text-accent hover:bg-primary/30 rounded-xl'
                  onClick={handleGenerateTenderNumber}>
                  <RefreshCw className='' />
                </Button>
              </div>
              {getErrorMessage("itemInfo.tenderNumber") && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage("itemInfo.tenderNumber")}
                </p>
              )}
              <p className='text-xs text-gray-500 mt-1'>
                This is a unique reference number for your tender
              </p>
            </div>
          </div>
        </div>

        {/* Tender Classification Section */}
        <div className='p-4 bg-gray-50 rounded-xl border border-gray-200'>
          <div className='flex items-center gap-2 mb-4 text-gray-700'>
            <FileText size={18} />
            <h3 className='font-semibold'>Tender Classification</h3>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='space-y-2'>
              <label
                className={`${formLabelStyle} flex items-center gap-1`}
                htmlFor='tenderType'>
                Tender Type
                <span className='text-red-500'>*</span>
              </label>
              <Controller
                name='itemInfo.tenderType'
                control={control}
                rules={{ required: "Tender type is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}>
                    <SelectTrigger
                      id='tenderType'
                      className={inputStyle}>
                      <SelectValue placeholder='Select Tender Type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='public'>Public</SelectItem>
                      <SelectItem value='limited'>Limited</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {getErrorMessage("itemInfo.tenderType") && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage("itemInfo.tenderType")}
                </p>
              )}
              <p className='text-xs text-gray-500 mt-1'>
                Public tenders are open to all eligible vendors
              </p>
            </div>
            <div className='space-y-2'>
              <label
                className={`${formLabelStyle} flex items-center gap-1`}
                htmlFor='tenderScope'>
                Tender Scope
                <span className='text-red-500'>*</span>
              </label>
              <Controller
                name='itemInfo.tenderScope'
                control={control}
                rules={{ required: "Tender scope is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}>
                    <SelectTrigger
                      id='tenderScope'
                      className={inputStyle}>
                      <SelectValue placeholder='Select Tender Scope' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='product'>Product</SelectItem>
                      <SelectItem value='service'>Service</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {getErrorMessage("itemInfo.tenderScope") && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage("itemInfo.tenderScope")}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <label
                className={`${formLabelStyle} flex items-center gap-1`}
                htmlFor='category'>
                Tender Category
                <span className='text-red-500'>*</span>
              </label>
              <Controller
                name='itemInfo.category'
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}>
                    <SelectTrigger
                      id='category'
                      className={inputStyle}>
                      <SelectValue placeholder='Select Tender Category' />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesData?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.name}>
                          {capitalizeFirstLetter(category.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {getErrorMessage("itemInfo.category") && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage("itemInfo.category")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tender Details Section */}
        <div className='p-4 bg-gray-50 rounded-xl border border-gray-200'>
          <div className='flex items-center gap-2 mb-4 text-gray-700'>
            <FileText size={18} />
            <h3 className='font-semibold'>Tender Details</h3>
          </div>
          <div className='space-y-6'>
            <div className='space-y-2'>
              <label
                className={`${formLabelStyle} flex items-center gap-1`}
                htmlFor='title'>
                Title
                <span className='text-red-500'>*</span>
              </label>
              <Input
                id='title'
                className={inputStyle}
                type='text'
                placeholder='Enter a clear, descriptive title for this tender'
                {...register("itemInfo.title", {
                  required: "Title is required",
                })}
              />
              {getErrorMessage("itemInfo.title") && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage("itemInfo.title")}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <label
                className={`${formLabelStyle} flex items-center gap-1`}
                htmlFor='description'>
                Description
                <span className='text-red-500'>*</span>
              </label>
              <Textarea
                id='description'
                className={inputStyle}
                rows={6}
                placeholder='Provide a detailed description of the tender requirements, scope, and expectations'
                {...register("itemInfo.description", {
                  required: "Description is required",
                })}
              />
              {getErrorMessage("itemInfo.description") && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage("itemInfo.description")}
                </p>
              )}
              <div className='flex items-start gap-2 mt-2 p-2 bg-blue-50 text-blue-700 rounded-md'>
                <HelpCircle
                  size={16}
                  className='mt-0.5 flex-shrink-0'
                />
                <p className='text-xs'>
                  A thorough description helps vendors understand what is
                  expected. Include key requirements, specifications, and any
                  other relevant details.
                </p>
              </div>
            </div>

            <div className='space-y-2'>
              <label
                className={`${formLabelStyle} flex items-center gap-1`}
                htmlFor='technicalPreBidQualification'>
                Technical / Pre-Bid Qualification
                <span className='text-red-500'>*</span>
              </label>
              <Textarea
                id='technicalPreBidQualification'
                className={inputStyle}
                rows={4}
                placeholder='Specify the technical qualifications or pre-bid requirements vendors must meet'
                {...register("itemInfo.technicalPreBidQualification", {
                  required: "Technical qualification is required",
                })}
              />
              {getErrorMessage("itemInfo.technicalPreBidQualification") && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage("itemInfo.technicalPreBidQualification")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Weightage Section */}
        <div className='p-4 bg-gray-50 rounded-xl border border-gray-200'>
          <div className='flex items-center gap-2 mb-4 text-gray-700'>
            <Percent size={18} />
            <h3 className='font-semibold'>Evaluation Weightage</h3>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label
                className={`${formLabelStyle} flex items-center gap-1`}
                htmlFor='technicalWeightage'>
                Technical Weightage (%)
                <span className='text-red-500'>*</span>
              </label>
              <Input
                id='technicalWeightage'
                className={inputStyle}
                type='text'
                inputMode='numeric'
                pattern='[0-9]*'
                placeholder='Enter percentage (0-100)'
                {...register("itemInfo.technicalWeightage", {
                  required: "Technical weightage is required",
                  onChange: (e) => {
                    const value = e.target.value;
                    // Replace any non-numeric characters
                    e.target.value = value.replace(/[^0-9]/g, "");
                  },
                  min: { value: 0, message: "Cannot be negative" },
                  max: { value: 100, message: "Cannot exceed 100%" },
                })}
              />
              {getErrorMessage("itemInfo.technicalWeightage") && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage("itemInfo.technicalWeightage")}
                </p>
              )}
              <p className='text-xs text-gray-500 mt-1'>
                Weight given to technical aspects in bid evaluation
              </p>
            </div>
            <div className='space-y-2'>
              <label
                className={`${formLabelStyle} flex items-center gap-1`}
                htmlFor='commercialWeightage'>
                Commercial Weightage (%)
                <span className='text-red-500'>*</span>
              </label>
              <Input
                id='commercialWeightage'
                className={inputStyle}
                type='text'
                inputMode='numeric'
                pattern='[0-9]*'
                placeholder='Enter percentage (0-100)'
                {...register("itemInfo.commercialWeightage", {
                  required: "Commercial weightage is required",
                  onChange: (e) => {
                    const value = e.target.value;
                    // Replace any non-numeric characters
                    e.target.value = value.replace(/[^0-9]/g, "");
                  },
                  min: { value: 0, message: "Cannot be negative" },
                  max: { value: 100, message: "Cannot exceed 100%" },
                })}
              />
              {getErrorMessage("itemInfo.commercialWeightage") && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage("itemInfo.commercialWeightage")}
                </p>
              )}
              <p className='text-xs text-gray-500 mt-1'>
                Weight given to commercial/financial aspects in bid evaluation
              </p>
            </div>
          </div>
          <div className='flex items-start gap-2 mt-4 p-2 bg-amber-50 text-amber-700 rounded-md'>
            <HelpCircle
              size={16}
              className='mt-0.5 flex-shrink-0'
            />
            <p className='text-xs'>
              The sum of Technical and Commercial weightage should equal 100%.
              These values determine how bids will be scored.
            </p>
          </div>
        </div>

        <div className='flex justify-end mt-4'>
          <Button
            type='button'
            className={primaryButtonStyle}
            onClick={() => setActive(1)}>
            Continue to Documents
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </InfoCard>
  );
};

export default ItemInfo;
