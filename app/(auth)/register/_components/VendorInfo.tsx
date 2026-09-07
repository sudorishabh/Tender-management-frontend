
import {
  Info,
  Lock,
  Eye,
  ArrowRight,
} from "lucide-react";
import React, { FC } from "react";
import { useFormContext } from "react-hook-form";
import { type RegistrationFormValues } from "../_schemas/registration.schema";
import { toast } from "sonner";
import CustomInput from "@/_components/Shared/CustomInput";
import CustomButton from "@/_components/Shared/CustomButton";

interface Props {
  handleNextStep: (active: number) => void;
}

const VendorInfo: FC<Props> = ({ handleNextStep }) => {
  const [showPW, setShowPW] = React.useState(false);
  const { control, trigger } = useFormContext<RegistrationFormValues>();


  const handleNext = async () => {
    const isValid = await trigger([
      "user",
      "vendor.vendor_contact",
      "vendor.vendor_pan_number",
    ]);
    if (isValid) {
      handleNextStep(1);
    } else {
      toast.error("Please fill all the required fields");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <div
      className='p-6'
      onKeyDown={handleKeyDown}>
      <div className='mb-6'>
        <div className='flex items-center gap-2 mb-2'>
          <Info
            size={14}
            className='text-primary'
          />
          <h2 className='font-medium text-gray-700'>Personal Information</h2>
        </div>
        <p className='text-xs text-gray-500 ml-6'>
          Please provide your personal details to create your vendor account.
        </p>
      </div>

      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <CustomInput
            Label='Email Address'
            control={control}
            fieldName='user.email'
            placeholder='Enter your email address'
          />

          <CustomInput
            Label='Full Name'
            control={control}
            fieldName='user.full_name'
            placeholder='Enter your full name'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <CustomInput
            Label='Contact Number'
            control={control}
            fieldName='vendor.vendor_contact'
            placeholder='Enter your contact number'
          />

          <CustomInput
            Label='PAN Card Number'
            control={control}
            fieldName='vendor.vendor_pan_number'
            placeholder='Enter your PAN card number'
          />
        </div>

        <div className='h-px bg-gray-200 my-6'></div>

        <div className='mb-4'>
          <div className='flex items-center gap-2 mb-2'>
            <Lock
              size={14}
              className='text-primary'
            />
            <h2 className='font-medium text-gray-700'>Security</h2>
          </div>
          <p className='text-xs text-gray-500 ml-6'>
            Create a secure password for your account.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <CustomInput
            control={control}
            fieldName='user.password'
            Label='Password'
            placeholder='Enter your password'
            type={showPW ? "text" : "password"}
            inputIconButton={{
              icon: Eye,
              onClick: () => setShowPW(!showPW),
            }}
          />

          <CustomInput
            control={control}
            fieldName='user.confirm_password'
            Label='Confirm Password'
            placeholder='Re-enter your password'
            type='password'
          />
        </div>

        <div className='mt-5 bg-gray-50 p-3 mb-6 rounded-lg border border-gray-200 flex items-center gap-3'>
          <Info
            size={14}
            className='text-primary shrink-0'
          />
          <p className='text-sm text-gray-700'>
            <span className='font-medium'>Note:</span> You will be asked to
            upload supporting documents in a later step.
          </p>
        </div>

        <div className='flex justify-end pt-4'>
          <CustomButton
            btnName='Continue to Business Info'
            onClick={handleNext}
            variant='primary'
            RightIcon={ArrowRight}
          />
        </div>
      </div>
    </div>
  );
};

export default VendorInfo;
