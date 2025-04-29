import PdfViewerModal from "@/components/Shared/PdfViewerModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, FileUp, FileCheck, AlertTriangle } from "lucide-react";
import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface Props {
  handleNextStep: (active: number) => void;
  handleVenderMutate: () => void;
  setActive: (active: number) => void;
}

interface FormValues {
  panCardDoc: FileList | null;
  registrationDoc: FileList | null;
  msmeCertificateDoc: FileList | null;
}

const VenderDocumentsInfo: FC<Props> = ({ handleVenderMutate, setActive }) => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext<FormValues>();

  const watchPanCard = watch("panCardDoc");
  const watchRegistrationDoc = watch("registrationDoc");
  const watchMsmeCertificateDoc = watch("msmeCertificateDoc");

  const showErrorMessage = (fieldName: keyof typeof errors) => {
    return errors[fieldName] ? (
      <p className='text-red-600 text-[0.85rem] ml-0.5 mt-1.5'>
        {errors[fieldName]?.message as string}
      </p>
    ) : null;
  };

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <div className='flex items-center gap-2 mb-2'>
          <FileCheck
            size={18}
            className='text-primary'
          />
          <h2 className='text-xl font-semibold text-gray-900'>
            Document Verification
          </h2>
        </div>
        <p className='text-gray-600 ml-6'>
          Upload the required documents to verify your business details.
        </p>
      </div>

      <div className='bg-blue-50 p-4 mb-6 rounded-lg border border-blue-200 flex items-start gap-3'>
        <AlertTriangle
          size={18}
          className='text-blue-600 shrink-0 mt-0.5'
        />
        <div className='text-sm text-gray-700'>
          <p className='font-medium text-blue-800 mb-1'>Important:</p>
          <p>
            Please self-attest all documents by signing them and adding the
            current date before uploading. This is the final step in your
            registration process.
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* PAN Card Document */}
        <div className='space-y-4'>
          <div>
            <h3 className='text-base font-semibold text-gray-800 flex items-center gap-1.5'>
              <FileCheck
                size={16}
                className='text-primary'
              />
              PAN Card Document
              <span className='text-red-500'>*</span>
            </h3>
            <p className='text-sm text-gray-600 mt-1'>
              Upload a scanned copy of your PAN Card with self-attestation and
              current date.
            </p>
          </div>

          <Card className='border border-gray-200 shadow-sm'>
            <CardContent className='p-5'>
              <div className='space-y-4'>
                <label
                  htmlFor='file_panCard'
                  className='block'>
                  <Controller
                    name='panCardDoc'
                    control={control}
                    rules={{
                      required: "Please upload your PAN card document",
                      validate: {
                        isPdf: (value) =>
                          !value ||
                          value[0]?.type === "application/pdf" ||
                          "Please select a PDF file",
                        fileSize: (value) =>
                          !value ||
                          value[0]?.size <= 5 * 1024 * 1024 ||
                          "File size should not exceed 5MB",
                      },
                    }}
                    render={({ field: { onChange, ref } }) => (
                      <Input
                        id='file_panCard'
                        type='file'
                        className='hidden'
                        placeholder='File'
                        accept='application/pdf'
                        ref={ref}
                        onChange={(e) => {
                          onChange(e.target.files);
                        }}
                      />
                    )}
                  />

                  {watchPanCard?.[0] ? (
                    <div className='border-2 border-dashed p-4 cursor-pointer border-green-400 bg-green-50 rounded-lg flex flex-col gap-2 items-center justify-center'>
                      <FileCheck className='w-8 h-8 text-green-600' />
                      <p className='line-clamp-1 text-green-700 font-medium text-sm text-center'>
                        {watchPanCard[0].name}
                      </p>
                      <p className='text-xs text-green-600'>
                        Click to change file
                      </p>
                    </div>
                  ) : (
                    <div className='border-2 border-dashed p-6 cursor-pointer border-gray-300 hover:border-primary hover:bg-gray-50 rounded-lg flex flex-col gap-3 items-center justify-center transition-all'>
                      <FileUp className='w-10 h-10 text-gray-400' />
                      <div className='text-center'>
                        <p className='text-sm font-medium text-gray-700'>
                          Click to upload PDF
                        </p>
                        <p className='text-xs text-gray-500 mt-1'>
                          PDF only, max 5MB
                        </p>
                      </div>
                    </div>
                  )}
                </label>
                {showErrorMessage("panCardDoc")}

                {watchPanCard?.[0] && (
                  <PdfViewerModal
                    value={watchPanCard[0]}
                    isS3File={false}
                    triggerButton={
                      <Button
                        type='button'
                        variant='outline'
                        className='w-full flex items-center justify-center gap-2 h-9 text-primary border-primary/30 hover:bg-primary/10'>
                        <Eye size={16} /> View Document
                      </Button>
                    }
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registration Document */}
        <div className='space-y-4'>
          <div>
            <h3 className='text-base font-semibold text-gray-800 flex items-center gap-1.5'>
              <FileCheck
                size={16}
                className='text-primary'
              />
              Company Registration Document
              <span className='text-red-500'>*</span>
            </h3>
            <p className='text-sm text-gray-600 mt-1'>
              Upload a scanned copy of your Registration Certificate with
              self-attestation and current date.
            </p>
          </div>

          <Card className='border border-gray-200 shadow-sm'>
            <CardContent className='p-5'>
              <div className='space-y-4'>
                <label
                  htmlFor='file_companyRegistration'
                  className='block'>
                  <Controller
                    name='registrationDoc'
                    control={control}
                    rules={{
                      required:
                        "Please upload your Company Registration document",
                      validate: {
                        isPdf: (value) =>
                          !value ||
                          value[0]?.type === "application/pdf" ||
                          "Please select a PDF file",
                        fileSize: (value) =>
                          !value ||
                          value[0]?.size <= 5 * 1024 * 1024 ||
                          "File size should not exceed 5MB",
                      },
                    }}
                    render={({ field: { onChange, ref } }) => (
                      <Input
                        id='file_companyRegistration'
                        type='file'
                        className='hidden'
                        placeholder='File'
                        accept='application/pdf'
                        ref={ref}
                        onChange={(e) => {
                          onChange(e.target?.files);
                        }}
                      />
                    )}
                  />

                  {watchRegistrationDoc?.[0] ? (
                    <div className='border-2 border-dashed p-4 cursor-pointer border-green-400 bg-green-50 rounded-lg flex flex-col gap-2 items-center justify-center'>
                      <FileCheck className='w-8 h-8 text-green-600' />
                      <p className='line-clamp-1 text-green-700 font-medium text-sm text-center'>
                        {watchRegistrationDoc[0].name}
                      </p>
                      <p className='text-xs text-green-600'>
                        Click to change file
                      </p>
                    </div>
                  ) : (
                    <div className='border-2 border-dashed p-6 cursor-pointer border-gray-300 hover:border-primary hover:bg-gray-50 rounded-lg flex flex-col gap-3 items-center justify-center transition-all'>
                      <FileUp className='w-10 h-10 text-gray-400' />
                      <div className='text-center'>
                        <p className='text-sm font-medium text-gray-700'>
                          Click to upload PDF
                        </p>
                        <p className='text-xs text-gray-500 mt-1'>
                          PDF only, max 5MB
                        </p>
                      </div>
                    </div>
                  )}
                </label>
                {showErrorMessage("registrationDoc")}

                {watchRegistrationDoc?.[0] && (
                  <PdfViewerModal
                    value={watchRegistrationDoc[0]}
                    isS3File={false}
                    triggerButton={
                      <Button
                        type='button'
                        variant='outline'
                        className='w-full flex items-center justify-center gap-2 h-9 text-primary border-primary/30 hover:bg-primary/10'>
                        <Eye size={16} /> View Document
                      </Button>
                    }
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* MSME Certificate */}
      <div className='mt-8'>
        <div className='space-y-4'>
          <div>
            <h3 className='text-base font-semibold text-gray-800 flex items-center gap-1.5'>
              <FileCheck
                size={16}
                className='text-primary'
              />
              MSME Certificate
              <span className='text-gray-400 text-xs ml-1.5'>(Optional)</span>
            </h3>
            <p className='text-sm text-gray-600 mt-1'>
              If your business is registered under MSME, upload a scanned copy
              of your MSME Certificate with self-attestation.
            </p>
          </div>

          <Card className='border border-gray-200 shadow-sm'>
            <CardContent className='p-5'>
              <div className='space-y-4'>
                <label
                  htmlFor='file_msmeCertificate'
                  className='block'>
                  <Controller
                    name='msmeCertificateDoc'
                    control={control}
                    rules={{
                      validate: {
                        isPdf: (value) =>
                          !value ||
                          value[0]?.type === "application/pdf" ||
                          "Please select a PDF file",
                        fileSize: (value) =>
                          !value ||
                          value[0]?.size <= 5 * 1024 * 1024 ||
                          "File size should not exceed 5MB",
                      },
                    }}
                    render={({ field: { onChange, ref } }) => (
                      <Input
                        id='file_msmeCertificate'
                        type='file'
                        className='hidden'
                        placeholder='File'
                        accept='application/pdf'
                        ref={ref}
                        onChange={(e) => {
                          onChange(e.target.files);
                        }}
                      />
                    )}
                  />

                  {watchMsmeCertificateDoc?.[0] ? (
                    <div className='border-2 border-dashed p-4 cursor-pointer border-green-400 bg-green-50 rounded-lg flex flex-col gap-2 items-center justify-center'>
                      <FileCheck className='w-8 h-8 text-green-600' />
                      <p className='line-clamp-1 text-green-700 font-medium text-sm text-center'>
                        {watchMsmeCertificateDoc[0].name}
                      </p>
                      <p className='text-xs text-green-600'>
                        Click to change file
                      </p>
                    </div>
                  ) : (
                    <div className='border-2 border-dashed p-6 cursor-pointer border-gray-300 hover:border-primary hover:bg-gray-50 rounded-lg flex flex-col gap-3 items-center justify-center transition-all'>
                      <FileUp className='w-10 h-10 text-gray-400' />
                      <div className='text-center'>
                        <p className='text-sm font-medium text-gray-700'>
                          Click to upload PDF
                        </p>
                        <p className='text-xs text-gray-500 mt-1'>
                          PDF only, max 5MB
                        </p>
                      </div>
                    </div>
                  )}
                </label>
                {showErrorMessage("msmeCertificateDoc")}

                {watchMsmeCertificateDoc?.[0] && (
                  <PdfViewerModal
                    value={watchMsmeCertificateDoc[0]}
                    isS3File={false}
                    triggerButton={
                      <Button
                        type='button'
                        variant='outline'
                        className='w-full flex items-center justify-center gap-2 h-9 text-primary border-primary/30 hover:bg-primary/10'>
                        <Eye size={16} /> View Document
                      </Button>
                    }
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className='flex justify-between mt-8'>
        <Button
          type='button'
          onClick={() => setActive(1)}
          className='border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 h-10'>
          Back to Business Info
        </Button>

        <Button
          onClick={handleVenderMutate}
          className='bg-primary hover:bg-primary/90 text-white px-6 h-10'>
          Submit Registration
        </Button>
      </div>
    </div>
  );
};

export default VenderDocumentsInfo;
