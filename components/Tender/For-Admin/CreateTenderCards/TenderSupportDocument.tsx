import {
  formLabelStyle,
  inputStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  secondaryButtonStyle2,
} from "@/app/Styles";
import PdfViewerModal from "@/components/Shared/PdfViewerModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  File,
  FileUp,
  HelpCircle,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import React, { FC } from "react";
import { toast } from "sonner";
import {
  FieldErrors,
  FieldValues,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import InfoCard from "@/components/Shared/InfoCard";
import { useDeleteFileUrlMutation } from "@/Redux/s3-files/s3-files-Api";

interface Props {
  setActive: (active: number) => void;
  onSave: () => void;
  isSavingTender: boolean;
}

const TenderSupportDocument: FC<Props> = ({
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
    name: "tenderSupportDocuments",
  });

  const [deleteFileUrl, { isLoading: isDeleting }] = useDeleteFileUrlMutation();

  const getErrorMessage = (path: string) => {
    const pathParts = path.split(".");
    let current: FieldErrors<FieldValues> | undefined = errors;

    for (const part of pathParts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part] as typeof current;
      } else {
        return undefined;
      }
    }

    return current?.message?.toString();
  };

  function addDocument() {
    const documents = watch("tenderSupportDocuments");
    const lastDocument = documents[documents.length - 1];

    if (
      lastDocument.document &&
      lastDocument.documentName &&
      lastDocument.documentPurpose
    ) {
      append({ documentName: "", documentPurpose: "", document: "" });
    } else {
      toast.error(
        "Please fill in the previous document details before adding a new one."
      );
    }
  }

  // Function to handle file removal
  const handleRemoveFile = async (index: number) => {
    const document = watch(`tenderSupportDocuments.${index}.document`);

    // Check if this is a string (S3 file) or a File object
    if (document && typeof document === "string") {
      try {
        // Delete from S3 if it's a string (means it's a saved file)
        await deleteFileUrl({
          fileName: `${process.env.NEXT_PUBLIC_AWS_S3_PDF_FOLDER}/${document}`,
        }).unwrap();
        toast.success("File removed successfully");
      } catch {
        toast.error("Failed to remove file from storage");
        return;
      }
    }

    // Clear the document field
    setValue(`tenderSupportDocuments.${index}.document`, "");
  };

  return (
    <InfoCard
      title='Tender Supporting Documents'
      information='Add the documents that support this tender and will be made available to bidders'
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
        <div className='p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start'>
          <HelpCircle
            size={20}
            className='text-blue-600 mr-3 mt-0.5 flex-shrink-0'
          />
          <div>
            <h3 className='font-medium text-blue-800 mb-1'>
              Supporting Documents Instructions
            </h3>
            <p className='text-sm text-blue-700'>
              Upload all relevant files that bidders will need to understand the
              tender requirements. These may include technical specifications,
              drawings, contract terms, or other reference materials.
            </p>
          </div>
        </div>

        <div className='flex justify-end'>
          <Button
            type='button'
            variant='outline'
            className={secondaryButtonStyle}
            onClick={addDocument}>
            <Plus size={16} /> Add Document
          </Button>
        </div>

        <div className='space-y-8'>
          {fields.map((field, i) => (
            <div
              key={field.id}
              className='bg-gray-50 rounded-xl border border-gray-200 overflow-hidden'>
              <div className='bg-gray-100 py-3 px-4 flex items-center justify-between'>
                <h2 className='font-medium text-gray-800 flex items-center'>
                  <File className='mr-2 size-4' /> Document {i + 1}
                  {watch(`tenderSupportDocuments.${i}.documentName`) && (
                    <span className='ml-2 text-gray-600 text-sm'>
                      - {watch(`tenderSupportDocuments.${i}.documentName`)}
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

              <div className='p-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-5'>
                    <div className='space-y-2'>
                      <label
                        className={`${formLabelStyle} flex items-center gap-1`}
                        htmlFor={`tenderSupportDocuments.${i}.documentName`}>
                        Document Name
                        <span className='text-red-500'>*</span>
                      </label>
                      <Input
                        id={`tenderSupportDocuments.${i}.documentName`}
                        className={inputStyle}
                        {...register(
                          `tenderSupportDocuments.${i}.documentName`,
                          {
                            required: "Document name is required",
                          }
                        )}
                        placeholder='Enter a descriptive name for this document'
                      />
                      {getErrorMessage(
                        `tenderSupportDocuments.${i}.documentName`
                      ) && (
                        <p className='text-red-500 text-xs mt-1'>
                          {getErrorMessage(
                            `tenderSupportDocuments.${i}.documentName`
                          )}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <label
                        className={`${formLabelStyle} flex items-center gap-1`}
                        htmlFor={`tenderSupportDocuments.${i}.documentPurpose`}>
                        Document Purpose
                        <span className='text-red-500'>*</span>
                      </label>
                      <Textarea
                        id={`tenderSupportDocuments.${i}.documentPurpose`}
                        rows={4}
                        className={inputStyle}
                        {...register(
                          `tenderSupportDocuments.${i}.documentPurpose`,
                          {
                            required: "Document purpose is required",
                          }
                        )}
                        placeholder='Explain why this document is important and how bidders should use it'
                      />
                      {getErrorMessage(
                        `tenderSupportDocuments.${i}.documentPurpose`
                      ) && (
                        <p className='text-red-500 text-xs mt-1'>
                          {getErrorMessage(
                            `tenderSupportDocuments.${i}.documentPurpose`
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      className={`${formLabelStyle} flex items-center gap-1`}
                      htmlFor={`file-${i}`}>
                      Document File
                      <span className='text-red-500'>*</span>
                    </label>

                    <Card className='shadow-sm overflow-hidden border-gray-200 mt-2'>
                      <CardContent className='p-0'>
                        <div className='p-4'>
                          <div className='mb-2'>
                            <p className='text-sm text-gray-600 mb-2'>
                              Upload a PDF file (max 5MB)
                            </p>

                            <Input
                              id={`file-${i}`}
                              type='file'
                              className='hidden'
                              accept='application/pdf'
                              {...register(
                                `tenderSupportDocuments.${i}.document`,
                                {
                                  required: "Document file is required",
                                }
                              )}
                            />

                            {watch(`tenderSupportDocuments.${i}.document`) ? (
                              <div className='border-2 border-dashed p-4 cursor-pointer border-green-400 bg-green-50 rounded-lg flex flex-col gap-2 items-center justify-center transition-colors'>
                                <p className='line-clamp-1 text-green-700 font-medium w-full text-center'>
                                  {typeof watch(
                                    `tenderSupportDocuments.${i}.document`
                                  ) === "string"
                                    ? watch(
                                        `tenderSupportDocuments.${i}.document`
                                      ).split("-")[2]
                                    : watch(
                                        `tenderSupportDocuments.${i}.document[0]`
                                      )?.name}
                                </p>
                                <div className='flex gap-2'>
                                  <label
                                    htmlFor={`file-${i}`}
                                    className='text-xs text-blue-600 hover:underline cursor-pointer'>
                                    Replace file
                                  </label>
                                  <button
                                    type='button'
                                    disabled={isDeleting}
                                    onClick={() => handleRemoveFile(i)}
                                    className='text-xs text-red-600 hover:underline cursor-pointer'>
                                    Remove file
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <label
                                htmlFor={`file-${i}`}
                                className='border-2 border-dashed p-4 cursor-pointer border-gray-300 hover:border-primary hover:bg-primary/5 rounded-lg flex flex-col gap-2 items-center justify-center transition-colors'>
                                <FileUp className='w-10 h-10 text-gray-400' />
                                <p className='text-center text-sm font-medium text-gray-700 flex flex-col'>
                                  <span>Click to upload PDF</span>
                                  <span className='text-xs text-gray-500 mt-1'>
                                    or drag and drop
                                  </span>
                                </p>
                              </label>
                            )}

                            {getErrorMessage(
                              `tenderSupportDocuments.${i}.document`
                            ) && (
                              <p className='text-red-500 text-xs mt-2'>
                                {getErrorMessage(
                                  `tenderSupportDocuments.${i}.document`
                                )}
                              </p>
                            )}
                          </div>

                          {watch(`tenderSupportDocuments.${i}.document`) && (
                            <div className='mt-3 flex justify-center'>
                              <PdfViewerModal
                                value={
                                  typeof watch(
                                    `tenderSupportDocuments.${i}.document`
                                  ) === "string"
                                    ? watch(
                                        `tenderSupportDocuments.${i}.document`
                                      )
                                    : watch(
                                        `tenderSupportDocuments.${i}.document[0]`
                                      )
                                }
                                isS3File={
                                  typeof watch(
                                    `tenderSupportDocuments.${i}.document`
                                  ) === "string"
                                }
                                triggerButton={
                                  <Button
                                    type='button'
                                    variant='outline'
                                    className='text-primary rounded-mmd flex items-center gap-2 transition-colors'>
                                    <Eye size={16} /> Preview Document
                                  </Button>
                                }
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
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
            onClick={() => setActive(0)}>
            <ArrowLeft size={16} /> Previous Step
          </Button>
          <Button
            type='button'
            className={primaryButtonStyle}
            onClick={() => setActive(2)}>
            Continue to Vendor Requirements <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </InfoCard>
  );
};

export default TenderSupportDocument;
