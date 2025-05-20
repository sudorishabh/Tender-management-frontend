import {
  formLabelStyle,
  inputStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  secondaryButtonStyle2,
} from "@/app/Styles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  HelpCircle,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import React, { FC } from "react";
import { toast } from "sonner";
import { useFieldArray, useFormContext } from "react-hook-form";
import InfoCard from "@/components/Shared/InfoCard";

interface Props {
  setActive: (active: number) => void;
  handleSaveTender: () => void;
  isSavingTender: boolean;
}

const TenderPreQualifications: FC<Props> = ({
  setActive,
  handleSaveTender,
  isSavingTender,
}) => {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tenderPreQualifications",
  });

  // Helper function to safely get error messages
  const getErrorMessage = (path: string) => {
    // Type-safe way to get nested errors
    const pathParts = path.split(".");
    let current = errors as Record<string, unknown>;

    // Navigate the error object path
    for (const part of pathParts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part] as Record<string, unknown>;
      } else {
        return undefined;
      }
    }

    return current?.message?.toString();
  };

  function addQualificationDoc() {
    const qualifications = watch("tenderPreQualifications");
    const lastQualification = qualifications[qualifications.length - 1];

    if (
      lastQualification &&
      lastQualification.title &&
      lastQualification.description &&
      lastQualification.score
    ) {
      append({ title: "", description: "", score: "" });
    } else {
      toast.error(
        "Please fill in the previous qualification details before adding a new one."
      );
    }
  }

  return (
    <InfoCard
      title='Eligibility Requirements'
      information='Define the criteria that vendors must meet to qualify for this tender'
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
      <div className='space-y-6'>
        <div className='p-4 bg-amber-50 rounded-lg border border-amber-100 flex items-start'>
          <HelpCircle
            size={20}
            className='text-amber-600 mr-3 mt-0.5 flex-shrink-0'
          />
          <div>
            <h3 className='font-medium text-amber-800 mb-1'>
              Eligibility Criteria
            </h3>
            <p className='text-sm text-amber-700'>
              Clearly define the requirements vendors must meet to participate.
              Each requirement should have a clear title, description, and
              weight score to ensure fair evaluation.
            </p>
          </div>
        </div>

        <div className='flex justify-end'>
          <Button
            type='button'
            variant={"outline"}
            className={secondaryButtonStyle}
            onClick={addQualificationDoc}>
            <Plus size={16} /> Add Requirement
          </Button>
        </div>

        <div className='space-y-6'>
          {fields.map((field, i) => (
            <div
              key={field.id}
              className='bg-gray-50 rounded-xl border border-gray-200 overflow-hidden'>
              <div className='bg-gray-100 py-3 px-4 flex items-center justify-between'>
                <h2 className='font-medium text-gray-800 flex items-center gap-2'>
                  <Award
                    size={16}
                    className='text-primary'
                  />
                  Eligibility Criteria {i + 1}
                  {watch(`tenderPreQualifications.${i}.title`) && (
                    <span className='ml-2 text-gray-600 text-sm'>
                      - {watch(`tenderPreQualifications.${i}.title`)}
                    </span>
                  )}
                </h2>

                {fields.length > 1 && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50'
                    onClick={() => remove(i)}>
                    <Trash2
                      size={16}
                      className='mr-1'
                    />{" "}
                    Remove
                  </Button>
                )}
              </div>

              <div className='p-5'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div className='space-y-2'>
                    <label
                      className={`${formLabelStyle} flex items-center gap-1`}
                      htmlFor={`tenderPreQualifications.${i}.title`}>
                      Requirement Title
                      <span className='text-red-500'>*</span>
                    </label>
                    <Input
                      id={`tenderPreQualifications.${i}.title`}
                      className={inputStyle}
                      placeholder='E.g., Financial Capability, Technical Experience'
                      {...register(`tenderPreQualifications.${i}.title`, {
                        required: "Title is required",
                      })}
                    />
                    {getErrorMessage(`tenderPreQualifications.${i}.title`) && (
                      <p className='text-red-500 text-xs mt-1'>
                        {getErrorMessage(`tenderPreQualifications.${i}.title`)}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <label
                      className={`${formLabelStyle} flex items-center gap-1`}
                      htmlFor={`tenderPreQualifications.${i}.description`}>
                      Requirement Description
                      <span className='text-red-500'>*</span>
                    </label>
                    <Textarea
                      id={`tenderPreQualifications.${i}.description`}
                      className={inputStyle}
                      rows={3}
                      placeholder='Describe the specific requirement in detail'
                      {...register(`tenderPreQualifications.${i}.description`, {
                        required: "Description is required",
                      })}
                    />
                    {getErrorMessage(
                      `tenderPreQualifications.${i}.description`
                    ) && (
                      <p className='text-red-500 text-xs mt-1'>
                        {getErrorMessage(
                          `tenderPreQualifications.${i}.description`
                        )}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <label
                      className={`${formLabelStyle} flex items-center gap-1`}
                      htmlFor={`tenderPreQualifications.${i}.score`}>
                      Weight Score (0-100)
                      <span className='text-red-500'>*</span>
                    </label>
                    <Input
                      id={`tenderPreQualifications.${i}.score`}
                      type='text'
                      inputMode='numeric'
                      pattern='[0-9]*'
                      className={inputStyle}
                      placeholder='Enter a score from 0 to 100'
                      min={0}
                      max={100}
                      {...register(`tenderPreQualifications.${i}.score`, {
                        required: "Score is required",
                        onChange: (e) => {
                          const value = e.target.value;
                          // Replace any non-numeric characters
                          e.target.value = value.replace(/[^0-9]/g, "");
                        },
                        min: { value: 0, message: "Score must be at least 0" },
                        max: { value: 100, message: "Score cannot exceed 100" },
                      })}
                    />
                    {getErrorMessage(`tenderPreQualifications.${i}.score`) && (
                      <p className='text-red-500 text-xs mt-1'>
                        {getErrorMessage(`tenderPreQualifications.${i}.score`)}
                      </p>
                    )}
                    <p className='text-xs text-gray-500 mt-1'>
                      Indicates the importance of this requirement in the
                      overall evaluation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='flex justify-between mt-8'>
          <Button
            type='button'
            className={secondaryButtonStyle}
            onClick={() => setActive(4)}>
            <ArrowLeft size={16} /> Previous Step
          </Button>

          <Button
            type='button'
            className={primaryButtonStyle}
            onClick={() => setActive(6)}>
            Continue to Vendor Selection <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </InfoCard>
  );
};

export default TenderPreQualifications;
