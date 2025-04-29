import { IVenderRegistrationForm } from "@/app/Types/User-Types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info, Mail, Phone, User, CreditCard, Lock } from "lucide-react";
import React, { FC, useState } from "react";
import { useFormContext } from "react-hook-form";

interface Props {
  handleNextStep: (active: number) => void;
}

const VendorInfo: FC<Props> = ({ handleNextStep }) => {
  const [showErrors, setShowErrors] = useState(false);
  const {
    register,
    formState: { errors },
    watch,
    trigger,
  } = useFormContext<IVenderRegistrationForm>();

  const password = watch("password");

  const handleNext = async () => {
    setShowErrors(true);
    const fieldsToValidate = [
      "fullname",
      "email",
      "contactNumber",
      "panCardNumber",
      "password",
      "confirmPassword",
    ];
    const result = await trigger(
      fieldsToValidate as (keyof IVenderRegistrationForm)[]
    );

    if (result) {
      handleNextStep(1);
    }
  };

  const showErrorMessage = (fieldName: keyof typeof errors) => {
    return showErrors && errors[fieldName] ? (
      <p className='text-red-600 text-[0.85rem] ml-0.5 mt-1.5'>
        {errors[fieldName]?.message as string}
      </p>
    ) : null;
  };

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <div className='flex items-center gap-2 mb-2'>
          <Info
            size={18}
            className='text-primary'
          />
          <h2 className='text-xl font-semibold text-gray-900'>
            Personal Information
          </h2>
        </div>
        <p className='text-gray-600 ml-6'>
          Please provide your personal details to create your vendor account.
        </p>
      </div>

      <div className='bg-gray-50 p-4 mb-6 rounded-lg border border-gray-200 flex items-center gap-3'>
        <Info
          size={18}
          className='text-blue-600 shrink-0'
        />
        <p className='text-sm text-gray-700'>
          <span className='font-medium'>Note:</span> You will be asked to upload
          supporting documents in a later step.
        </p>
      </div>

      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <div className='space-y-1.5'>
            <label
              htmlFor='email'
              className='text-sm font-medium text-gray-700 flex items-center gap-1.5'>
              <Mail
                size={15}
                className='text-gray-500'
              />
              Email Address
              <span className='text-red-500'>*</span>
            </label>
            <Input
              id='email'
              className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30'
              placeholder='Enter your email address'
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email format",
                },
              })}
            />
            {showErrorMessage("email")}
          </div>

          <div className='space-y-1.5'>
            <label
              htmlFor='fullname'
              className='text-sm font-medium text-gray-700 flex items-center gap-1.5'>
              <User
                size={15}
                className='text-gray-500'
              />
              Full Name
              <span className='text-red-500'>*</span>
            </label>
            <Input
              id='fullname'
              className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30'
              placeholder='Enter your full name'
              {...register("fullname", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Full name must be at least 2 characters",
                },
              })}
            />
            {showErrorMessage("fullname")}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <div className='space-y-1.5'>
            <label
              htmlFor='contactNumber'
              className='text-sm font-medium text-gray-700 flex items-center gap-1.5'>
              <Phone
                size={15}
                className='text-gray-500'
              />
              Contact Number
              <span className='text-red-500'>*</span>
            </label>
            <Input
              id='contactNumber'
              className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30'
              placeholder='Enter your contact number'
              {...register("contactNumber", {
                required: "Contact number is required",
                pattern: {
                  value: /^\d{10,15}$/,
                  message: "Must be 10-15 digits",
                },
              })}
            />
            {showErrorMessage("contactNumber")}
          </div>

          <div className='space-y-1.5'>
            <label
              htmlFor='panCardNumber'
              className='text-sm font-medium text-gray-700 flex items-center gap-1.5'>
              <CreditCard
                size={15}
                className='text-gray-500'
              />
              PAN Card Number
              <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              id='panCardNumber'
              className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30'
              placeholder='Enter your PAN card number'
              {...register("panCardNumber", {
                required: "PAN card number is required",
                pattern: {
                  value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                  message: "Must be in format ABCDE1234F",
                },
              })}
            />
            {showErrorMessage("panCardNumber")}
          </div>
        </div>

        <div className='h-px bg-gray-200 my-6'></div>

        <div className='mb-4'>
          <div className='flex items-center gap-2 mb-2'>
            <Lock
              size={18}
              className='text-primary'
            />
            <h2 className='text-xl font-semibold text-gray-900'>Security</h2>
          </div>
          <p className='text-gray-600 ml-6'>
            Create a secure password for your account.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <div className='space-y-1.5'>
            <label
              htmlFor='password'
              className='text-sm font-medium text-gray-700 flex items-center gap-1.5'>
              <Lock
                size={15}
                className='text-gray-500'
              />
              Password
              <span className='text-red-500'>*</span>
            </label>
            <Input
              id='password'
              type='password'
              className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30'
              placeholder='Create a password'
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/,
                  message:
                    "Must include uppercase, lowercase, number, and special character",
                },
              })}
            />
            {showErrorMessage("password")}
          </div>

          <div className='space-y-1.5'>
            <label
              htmlFor='confirmPassword'
              className='text-sm font-medium text-gray-700 flex items-center gap-1.5'>
              <Lock
                size={15}
                className='text-gray-500'
              />
              Confirm Password
              <span className='text-red-500'>*</span>
            </label>
            <Input
              id='confirmPassword'
              type='password'
              className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30'
              placeholder='Confirm your password'
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {showErrorMessage("confirmPassword")}
          </div>
        </div>

        <div className='flex justify-end pt-4'>
          <Button
            type='button'
            className='bg-primary hover:bg-primary/90 text-white px-6 h-10'
            onClick={handleNext}>
            Continue to Business Info
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorInfo;
