"use client";
import React, { JSX } from "react";
import HomeWrapper from "../Shared/GeneralWrapper";
import {
  useForm,
  UseFormRegister,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon, File, FileUp, LoaderCircle } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { formLabelStyle, inputStyle } from "@/app/Styles";
import InfoCard from "../Shared/InfoCard";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import PdfViewerModal from "../Shared/PdfViewerModal";
import { useCreateBidMutation } from "@/Redux/bid/bidApi";
import { toast } from "sonner";
import { useDeleteFileUrlMutation } from "@/Redux/s3-files/s3-files-Api";
import useUploadFileToS3 from "@/hooks/useUploadFileToS3";
import { useRouter } from "next/navigation";
import { ApiError } from "@/app/Types";
import { ErrorCodes } from "@/lib/errorCodes";
interface Props {
  tenderId: string;
}

interface BuyTenderProps {
  demandDraftNumber: string;
  date: Date | string;
  bankNumber: string;
  bankBranch: string;
  technicalDoc: FileList;
  financialDoc: FileList;
  optionalInfo?: string;
}

interface FileUploadProps {
  fieldName: keyof BuyTenderProps;
  label: string;
  register: UseFormRegister<BuyTenderProps>;
  watch: UseFormWatch<BuyTenderProps>;
  errors: FieldErrors<BuyTenderProps>;
}

