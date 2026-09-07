import { createTenderNavData } from "@/app/(dashboards)/admin/create/_CreateTenderConstants";
import { Check, Lock } from "lucide-react";
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cardShadowStyle } from "@/app/styles";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { ITenderFormSteps } from "@/_types/tender/createTender.type";

const CreateTenderNavbar = ({
  active,
  setActive,
  form,
  liveEditRestricted = false,
}: {
  active: number;
  setActive: (active: number) => void;
  form: UseFormReturn<ITenderFormSteps>;
  /** Skip vendor-document step validation when editing a published tender (requirements are read-only). */
  liveEditRestricted?: boolean;
}) => {
  // Track which steps have been validated and completed
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Validation functions for each step
  const validateStep = async (stepIndex: number): Promise<boolean> => {
    let result = false;

    switch (stepIndex) {
      case 0: // Primary Information
        result = await form.trigger("step1");
        break;
      case 1: // Vendor document requirements
        if (liveEditRestricted) {
          result = true;
          break;
        }
        // Custom validation: Check if at least one document requirement is set
        const isTechnicalDoc = form.getValues("step1.tender_is_technical_doc");
        const isFinancialDoc = form.getValues("step1.tender_is_financial_doc");
        const customDocs = form.getValues("step2") || [];
        const hasCustomDoc = customDocs.some(
          (doc) => doc.vdr_name && doc.vdr_name.trim()
        );

        const hasStandardDoc = isTechnicalDoc || isFinancialDoc;
        const hasAnyDoc = hasStandardDoc || hasCustomDoc;

        if (!hasAnyDoc) {
          result = false;
        } else {
          // Also validate step2 fields for custom documents
          result = await form.trigger("step2");
        }
        break;
      case 2: // Key dates
        result = await form.trigger("step3");
        break;
      case 3: // Vendor selection
        // trigger expects specific field keys from the form type; cast to any to allow validating this step group
        result = await form.trigger(
          "step4" as Parameters<typeof form.trigger>[0]
        );
        break;
      default:
        result = true;
    }

    return result;
  };

  const handleStepClick = async (targetStep: number) => {
    // Same step - do nothing
    if (targetStep === active) {
      return;
    }

    // Going backward to a completed step - always allow
    if (targetStep < active && completedSteps.has(targetStep)) {
      setActive(targetStep);
      return;
    }

    // Going backward to an incomplete step - allow but might want to validate
    if (targetStep < active) {
      setActive(targetStep);
      return;
    }

    // Going forward - need to validate current step first
    if (targetStep > active) {
      // Can only go to the next immediate step
      if (targetStep !== active + 1) {
        return; // Block skipping multiple steps
      }

      // Validate current step
      const isCurrentStepValid = await validateStep(active);

      if (isCurrentStepValid) {
        // Mark current step as completed
        setCompletedSteps((prev) => new Set(prev).add(active));
        // Navigate to next step
        setActive(targetStep);
      } else {
        // Validation failed - stay on current step
        // Form errors will be shown by react-hook-form
        return;
      }
    }
  };
  return (
    <div className='hidden lg:block w-[16rem] shrink-0'>
      <div
        className={cn(
          cardShadowStyle,
          "sticky  top-[8rem] bg-white rounded-md border border-gray-100 overflow-hidden"
        )}>
        <div className='py-2.5 px-4 bg-white flex items-center justify-between'>
          <span className='font-bold text-gray-700 text-xs'>
            Tender Creation Steps
          </span>
          <span className='text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full'>
            Step {active + 1} of {createTenderNavData.length}
          </span>
        </div>
        <ScrollArea className='h-[17rem] pr-0.5'>
          <div className='px-2 pb-2'>
            {createTenderNavData?.map((data, i) => {
              const isCompleted = completedSteps.has(i);
              const isCurrent = active === i;
              const isNextStep = i === active + 1;
              const isPreviousStep = i < active;

              // Can click if: it's the current step, a previous step, or the immediate next step
              const canClick = isCurrent || isPreviousStep || isNextStep;
              const isLocked = !canClick;

              return (
                <div
                  key={data.title}
                  className={`flex items-start gap-2 rounded px-3 py-2.5 transition-all
                     ${isCurrent ? "bg-primary/5" : ""}
                     ${
                       canClick
                         ? "hover:bg-gray-50 cursor-pointer"
                         : "opacity-60 cursor-not-allowed"
                     }`}
                  onClick={() => handleStepClick(i)}>
                  <div
                    className={`flex items-center justify-center rounded-full size-7 shrink-0 mt-0.5 ${
                      isCompleted
                        ? "bg-green-100 text-green-700"
                        : isCurrent
                        ? "bg-primary/10 text-primary"
                        : isLocked
                        ? "bg-gray-100 text-gray-400"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                    {isCompleted ? (
                      <Check size={14} />
                    ) : isLocked ? (
                      <Lock
                        size={14}
                        className='text-gray-400'
                      />
                    ) : (
                      <data.icon
                        size={14}
                        className={isCurrent ? "text-primary" : "text-gray-500"}
                      />
                    )}
                  </div>
                  <div>
                    <p
                      className={`font-medium text-xs ${
                        isCurrent
                          ? "text-primary"
                          : isLocked
                          ? "text-gray-400"
                          : "text-gray-900"
                      }`}>
                      {data.title}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${
                        isLocked ? "text-gray-400" : "text-gray-500"
                      }`}>
                      {data.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CreateTenderNavbar;
