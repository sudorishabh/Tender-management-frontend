import React, { useMemo, useCallback, FC } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import ItemInfo from "./CreateTenderCards/ItemInfo";
import TenderSupportDocument from "./CreateTenderCards/TenderSupportDocument";
import VendorDocRequirement from "./CreateTenderCards/VendorDocRequirement";
import KeyDates from "./CreateTenderCards/KeyDates";
import TenderFeeDetails from "./CreateTenderCards/TenderFeeDetails";
import TenderPreQualifications from "./CreateTenderCards/TenderPreQualifications";
import CreateTenderPreview from "./CreateTenderCards/CreateTenderPreview";
import VendorSelection from "./CreateTenderCards/VendorSelection";
import { createTenderNavData } from "@/lib/CreateTenderConstants";
import { ITenderFormData, ITenderVendorSelection } from "@/Types/Tender-Types";
import CreateTenderSkeleton from "@/components/Shared/skeleton/CreateTenderSkeleton";
import CreateTenderNavbar from "./CreateTenderNavbar";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { useGetCategoriesNamesQuery } from "@/Redux/category/categoryApi";

interface Props {
  active: number;
  setActive: (active: number) => void;
  form: UseFormReturn<ITenderFormData>;
  handleSaveTender: () => void;
  handleCreateTender: (data: ITenderFormData) => void;
  isCreatingTender: boolean;
  isSaveTenderLoading: boolean;
  handleVendorSelectionChange: (
    vendorSelection: ITenderVendorSelection
  ) => void;
  vendorSelection: ITenderVendorSelection;
}

const CreateTender: FC<Props> = ({
  active,
  setActive,
  form,
  handleSaveTender,
  handleCreateTender,
  isCreatingTender,
  isSaveTenderLoading,
  handleVendorSelectionChange,
  vendorSelection,
}) => {
  // pre-saved categories
  const { categories } = useSelector((state: RootState) => state.categorySlice);

  // load categories from db
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetCategoriesNamesQuery({}, { skip: categories.length > 0 });

  const progressPercentage = useMemo(() => {
    return Math.round((active / (createTenderNavData.length - 1)) * 100);
  }, [active]);

  const renderStep = useCallback(() => {
    switch (active) {
      case 0:
        return (
          <ItemInfo
            setActive={setActive}
            handleSaveTender={handleSaveTender}
            isSavingTender={isSaveTenderLoading}
            categoriesData={
              categories.length > 0 ? categories : categoriesData?.categories
            }
          />
        );
      case 1:
        return (
          <TenderSupportDocument
            setActive={setActive}
            handleSaveTender={handleSaveTender}
            isSavingTender={isSaveTenderLoading}
          />
        );
      case 2:
        return (
          <VendorDocRequirement
            setActive={setActive}
            handleSaveTender={handleSaveTender}
            isSavingTender={isSaveTenderLoading}
          />
        );
      case 3:
        return (
          <KeyDates
            setActive={setActive}
            handleSaveTender={handleSaveTender}
            isSavingTender={isSaveTenderLoading}
          />
        );
      case 4:
        return (
          <TenderFeeDetails
            setActive={setActive}
            handleSaveTender={handleSaveTender}
            isSavingTender={isSaveTenderLoading}
          />
        );
      case 5:
        return (
          <TenderPreQualifications
            setActive={setActive}
            handleSaveTender={handleSaveTender}
            isSavingTender={isSaveTenderLoading}
          />
        );
      case 6:
        return (
          <VendorSelection
            setActive={setActive}
            categoriesData={
              categories.length > 0 ? categories : categoriesData?.categories
            }
            vendorSelection={vendorSelection}
            setVendorSelection={handleVendorSelectionChange}
            handleSaveTender={handleSaveTender}
            isSavingTender={isSaveTenderLoading}
          />
        );
      case 7:
        return (
          <CreateTenderPreview
            isLoading={isCreatingTender}
            setActive={setActive}
            isPreviewData={form.getValues()}
          />
        );
      default:
        return null;
    }
  }, [
    active,
    categories,
    categoriesData?.categories,
    form,
    handleSaveTender,
    handleVendorSelectionChange,
    isCreatingTender,
    isSaveTenderLoading,
    setActive,
    vendorSelection,
  ]);

  if (isCategoriesLoading) {
    return <CreateTenderSkeleton />;
  }

  return (
    <div className='w-full mb-8'>
      <div className='border-b mb-8'>
        <div className='container mx-auto px-6 py-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Create Tender</h1>
          <p className='text-gray-600 mt-2 max-w-2xl'>
            Fill in the required information through this multi-step form to
            create a new tender. Complete all sections to ensure your tender
            meets all compliance requirements.
          </p>

          <div className='mt-6 w-full h-2 bg-gray-200 rounded-full overflow-hidden'>
            <div
              className='h-full bg-primary transition-all duration-300 ease-in-out'
              style={{ width: `${progressPercentage}%` }}></div>
          </div>

          <div className='flex items-center justify-between mt-2'>
            <span className='text-sm font-medium text-gray-700'>
              Step {active + 1} of {createTenderNavData.length}
            </span>
            <span className='text-sm font-medium text-gray-700'>
              {progressPercentage}% Complete
            </span>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-6 flex justify-between gap-5 h-full'>
        <CreateTenderNavbar
          active={active}
          setActive={setActive}
        />

        <div className='flex-1 max-w-3x'>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleCreateTender)}>
              {renderStep()}
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default CreateTender;