const FileUploadField = ({
  fieldName,
  label,
  register,
  watch,
  errors,
}: FileUploadProps): JSX.Element => {
  const watchedField = watch(fieldName);
  const fileList =
    fieldName === "technicalDoc" || fieldName === "financialDoc"
      ? (watchedField as FileList)
      : null;

  return (
    <div>
      <label
        className={formLabelStyle}
        htmlFor=''>
        {label}
      </label>
      <Card className='w-full flex shadow-none items-center justify-center'>
        <CardContent className='p-0 w-full'>
          <div className='text-sm m-5'>
            <label
              htmlFor={fieldName}
              className={formLabelStyle}>
              <span className='text-gray-700'>PDF Upload</span>
              <div className='flex flex-col mt-2 gap-1'>
                <Input
                  id={fieldName}
                  type='file'
                  className='hidden'
                  placeholder='File'
                  accept='application/pdf'
                  {...register(fieldName, {
                    required: "This file is required",
                  })}
                />

                {fileList?.[0] ? (
                  <div>
                    <div className='border-2 border-dashed p-4 cursor-pointer border-green-400 bg-green-50 rounded-lg flex flex-col gap-2 items-center justify-center'>
                      <p className='line-clamp-1 text-green-600 font-medium w-[14rem]'>
                        {fileList[0]?.name}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className='border-2 border-dashed p-4 cursor-pointer border-gray-300 rounded-lg flex flex-col gap-2 items-center justify-center'>
                    <FileUp className='w-10 h-10 text-gray-400' />
                    <p className='text-center text-sm font-medium text-gray-700 flex flex-col'>
                      <span>Click to upload PDF</span>
                    </p>
                  </div>
                )}
              </div>
            </label>
            {errors[fieldName] && (
              <p className='text-red-500 text-xs mt-1'>
                {errors[fieldName].message}
              </p>
            )}
            {fileList?.[0] && (
              <div className='mt-3.5 w-full flex justify-center items-center'>
                <PdfViewerModal
                  value={fileList[0]}
                  isS3File={false}
                  triggerButton={
                    <Button
                      type='button'
                      className='w-full hover:bg-blue-300 text-gray-900 bg-blue-200 rounded-lg'>
                      <File className='text-gray-700' /> View PDF
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const BuyTender = ({ tenderId }: Props): JSX.Element => {
  const [uploadFile, { isLoading: isFileUploading }] = useUploadFileToS3();
  const [deleteFileUrl] = useDeleteFileUrlMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BuyTenderProps>();

  // Set date value in the form when date changes
  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setValue("date", selectedDate);
    }
  };

  const [createBid, { isLoading: loadingCreateBid }] = useCreateBidMutation();

  async function onSubmit(data: BuyTenderProps) {
    const { technicalDoc, financialDoc, ...rest } = data;
    if (!technicalDoc) {
      toast.error("Please upload technical document");
      return;
    }
    if (!financialDoc) {
      toast.error("Please upload financial document");
      return;
    }

    let technicalDocFileName = "";
    let financialDocFileName = "";

    try {
      technicalDocFileName = await uploadFile(
        technicalDoc,
        "technical document"
      );
      financialDocFileName = await uploadFile(
        financialDoc,
        "financial document"
      );

      const formData = {
        ...rest,
        technicalDocS3Name: technicalDocFileName,
        financialDocS3Name: financialDocFileName,
        tenderId: tenderId,
      };

      const createdBid = await createBid(formData).unwrap();
      if (createdBid.success) {
        toast.success("Bid created successfully");
        reset();
        router.push("/");
      }
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.data?.errorCode && ErrorCodes[apiError.data.errorCode]) {
        toast.error(ErrorCodes[apiError.data.errorCode]);
      } else {
        toast.error("Bid creation failed. Please try again.");
      }
      if (technicalDocFileName) {
        await deleteFileUrl({
          fileName: `${process.env.NEXT_PUBLIC_AWS_S3_PDF_FOLDER}/${technicalDocFileName}`,
        });
      }
      if (financialDocFileName) {
        await deleteFileUrl({
          fileName: `${process.env.NEXT_PUBLIC_AWS_S3_PDF_FOLDER}/${financialDocFileName}`,
        });
      }
    }
  }

  return (
    <HomeWrapper>
      <div className='mx-16 flex my-10 gap-2 flex-col items-center justify-center relative'>
        <h1 className='text-3xl text-gray-900 font-semibold'>Buy Tender</h1>
        <p className='text-gray-700'>
          Complete the form below to purchase this tender.
        </p>
      </div>
      <div className='flex mb-10 gap-10 w-full'>
        <div className='bg-blue-50 h-[30rem] sticky top-36 w-[65%] rounded-xl p-10'>
          <h1 className='text-2xl mb-5'>How to Buy Instructions</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
            delectus expedita magnam! Dolor necessitatibus ipsa labore magnam
            dicta soluta incidunt, ea obcaecati accusamus aliquam accusantium
            at, inventore eos molestias sit nisi voluptatum recusandae quam
            provident vitae non molestiae illo odio. Assumenda ullam dolorem
            illo asperiores fugiat omnis repudiandae expedita sapiente.
          </p>
        </div>
        <InfoCard
          className='w-[35%]'
          title='Buy Tender Form'
          information='Fill the form to buy the tender'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-5'>
            <div>
              <label
                className={formLabelStyle}
                htmlFor='demandDraftNumber'>
                Demand Draft Number
              </label>
              <Input
                id='demandDraftNumber'
                className={inputStyle}
                placeholder='Enter Demand Draft number'
                {...register("demandDraftNumber", {
                  required: "Demand draft number is required",
                })}
              />
              {errors.demandDraftNumber && (
                <p className='text-red-500 text-xs mt-1'>
                  {errors.demandDraftNumber.message}
                </p>
              )}
            </div>
            <div>
              <label
                className={formLabelStyle}
                htmlFor='date'>
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      `${inputStyle} justify-start text-left font-normal`,
                      !watch("date") && "text-muted-foreground"
                    )}>
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {watch("date") ? (
                      format(new Date(watch("date")), "PPP")
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
                    selected={
                      watch("date") ? new Date(watch("date")) : undefined
                    }
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className='text-red-500 text-xs mt-1'>
                  {errors.date.message}
                </p>
              )}
            </div>
            <div>
              <label
                className={formLabelStyle}
                htmlFor='bankNumber'>
                Bank Number
              </label>
              <Input
                id='bankNumber'
                className={inputStyle}
                placeholder='Enter bank number'
                {...register("bankNumber", {
                  required: "Bank number is required",
                })}
              />
              {errors.bankNumber && (
                <p className='text-red-500 text-xs mt-1'>
                  {errors.bankNumber.message}
                </p>
              )}
            </div>

            <div>
              <label
                className={formLabelStyle}
                htmlFor='bankBranch'>
                Bank Branch
              </label>
              <Input
                id='bankBranch'
                className={inputStyle}
                placeholder='Enter bank branch'
                {...register("bankBranch", {
                  required: "Bank branch is required",
                })}
              />
              {errors.bankBranch && (
                <p className='text-red-500 text-xs mt-1'>
                  {errors.bankBranch.message}
                </p>
              )}
            </div>

            <FileUploadField
              fieldName='technicalDoc'
              label='Technical Document'
              register={register}
              watch={watch}
              errors={errors}
            />

            <FileUploadField
              fieldName='financialDoc'
              label='Financial Document'
              register={register}
              watch={watch}
              errors={errors}
            />

            <div>
              <label
                className={formLabelStyle}
                htmlFor='optionalInfo'>
                Optional Information
              </label>
              <Textarea
                id='optionalInfo'
                className={inputStyle}
                placeholder='Enter any optional information'
                {...register("optionalInfo")}
              />
            </div>

            <Button
              type='submit'
              disabled={loadingCreateBid || isFileUploading}
              className='bg-blue-600 mt-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300'>
              {loadingCreateBid || isFileUploading ? (
                <LoaderCircle className='animate-spin' />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </InfoCard>
      </div>
    </HomeWrapper>
  );
};

export default BuyTender;
