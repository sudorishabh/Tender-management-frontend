import {
  formLabelStyle,
  inputStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  secondaryButtonStyle2,
} from "@/app/Styles";
import InfoCard from "@/components/Shared/InfoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ArrowRight,
  CoinsIcon,
  DollarSign,
  HelpCircle,
  MapPin,
  Save,
} from "lucide-react";
import React, { FC } from "react";
import { useFormContext } from "react-hook-form";

interface Props {
  setActive: (active: number) => void;
  onSave: () => void;
  isSavingTender: boolean;
}

const TenderFeeDetails: FC<Props> = ({ setActive, onSave, isSavingTender }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

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

  return (
    <InfoCard
      title='Financial Requirements'
      information='Specify all fees and financial details for this tender'
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
        <div className='p-4 bg-amber-50 rounded-lg border border-amber-100 flex items-start'>
          <HelpCircle
            size={20}
            className='text-amber-600 mr-3 mt-0.5 flex-shrink-0'
          />
          <div>
            <h3 className='font-medium text-amber-800 mb-1'>Fee Information</h3>
            <p className='text-sm text-amber-700'>
              Clearly define all financial requirements including document fees,
              EMD (Earnest Money Deposit), and payment instructions. This
              information is critical for vendors to prepare their bids
              correctly.
            </p>
          </div>
        </div>

        {/* Location and Value Section */}
        <div className='p-5 bg-gray-50 rounded-xl border border-gray-200'>
          <div className='flex items-center gap-2 mb-4 text-gray-700'>
            <MapPin size={18} />
            <h3 className='font-semibold'>Tender Details</h3>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label
                className={`${formLabelStyle} flex items-center gap-1`}
                htmlFor='tenderLocation'>
                Tender Location
                <span className='text-red-500'>*</span>
              </label>
              <Input
                id='tenderLocation'
                className={inputStyle}
                placeholder='E.g., New Delhi, Mumbai, Online'
                {...register("tenderFeeDetails.tenderLocation", {
                  required: "Tender location is required",
                })}
              />
              {getErrorMessage("tenderFeeDetails.tenderLocation") && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage("tenderFeeDetails.tenderLocation")}
                </p>
              )}
              <p className='text-xs text-gray-500 mt-1'>
                Physical location or specify if this is an online-only tender
              </p>
            </div>
            <div className='space-y-2'>
              <label
                className={`${formLabelStyle} flex items-center gap-1`}
                htmlFor='tenderValue'>
                Estimated Tender Value
                <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <DollarSign className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4' />
                <Input
                  id='tenderValue'
                  className={`${inputStyle} pl-9`}
                  placeholder='Enter estimated contract value'
                  {...register("tenderFeeDetails.tenderValue", {
                    required: "Tender value is required",
                  })}
                />
              </div>
              {getErrorMessage("tenderFeeDetails.tenderValue") && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage("tenderFeeDetails.tenderValue")}
                </p>
              )}
              <p className='text-xs text-gray-500 mt-1'>
                The approximate value of the entire tender
              </p>
            </div>
          </div>
        </div>

        {/* Fees Section */}
        <div className='p-5 bg-gray-50 rounded-xl border border-gray-200'>
          <div className='flex items-center gap-2 mb-4 text-gray-700'>
            <CoinsIcon size={18} />
            <h3 className='font-semibold'>Required Fees</h3>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label
                className={`${formLabelStyle} flex items-center gap-1`}
                htmlFor='documentFee'>
                Tender Document Fee
                <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <DollarSign className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4' />
                <Input
                  id='documentFee'
                  className={`${inputStyle} pl-9`}
                  placeholder='Enter fee to purchase tender documents'
                  {...register("tenderFeeDetails.documentFee", {
                    required: "Document fee is required",
                  })}
                />
              </div>
              {getErrorMessage("tenderFeeDetails.documentFee") && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage("tenderFeeDetails.documentFee")}
                </p>
              )}
              <p className='text-xs text-gray-500 mt-1'>
                Fee vendors must pay to access complete tender documents
              </p>
            </div>

            <div className='space-y-2'>
              <label
                className={`${formLabelStyle} flex items-center gap-1`}
                htmlFor='EMD'>
                EMD Amount (Earnest Money Deposit)
                <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <DollarSign className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4' />
                <Input
                  id='EMD'
                  className={`${inputStyle} pl-9`}
                  placeholder='Enter security deposit amount'
                  {...register("tenderFeeDetails.EMD", {
                    required: "EMD amount is required",
                  })}
                />
              </div>
              {getErrorMessage("tenderFeeDetails.EMD") && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage("tenderFeeDetails.EMD")}
                </p>
              )}
              <p className='text-xs text-gray-500 mt-1'>
                Security deposit required from bidders
              </p>
            </div>
          </div>
        </div>

        {/* Payment Instructions Section */}
        <div className='p-5 bg-gray-50 rounded-xl border border-gray-200'>
          <div className='flex items-center gap-2 mb-4 text-gray-700'>
            <DollarSign size={18} />
            <h3 className='font-semibold'>Payment Instructions</h3>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label
                className={`${formLabelStyle} flex items-center gap-1`}
                htmlFor='feePayableAt'>
                Document Fee Payment Details
                <span className='text-red-500'>*</span>
              </label>
              <Textarea
                id='feePayableAt'
                className={inputStyle}
                rows={4}
                placeholder='Specify payment method, account details, or payment location'
                {...register("tenderFeeDetails.feePayableAt", {
                  required: "Fee payment details are required",
                })}
              />
              {getErrorMessage("tenderFeeDetails.feePayableAt") && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage("tenderFeeDetails.feePayableAt")}
                </p>
              )}
              <p className='text-xs text-gray-500 mt-1'>
                Complete instructions for paying the document fee
              </p>
            </div>

            <div className='space-y-2'>
              <label
                className={`${formLabelStyle} flex items-center gap-1`}
                htmlFor='emdPayableAt'>
                EMD Payment Details
                <span className='text-red-500'>*</span>
              </label>
              <Textarea
                id='emdPayableAt'
                className={inputStyle}
                rows={4}
                placeholder='Specify EMD payment method and submission process'
                {...register("tenderFeeDetails.emdPayableAt", {
                  required: "EMD payment details are required",
                })}
              />
              {getErrorMessage("tenderFeeDetails.emdPayableAt") && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage("tenderFeeDetails.emdPayableAt")}
                </p>
              )}
              <p className='text-xs text-gray-500 mt-1'>
                Details on how and where to submit the EMD
              </p>
            </div>
          </div>
        </div>

        <div className='flex justify-between mt-8'>
          <Button
            type='button'
            className={secondaryButtonStyle}
            onClick={() => setActive(3)}>
            <ArrowLeft size={16} /> Previous Step
          </Button>
          <Button
            type='button'
            className={primaryButtonStyle}
            onClick={() => setActive(5)}>
            Continue to Eligibility <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </InfoCard>
  );
};

export default TenderFeeDetails;
