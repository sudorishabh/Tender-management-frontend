import {
  formLabelStyle,
  inputStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  secondaryButtonStyle2,
} from "@/app/Styles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
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
  onSave: () => void;
  isSavingTender: boolean;
}

const VenderDocRequirement: FC<Props> = ({
  setActive,
  onSave,
  isSavingTender,
}) => {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "venderDocRequirement",
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

  function addDocumentDefinition() {
    const documents = watch("venderDocRequirement");
    const lastDocument = documents[documents.length - 1];

    if (
      lastDocument &&
      lastDocument.name &&
      lastDocument.type &&
      lastDocument.purpose
    ) {
      append({ name: "", type: "", purpose: "" });
    } else {
      toast.error(
        "Please fill in the previous document details before adding a new one."
      );
    }
  }

  return (
    <InfoCard
      title='Vendor Document Requirements'
      information='Specify the documents that vendors must submit with their bids'
      Button={
        <Button
          type='button'
          className={secondaryButtonStyle2}
          onClick={onSave}
          disabled={isSavingTender}>
          <Save />
          {isSavingTender ? "Saving..." : "Save as Draft"}
        </Button>
      }>
      <div className='space-y-6'>
        <div className='p-4 bg-green-50 rounded-lg border border-green-100 flex items-start'>
          <HelpCircle
            size={20}
            className='text-green-600 mr-3 mt-0.5 flex-shrink-0'
          />
          <div>
            <h3 className='font-medium text-green-800 mb-1'>
              Required Submission Instructions
            </h3>
            <p className='text-sm text-green-700'>
              Clearly specify all documents that vendors must include in their
              bid submissions. Provide details about document format and purpose
              to ensure submissions are complete and properly organized.
            </p>
          </div>
        </div>

        <div className='flex justify-end'>
          <Button
            type='button'
            variant={"outline"}
            className={secondaryButtonStyle}
            onClick={addDocumentDefinition}>
            <Plus size={16} /> Add Document Requirement
          </Button>
        </div>

        <div className='space-y-6'>
          {fields.map((field, i) => (
            <div
              key={field.id}
              className='bg-gray-50 rounded-xl border border-gray-200 overflow-hidden'>
              <div className='bg-gray-100 py-3 px-4 flex items-center justify-between'>
                <h2 className='font-medium text-gray-800 flex items-center gap-2'>
                  <FileText
                    size={16}
                    className='text-primary'
                  />
                  Required Document {i + 1}
                  {watch(`venderDocRequirement.${i}.name`) && (
                    <span className='ml-2 text-gray-600 text-sm'>
                      - {watch(`venderDocRequirement.${i}.name`)}
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
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-5'>
                    <div className='space-y-2'>
                      <label
                        className={`${formLabelStyle} flex items-center gap-1`}
                        htmlFor={`venderDocRequirement.${i}.name`}>
                        Document Name
                        <span className='text-red-500'>*</span>
                      </label>
                      <Input
                        id={`venderDocRequirement.${i}.name`}
                        className={inputStyle}
                        placeholder='E.g., Financial Statements, Company Profile'
                        {...register(`venderDocRequirement.${i}.name`, {
                          required: "Document name is required",
                        })}
                      />
                      {getErrorMessage(`venderDocRequirement.${i}.name`) && (
                        <p className='text-red-500 text-xs mt-1'>
                          {getErrorMessage(`venderDocRequirement.${i}.name`)}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <label
                        className={`${formLabelStyle} flex items-center gap-1`}
                        htmlFor={`venderDocRequirement.${i}.type`}>
                        Document Format
                        <span className='text-red-500'>*</span>
                      </label>
                      <Select
                        value={watch(`venderDocRequirement.${i}.type`) || ""}
                        onValueChange={(value) => {
                          setValue(`venderDocRequirement.${i}.type`, value, {
                            shouldValidate: true,
                          });
                        }}>
                        <SelectTrigger
                          id={`venderDocRequirement.${i}.type`}
                          className={inputStyle}>
                          <SelectValue placeholder='Select required format' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='pdf'>PDF</SelectItem>
                          <SelectItem value='word'>Word Document</SelectItem>
                          <SelectItem value='excel'>
                            Excel Spreadsheet
                          </SelectItem>
                          <SelectItem value='image'>Image Files</SelectItem>
                          <SelectItem value='other'>Other Format</SelectItem>
                        </SelectContent>
                      </Select>
                      {getErrorMessage(`venderDocRequirement.${i}.type`) && (
                        <p className='text-red-500 text-xs mt-1'>
                          {getErrorMessage(`venderDocRequirement.${i}.type`)}
                        </p>
                      )}
                      <p className='text-xs text-gray-500'>
                        Specify the file format vendors should submit
                      </p>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label
                      className={`${formLabelStyle} flex items-center gap-1`}
                      htmlFor={`venderDocRequirement.${i}.purpose`}>
                      Purpose & Requirements
                      <span className='text-red-500'>*</span>
                    </label>
                    <Textarea
                      id={`venderDocRequirement.${i}.purpose`}
                      rows={5}
                      className={inputStyle}
                      placeholder='Explain why this document is required and any specific details that should be included'
                      {...register(`venderDocRequirement.${i}.purpose`, {
                        required: "Document purpose is required",
                      })}
                    />
                    {getErrorMessage(`venderDocRequirement.${i}.purpose`) && (
                      <p className='text-red-500 text-xs mt-1'>
                        {getErrorMessage(`venderDocRequirement.${i}.purpose`)}
                      </p>
                    )}
                    <p className='text-xs text-gray-500 mt-1'>
                      Detailed instructions help vendors submit correctly
                      formatted and complete documentation
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
            onClick={() => setActive(1)}>
            <ArrowLeft size={16} /> Previous Step
          </Button>
          <Button
            type='button'
            className={primaryButtonStyle}
            onClick={() => setActive(3)}>
            Continue to Deadlines <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </InfoCard>
  );
};

export default VenderDocRequirement;
