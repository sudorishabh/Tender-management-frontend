"use client";
import React, { JSX, useEffect } from "react";
import HomeWrapper from "@/_components/Shared/GeneralWrapper";
import { useForm } from "react-hook-form";
import DocumentUploadField from "@/_components/Shared/DocumentUploadField";
import { Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formLabelStyle, inputStyle } from "@/app/styles";
import { Textarea } from "@/_components/ui/textarea";
import { Card, CardContent } from "@/_components/ui/card";
import { toast } from "sonner";
import useUploadFileToS3 from "@/hooks/useUploadFileToS3";
import useDeleteFileFromS3 from "@/hooks/useDeleteFileFromS3";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";
import PageLoading from "@/_components/Shared/PageLoading";
import PageError from "@/_components/Shared/PageError";
import { Form } from "@/_components/ui/form";
import { useSession } from "next-auth/react";
import CustomButton from "@/_components/Shared/CustomButton";

interface Props {
  tenderId: string;
}

interface BuyTenderFormData {
  optionalInfo?: string;
  bidFeeDoc?: FileList;
  technicalDoc?: FileList;
  financialDoc?: FileList;
  [key: `vendorDoc_${number}`]: FileList;
}

const BuyTender = ({ tenderId }: Props): JSX.Element => {
  const [uploadFile, { isLoading: isFileUploading }] = useUploadFileToS3();
  const [deleteFileUrl] = useDeleteFileFromS3();
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Fetch tender details to get vendor document requirements
  const {
    data: tenderData,
    isLoading: isTenderLoading,
    isError,
  } = trpc.tender.getDetails.useQuery(Number(tenderId));

  // Check if bid has already been submitted — userId is derived from session on the server.
  const { data: bidSubmissionData, isLoading: isBidCheckLoading } =
    trpc.bid.isBidSubmitted.useQuery(
      {
        tenderId: tenderId,
      },
      {
        enabled: !!userId,
      }
    );

  // Redirect if bid already submitted
  useEffect(() => {
    if (bidSubmissionData?.isSubmitted) {
      toast.error("You have already submitted a bid for this tender");
      router.push("/");
    }
  }, [bidSubmissionData, router]);

  // Check if tender is still open for bidding
  const isLive = tenderData?.tenderData?.isLive;

  // Redirect if tender is not live (deadline passed or not yet released)
  useEffect(() => {
    if (tenderData && !isTenderLoading && isLive === false) {
      toast.error("This tender is no longer accepting bids");
      router.push(`/tender/${tenderId}`);
    }
  }, [tenderData, isLive, isTenderLoading, router, tenderId]);

  const tender = tenderData?.tenderData?.tender;
  const vendorDocRequirements =
    tenderData?.tenderData?.bidderDocumentsReq || [];

  const isTechnicalDocRequired = tender?.tender_is_technical_doc;
  const isFinancialDocRequired = tender?.tender_is_financial_doc;

  const form = useForm<BuyTenderFormData>();

  const { register, handleSubmit, watch, reset, control } = form;

  // Set date value in the form when date changes

  const createBid = trpc.bid.create.useMutation();
  const loadingCreateBid = createBid.isPending;

  async function onSubmit(data: BuyTenderFormData) {
    // Validate bid fee document (required)
    if (!data.bidFeeDoc?.[0]) {
      toast.error("Please upload the Bid Fee Payment Receipt");
      return;
    }

    // Validate vendor documents
    for (const vdr of vendorDocRequirements) {
      const fieldName = `vendorDoc_${vdr.vdr_id}` as keyof BuyTenderFormData;
      const fileList = data[fieldName] as FileList;
      if (!fileList?.[0]) {
        toast.error(
          `Please upload document for: ${vdr.vdr_name || "Document"}`
        );
        return;
      }
    }

    if (isTechnicalDocRequired && !data.technicalDoc?.[0]) {
      toast.error("Please upload the Technical Document");
      return;
    }

    if (isFinancialDocRequired && !data.financialDoc?.[0]) {
      toast.error("Please upload the Financial Document");
      return;
    }

    const uploadedVendorDocs: {
      vdr_id: number;
      vdr_name: string;
      doc_s3_key: string;
    }[] = [];

    let bidFeeDocKey: string | undefined;
    let technicalDocKey: string | undefined;
    let financialDocKey: string | undefined;

    try {
      // Upload bid fee document (required)
      bidFeeDocKey = await uploadFile(data.bidFeeDoc!, "Bid Fee Receipt");

      // Upload vendor requirement documents
      for (const vdr of vendorDocRequirements) {
        const fieldName = `vendorDoc_${vdr.vdr_id}` as keyof BuyTenderFormData;
        const fileList = data[fieldName] as FileList;
        if (fileList?.[0]) {
          const docKey = await uploadFile(fileList, vdr.vdr_name ?? "");
          uploadedVendorDocs.push({
            vdr_id: vdr.vdr_id,
            vdr_name: vdr.vdr_name ?? "",
            doc_s3_key: docKey,
          });
        }
      }

      // Upload technical document
      if (isTechnicalDocRequired && data.technicalDoc?.[0]) {
        technicalDocKey = await uploadFile(
          data.technicalDoc,
          "Technical Document"
        );
      }

      // Upload financial document
      if (isFinancialDocRequired && data.financialDoc?.[0]) {
        financialDocKey = await uploadFile(
          data.financialDoc,
          "Financial Document"
        );
      }

      const formData = {
        optionalInfo: data.optionalInfo,
        vendorDocuments: uploadedVendorDocs,
        tenderId: tenderId,
        bid_fee_doc_key: bidFeeDocKey,
        technical_doc_key: technicalDocKey,
        financial_doc_key: financialDocKey,
      };

      const createdBid = await createBid.mutateAsync(formData);
      if (createdBid.success) {
        toast.success("Bid created successfully");
        reset();
        router.push("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Bid creation failed. Please try again.");
      }
      // Clean up vendor docs on error
      for (const doc of uploadedVendorDocs) {
        await deleteFileUrl(doc.doc_s3_key);
      }
      if (bidFeeDocKey) await deleteFileUrl(bidFeeDocKey);
      if (technicalDocKey) await deleteFileUrl(technicalDocKey);
      if (financialDocKey) await deleteFileUrl(financialDocKey);
    }
  }

  if (isTenderLoading || isBidCheckLoading) return <PageLoading />;
  if (isError) return <PageError />;

  return (
    <HomeWrapper>
      {/* Hero Section */}
      <div className=' border-gray-200'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className=' space-y-2'>
            <h1 className='text-2xl font-bold tracking-tight text-gray-900'>
              Purchase Tender
            </h1>
            <p className='text-gray-600 max-w-2xl'>
              Complete the form below to submit your bid for this tender. Ensure
              all required documents are uploaded.
            </p>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-6'>
        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Instructions Panel */}
          <div className='lg:col-span-1'>
            <div className='sticky top-8'>
              <Card className='bg-gray-50 rounded-md border-gray-200 shadow-sm'>
                <CardContent className='p-8'>
                  <div className='flex items-center gap-2 mb-4'>
                    <h2 className='text-lg ml-9 font-bold text-gray-900'>
                      How to Submit Your Bid
                    </h2>
                  </div>

                  <div className='space-y-4'>
                    <div className='flex gap-3'>
                      <div className='flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold'>
                        1
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-900 mb-0.5 text-sm'>
                          Upload Required Bid Documents
                        </h3>
                        <p className='text-gray-600 text-xs'>
                          Upload the bid fee payment receipt and any required
                          technical or financial documents.
                        </p>
                      </div>
                    </div>

                    <div className='flex gap-3'>
                      <div className='flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold'>
                        2
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-900 mb-0.5 text-sm'>
                          Upload Compliance Documents
                        </h3>
                        <p className='text-gray-600 text-xs'>
                          Upload all additional compliance and certification
                          documents as specified by the tender.
                        </p>
                      </div>
                    </div>

                    <div className='flex gap-3'>
                      <div className='flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold'>
                        3
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-900 mb-0.5 text-sm'>
                          Add Additional Information
                        </h3>
                        <p className='text-gray-600 text-xs'>
                          Optionally provide any additional information or
                          special requirements.
                        </p>
                      </div>
                    </div>

                    <div className='flex gap-3'>
                      <div className='flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold'>
                        4
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-900 mb-0.5 text-sm'>
                          Review & Submit
                        </h3>
                        <p className='text-gray-600 text-xs'>
                          Double-check all information and documents before
                          final submission.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                    <div className='flex gap-2'>
                      <Info className='w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5' />
                      <div>
                        <h4 className='font-semibold text-blue-900 mb-1.5 text-sm'>
                          Bank Details for Payment
                        </h4>
                        <div className='text-blue-800 text-xs space-y-0.5'>
                          <p>
                            <strong>Account Name:</strong> Tender Management
                            System
                          </p>
                          <p>
                            <strong>Account Number:</strong> 1234567890
                          </p>
                          <p>
                            <strong>Bank Name:</strong> State Bank of India
                          </p>
                          <p>
                            <strong>IFSC Code:</strong> SBIN0001234
                          </p>
                          <p>
                            <strong>Branch:</strong> Main Branch
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='mt-3 p-3 bg-gray-100 border border-gray-200 rounded-lg'>
                    <div className='flex gap-2'>
                      <AlertCircle className='w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5' />
                      <div>
                        <h4 className='font-semibold text-gray-800 mb-1 text-sm'>
                          Important Notes
                        </h4>
                        <ul className='text-gray-700 text-xs space-y-0.5'>
                          <li>• All documents must be in PDF format</li>
                          <li>• Maximum file size: 10MB per document</li>
                          <li>
                            • Ensure all information is accurate before
                            submission
                          </li>
                          <li>
                            • Payment must be completed before bid submission
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form Section */}
          <div className='lg:col-span-2'>
            <Card className='shadow-lg rounded-md border-[0.1rem] '>
              <CardContent className='p-8'>
                <div className='mb-8'>
                  <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                    Bid Submission Form
                  </h2>
                  <p className='text-gray-600'>
                    Please provide all the required information to submit your
                    bid.
                  </p>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='space-y-6'>
                    {/* Document Upload Section */}
                    <div className='space-y-6'>
                      {/* Required Bid Documents Section */}
                      <div className='border-t pt-6'>
                        <div className='mb-4'>
                          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                            Required Bid Documents
                          </h3>
                          <p className='text-sm text-gray-600'>
                            These are mandatory documents needed to submit your
                            bid. Please ensure all documents are valid and
                            clearly readable.
                          </p>
                        </div>
                        <div className='grid md:grid-cols-2 mb-8 gap-6'>
                          {/* Bid Fee Receipt - Always Required */}
                          <DocumentUploadField
                            control={control}
                            name='bidFeeDoc'
                            label='Bid Fee Payment Receipt'
                            required={true}
                            value={watch("bidFeeDoc")}
                          />

                          {/* Technical Document */}
                          {isTechnicalDocRequired && (
                            <DocumentUploadField
                              control={control}
                              name='technicalDoc'
                              label='Technical Document'
                              required={true}
                              value={watch("technicalDoc")}
                            />
                          )}
                        </div>

                        {/* Financial Document */}
                        {isFinancialDocRequired && (
                          <DocumentUploadField
                            control={control}
                            name='financialDoc'
                            label='Financial Document'
                            required={true}
                            value={watch("financialDoc")}
                          />
                        )}
                      </div>

                      {/* Additional Compliance Documents Section */}
                      <div className='border-t pt-6'>
                        <div className='mb-4'>
                          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                            Additional Compliance Documents
                          </h3>
                          <p className='text-sm text-gray-600'>
                            Upload all compliance and certification documents as
                            specified by the tender requirements. These
                            documents verify your eligibility and
                            qualifications.
                          </p>
                        </div>
                        {vendorDocRequirements.length > 0 ? (
                          <div className='grid md:grid-cols-2 gap-6'>
                            {vendorDocRequirements.map((vdr) => (
                              <DocumentUploadField
                                key={vdr.vdr_id}
                                control={control}
                                name={`vendorDoc_${vdr.vdr_id}`}
                                label={vdr.vdr_name ?? ""}
                                required={true}
                                value={watch(
                                  `vendorDoc_${vdr.vdr_id}` as keyof BuyTenderFormData
                                )}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className='text-gray-500 text-sm'>
                            No additional compliance documents required for this
                            tender.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Optional Information */}
                    <div className='space-y-2'>
                      <label
                        className={formLabelStyle}
                        htmlFor='optionalInfo'>
                        Additional Information (Optional)
                      </label>
                      <Textarea
                        id='optionalInfo'
                        className={cn(
                          inputStyle,
                          "focus:ring-2 focus:ring-gray-500 focus:border-gray-500 min-h-[100px]"
                        )}
                        placeholder='Enter any additional information or special requirements...'
                        {...register("optionalInfo")}
                      />
                    </div>

                    {/* Submit Button */}
                    {/* <div className='pt-6 border-t'> */}
                    <CustomButton
                      btnName='Submit Bid'
                      variant='primary'
                      type='submit'
                      fullWidth={true}
                      disabled={loadingCreateBid || isFileUploading}
                      isLoading={loadingCreateBid || isFileUploading}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </HomeWrapper>
  );
};

export default BuyTender;
