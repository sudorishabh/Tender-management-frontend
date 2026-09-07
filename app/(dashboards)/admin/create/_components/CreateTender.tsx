"use client";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import ItemInfo from "./cards/ItemInfo";
import VendorDocRequirement from "./cards/VendorDocRequirement";
import KeyDates from "./cards/KeyDates";
import CreateTenderPreview from "./cards/CreateTenderPreview";
import { createTenderNavData } from "../_CreateTenderConstants";

import CreateTenderNavbar from "./CreateTenderNavbar";
import { trpc } from "@/lib/trpc";
import { useSearchParams, useRouter } from "next/navigation";
import { ITenderFormSteps } from "@/_types/tender/createTender.type";
import { useForm, UseFormReturn } from "react-hook-form";
import { tenderFormDefaultValues } from "../_CreateTenderConstants";
import useHandleCreateTender from "../_hooks/useHandleCreateTender";
import useHandleSaveCreateTender from "../_hooks/useHandleSaveCreateTender";
import useHandleResetTenderForm from "../_hooks/useHandleResetTenderForm";
import { Form } from "@/components/ui/form";

const CreateTender = () => {
  // system logic
  ///////////////////////////////////////////////////////////////////////////////
  const [activeFormTab, setActiveFormTab] = useState<number>(0);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const savedTenderId = id ? parseInt(id) : "";
  const router = useRouter();

  // custom hooks
  ///////////////////////////////////////////////////////////////////////////////

  const [handleSaveTenderHandler, { isLoading: isSaveTenderLoading }] =
    useHandleSaveCreateTender() as [
      (props: { data: ITenderFormSteps; id: string }) => Promise<void>,
      {
        isLoading: boolean;
      }
    ];

  const [createTenderHandler, { isLoading: isCreateTenderLoading }] =
    useHandleCreateTender() as [
      (props: {
        data: ITenderFormSteps;
        setActive: (active: number) => void;
        form: UseFormReturn<ITenderFormSteps>;
      }) => Promise<void>,
      {
        isLoading: boolean;
      }
    ];

  const [handleResetTenderFormHandler] = useHandleResetTenderForm();

  // fetching data
  ///////////////////////////////////////////////////////////////////////////////

  const { data: savedTenderData } = trpc.tender.getSaved.useQuery(
    savedTenderId as number,
    {
      enabled: !!savedTenderId,
    }
  );

  const savedData = savedTenderData?.success ? savedTenderData : null;

  // form related logic
  ///////////////////////////////////////////////////////////////////////////////

  const form = useForm<ITenderFormSteps>({
    defaultValues: tenderFormDefaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    form.setValue(
      "step1.tender_id",
      savedTenderId ? savedTenderId.toString() : ""
    );
  }, [form, savedTenderId]);

  // handle reset tender form
  useEffect(() => {
    if (savedTenderData) {
      handleResetTenderFormHandler({
        savedTenderData: savedData,
        form,
      });
    }
  }, [
    form,
    handleResetTenderFormHandler,
    savedTenderId,
    savedTenderData,
    savedData,
  ]);

  const handleSaveTender = useCallback(async () => {
    const currentFormValues = form.getValues();
    await handleSaveTenderHandler({
      data: currentFormValues,
      id: id || "",
    });
  }, [form, id, handleSaveTenderHandler]);

  // handle create tender
  const handleCreateTender = async (data: ITenderFormSteps) => {
    try {
      await createTenderHandler({
        data,
        setActive: setActiveFormTab,
        form,
      });

      // Remove `id` param from URL after successful submit
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("id");
        // Use router.replace to update the URL without adding history
        router.replace(url.pathname + url.search);
      } catch {
        // noop: if URL manipulation fails, don't block the success flow
      }
    } catch (err) {
      throw err;
    }
  };

  // other calculations
  ///////////////////////////////////////////////////////////////////////////////

  const progressPercentage = useMemo(() => {
    return Math.round((activeFormTab / (createTenderNavData.length - 1)) * 100);
  }, [activeFormTab]);

  const renderStep = useCallback(() => {
    const commonProps = {
      setActive: setActiveFormTab,
      handleSaveTender,
      isSavingTender: isSaveTenderLoading,
    };

    switch (activeFormTab) {
      case 0:
        return <ItemInfo {...commonProps} />;
      case 1:
        return <VendorDocRequirement {...commonProps} />;
      case 2:
        return <KeyDates {...commonProps} />;
      case 3:
        return (
          <CreateTenderPreview
            isLoading={isCreateTenderLoading}
            setActive={setActiveFormTab}
            isPreviewData={form.getValues()}
          />
        );
      default:
        return null;
    }
  }, [
    activeFormTab,
    form,
    handleSaveTender,
    isCreateTenderLoading,
    isSaveTenderLoading,
    setActiveFormTab,
  ]);

  return (
    <div>
      <div className='pb-4'>
        <div
          className='w-full h-1.5 bg-gray-200 rounded-full '
          role='progressbar'
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercentage}
          aria-label='Tender creation progress'>
          <div
            className='h-full bg-primary transition-all duration-300 ease-in-out'
            style={{ width: `${progressPercentage}%` }}></div>
        </div>

        <div className='flex items-center justify-between mt-2'>
          <span className='text-xs font-medium text-gray-600'>
            Step {activeFormTab + 1} of {createTenderNavData.length}
          </span>
          <span className='text-xs font-medium text-gray-600'>
            {progressPercentage}% Complete
          </span>
        </div>
      </div>

      <div className='flex justify-between gap-5 h-full'>
        <CreateTenderNavbar
          active={activeFormTab}
          setActive={setActiveFormTab}
          form={form}
        />

        <div className='flex-1'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateTender)}>
              {renderStep()}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateTender;
