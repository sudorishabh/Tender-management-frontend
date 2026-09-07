import DocumentUploadField from "@/_components/Shared/DocumentUploadField";
import {
  FileCheck,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import React, { FC } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { type RegistrationFormValues } from "../_schemas/registration.schema";
import CustomButton from "@/_components/Shared/CustomButton";

interface Props {
  handleNextStep: (active: number) => void;
  handleVendorMutate: () => void;
  setActive: (active: number) => void;
}

const VendorDocumentsInfo: FC<Props> = ({ handleVendorMutate, setActive }) => {
  const { control, watch, trigger } = useFormContext<RegistrationFormValues>();

  const handleSubmit = async () => {
    const documentFields = [
      "vendor.vendor_pan_doc",
      "business.biz_reg_doc",
      "business.biz_gst_doc",
      "business.biz_bank_doc",
      "vendor.vendor_adhar_doc",
    ] as const;

    const isValid = await trigger(documentFields);
    if (isValid) {
      handleVendorMutate();
    } else {
      toast.error("Please fill all the required fields");
    }
  };

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <div className='flex items-center gap-2 mb-2'>
          <FileCheck
            size={14}
            className='text-primary'
          />
          <h2 className='font-medium text-gray-700'>Document Verification</h2>
        </div>
        <p className='text-xs text-gray-500 ml-6'>
          Upload the required documents to verify your business details.
        </p>
      </div>

      <div className='bg-primary/5 p-3 mb-6 rounded-lg border border-primary/30 flex items-start gap-3'>
        <AlertTriangle
          size={14}
          className='text-primary shrink-0 mt-0.5'
        />
        <div className='text-sm text-gray-700'>
          <p className='font-medium text-primary mb-1'>Important:</p>
          <p>
            Please self-attest all documents by signing them and adding the
            current date before uploading. This is the final step in your
            registration process.
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* PAN Card Document */}
        <DocumentUploadField
          control={control}
          name='vendor.vendor_pan_doc'
          value={watch("vendor.vendor_pan_doc")}
          label='PAN Card Document'
          description='Upload a scanned copy of your PAN Card with self-attestation and current date.'
          required
        />

        {/* Registration Document */}
        <DocumentUploadField
          control={control}
          name='business.biz_reg_doc'
          value={watch("business.biz_reg_doc")}
          label='Company Registration Document'
          description='Upload a scanned copy of your Registration Certificate with self-attestation and current date.'
          required
        />
      </div>

      {/* Second Row - GST Document and Cheque/Passbook */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-8'>
        {/* GST Document */}
        <DocumentUploadField
          control={control}
          name='business.biz_gst_doc'
          value={watch("business.biz_gst_doc")}
          label='GST Registration Certificate'
          description='Upload a scanned copy of your GST Registration Certificate with self-attestation and current date.'
          required
        />

        {/* Cheque/Passbook Document */}
        <DocumentUploadField
          control={control}
          name='business.biz_bank_doc'
          value={watch("business.biz_bank_doc")}
          label='Bank Cheque/Passbook Document'
          description="Upload a scanned cancelled cheque or passbook's first page showing account details."
          required
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-8'>
        {/* Aadhar Card Document */}
        <DocumentUploadField
          control={control}
          name='vendor.vendor_adhar_doc'
          value={watch("vendor.vendor_adhar_doc")}
          label='Aadhar Card Document'
          description='Upload a scanned copy of your Aadhar Card with self-attestation and current date for identity verification.'
          required
        />

        {/* MSME Certificate - Only show if vendor has MSME */}
        {watch("business.biz_has_msme") && (
          <DocumentUploadField
            control={control}
            name='business.biz_msme_cert_doc'
            value={watch("business.biz_msme_cert_doc")}
            label='MSME Certificate'
            description='Upload a scanned copy of your MSME Certificate with self-attestation.'
            required
          />
        )}
      </div>

      <div className='flex justify-between pt-4'>
        <CustomButton
          btnName='Back to Business Info'
          variant='secondary'
          onClick={() => setActive(1)}
          LeftIcon={ArrowLeft}
        />

        <CustomButton
          btnName='Submit Registration'
          onClick={handleSubmit}
          variant='primary'
          RightIcon={ArrowRight}
        />
      </div>
    </div>
  );
};

export default VendorDocumentsInfo;
