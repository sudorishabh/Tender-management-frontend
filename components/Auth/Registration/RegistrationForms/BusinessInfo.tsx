import { IVendorRegistrationForm } from "@/Types/User-Types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { businessClassification } from "@/lib/constants";
import {
  Building,
  MapPin,
  Info,
  Hash,
  Calendar,
  Globe,
  Mail,
  Phone,
  DollarSign,
} from "lucide-react";
import React, { FC, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface Props {
  handleNextStep: (active: number) => void;
  setActive: (active: number) => void;
}

const BusinessInfo: FC<Props> = ({ handleNextStep, setActive }) => {
  const [showErrors, setShowErrors] = useState(false);
  const {
    register,
    control,
    formState: { errors },
    trigger,
  } = useFormContext<IVendorRegistrationForm>();

  const years = Array.from(
    { length: new Date().getFullYear() - 1949 },
    (_, i) => new Date().getFullYear() - i
  );

  const handleNext = async () => {
    setShowErrors(true);
    const fieldsToValidate = [
      "businessName",
      "businessClassification",
      "establishedYear",
      "registrationNumber",
      "panCardNumber",
      "addressLineOne",
      "locality",
      "city",
      "pinCode",
      "country",
      "gstNumber",
      "companyEmail",
      "companyPhone",
      "annualTurnover",
    ];
    const result = await trigger(
      fieldsToValidate as (keyof IVendorRegistrationForm)[]
    );

    if (result) {
      handleNextStep(2);
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
          <Building
            size={18}
            className='text-primary'
          />
          <h2 className='text-xl font-semibold text-gray-900'>
            Business Details
          </h2>
        </div>
        <p className='text-gray-600 ml-6'>
          Provide information about your company to help tenders find you.
        </p>
      </div>

      <div className='bg-gray-50 p-4 mb-6 rounded-lg border border-gray-200 flex items-center gap-3'>
        <Info
          size={18}
          className='text-blue-600 shrink-0'
        />
        <p className='text-sm text-gray-700'>
          <span className='font-medium'>Note:</span> You will be asked to upload
          supporting documents in the next step.
        </p>
      </div>

      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <div className='space-y-1.5'>
            <label
              htmlFor='businessName'
              className='text-sm font-medium text-gray-700 flex items-center gap-1.5'>
              <Building
                size={15}
                className='text-gray-500'
              />
              Business Name
              <span className='text-red-500'>*</span>
            </label>
            <Input
              id='businessName'
              className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30'
              placeholder='Enter your business name'
              {...register("businessName", {
                required: "Business name is required",
              })}
            />
            {showErrorMessage("businessName")}
          </div>

          <div className='space-y-1.5'>
            <label className='text-sm font-medium text-gray-700 flex items-center gap-1.5'>
              <Building
                size={15}
                className='text-gray-500'
              />
              Business Classification
              <span className='text-red-500'>*</span>
            </label>
            <Controller
              name='businessClassification'
              control={control}
              rules={{ required: "Business classification is required" }}
              render={({ field: { onChange, value } }) => (
                <Select
                  onValueChange={onChange}
                  value={value}>
                  <SelectTrigger className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30'>
                    <SelectValue
                      placeholder='Select business classification'
                      className='placeholder-gray-500'
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {businessClassification.map((item) => (
                      <SelectItem
                        key={item}
                        value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {showErrorMessage("businessClassification")}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          <div className='space-y-1.5'>
            <label
              htmlFor='registrationNumber'
              className='text-sm font-medium text-gray-700 flex items-center gap-1.5'>
              <Hash
                size={15}
                className='text-gray-500'
              />
              Registration Number
              <span className='text-red-500'>*</span>
            </label>
            <Input
              id='registrationNumber'
              type='number'
              inputMode='numeric'
              pattern='[0-9]*'
              className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30'
              placeholder='Enter registration number'
              {...register("registrationNumber", {
                required: "Registration number is required",
                onChange: (e) => {
                  const value = e.target.value;
                  e.target.value = value.replace(/[^0-9]/g, "");
                },
              })}
            />
            {showErrorMessage("registrationNumber")}
          </div>

          <div className='space-y-1.5'>
            <label className='text-sm font-medium text-gray-700 flex items-center gap-1.5'>
              <Calendar
                size={15}
                className='text-gray-500'
              />
              Established Year
              <span className='text-red-500'>*</span>
            </label>
            <Controller
              name='establishedYear'
              control={control}
              rules={{ required: "Established year is required" }}
              render={({ field: { onChange, value } }) => (
                <Select
                  onValueChange={(val) => onChange(val)}
                  value={value?.toString()}>
                  <SelectTrigger className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30'>
                    <SelectValue placeholder='Select year' />
                  </SelectTrigger>
                  <SelectContent className='max-h-80'>
                    {years.map((item) => (
                      <SelectItem
                        key={item}
                        value={item.toString()}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {showErrorMessage("establishedYear")}
          </div>

          <div className='space-y-1.5'>
            <label
              htmlFor='gstNumber'
              className='text-sm font-medium text-gray-700 flex items-center gap-1.5'>
              <Hash
                size={15}
                className='text-gray-500'
              />
              GST Number
              <span className='text-red-500'>*</span>
            </label>
            <Input
              id='gstNumber'
              className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30'
              placeholder='Enter GST number'
              inputMode='numeric'
              pattern='[0-9]*'
              {...register("gstNumber", {
                required: "GST number is required",
                onChange: (e) => {
                  const value = e.target.value;
                  e.target.value = value.replace(/[^0-9]/g, "");
                },
              })}
            />
            {showErrorMessage("gstNumber")}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          <div className='space-y-1.5'>
            <label
              htmlFor='companyEmail'
              className='text-sm font-medium text-gray-700 flex items-center gap-1.5'>
              <Mail
                size={15}
                className='text-gray-500'
              />
              Company Email
              <span className='text-gray-400 text-xs ml-1'>(Optional)</span>
            </label>

            <Input
              id='companyEmail'
              type='email'
              className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30'
              placeholder='Enter company email'
              {...register("companyEmail", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {showErrorMessage("companyEmail")}
          </div>

          <div className='space-y-1.5'>
            <label
              htmlFor='companyPhone'
              className='text-sm font-medium text-gray-700 flex items-center gap-1.5'>
              <Phone
                size={15}
                className='text-gray-500'
              />
              Company Phone
              <span className='text-gray-400 text-xs ml-1'>(Optional)</span>
            </label>
            <Input
              id='companyPhone'
              className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30'
              inputMode='numeric'
              pattern='[0-9]*'
              placeholder='Enter company phone'
              {...register("companyPhone", {
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "Must be 10-15 digits",
                },
                onChange: (e) => {
                  const value = e.target.value;
                  e.target.value = value.replace(/[^0-9]/g, "");
                },
              })}
            />
            {showErrorMessage("companyPhone")}
          </div>

          <div className='space-y-1.5'>
            <label
              htmlFor='annualTurnover'
              className='text-sm font-medium text-gray-700 flex items-center gap-1.5'>
              <DollarSign
                size={15}
                className='text-gray-500'
              />
              Annual Turnover
              <span className='text-red-500'>*</span>
            </label>
            <Input
              id='annualTurnover'
              className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30'
              inputMode='numeric'
              pattern='[0-9]*'
              placeholder='Enter annual turnover'
              {...register("annualTurnover", {
                required: "Annual turnover is required",
                onChange: (e) => {
                  const value = e.target.value;
                  e.target.value = value.replace(/[^0-9]/g, "");
                },
              })}
            />
            {showErrorMessage("annualTurnover")}
          </div>
        </div>

        <div className='space-y-1.5'>
          <label
            htmlFor='website'
            className='text-sm font-medium text-gray-700 flex items-center gap-1.5'>
            <Globe
              size={15}
              className='text-gray-500'
            />
            Website
            <span className='text-gray-400 text-xs ml-1'>(Optional)</span>
          </label>
          <Input
            id='website'
            className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30'
            placeholder='https://www.yourcompany.com'
            {...register("website")}
          />
        </div>

        <div className='h-px bg-gray-200 my-6'></div>

        <div className='mb-4'>
          <div className='flex items-center gap-2 mb-2'>
            <MapPin
              size={18}
              className='text-primary'
            />
            <h2 className='text-xl font-semibold text-gray-900'>
              Address Information
            </h2>
          </div>
          <p className='text-gray-600 ml-6'>
            Please provide your complete business address.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          <div className='space-y-1.5'>
            <label
              className='text-sm font-medium text-gray-700 flex items-center gap-1.5'
              htmlFor='country'>
              <Globe
                size={15}
                className='text-gray-500'
              />
              Country
              <span className='text-red-500'>*</span>
            </label>
            <Controller
              name='country'
              control={control}
              rules={{ required: "Country is required" }}
              render={({ field: { onChange, value } }) => (
                <Select
                  onValueChange={onChange}
                  value={value}>
                  <SelectTrigger className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30'>
                    <SelectValue
                      placeholder='Select country'
                      className='placeholder-gray-500'
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='India'>India</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {showErrorMessage("country")}
          </div>

          <div className='space-y-1.5'>
            <label
              htmlFor='locality'
              className='text-sm font-medium text-gray-700 flex items-center gap-1.5'>
              <MapPin
                size={15}
                className='text-gray-500'
              />
              Locality
              <span className='text-red-500'>*</span>
            </label>
            <Input
              id='locality'
              className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30'
              placeholder='Enter locality'
              {...register("locality", {
                required: "Locality is required",
              })}
            />
            {showErrorMessage("locality")}
          </div>

          <div className='space-y-1.5'>
            <label
              htmlFor='city'
              className='text-sm font-medium text-gray-700 flex items-center gap-1.5'>
              <MapPin
                size={15}
                className='text-gray-500'
              />
              City
              <span className='text-red-500'>*</span>
            </label>
            <Input
              id='city'
              className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30'
              placeholder='Enter city'
              {...register("city", {
                required: "City is required",
              })}
            />
            {showErrorMessage("city")}
          </div>
        </div>

        <div className='space-y-1.5 mt-4'>
          <label
            htmlFor='pinCode'
            className='text-sm font-medium text-gray-700 flex items-center gap-1.5'>
            <MapPin
              size={15}
              className='text-gray-500'
            />
            PIN Code
            <span className='text-red-500'>*</span>
          </label>
          <Input
            id='pinCode'
            className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30'
            inputMode='numeric'
            pattern='[0-9]*'
            placeholder='Enter PIN code'
            {...register("pinCode", {
              required: "PIN code is required",
              pattern: {
                value: /^\d{5,10}$/,
                message: "Must be 5-10 digits",
              },
              onChange: (e) => {
                const value = e.target.value;
                e.target.value = value.replace(/[^0-9]/g, "");
              },
            })}
          />
          {showErrorMessage("pinCode")}
        </div>

        <div className='space-y-5 mt-2'>
          <div className='space-y-1.5'>
            <label
              htmlFor='addressLineOne'
              className='text-sm font-medium text-gray-700 flex items-center gap-1.5'>
              <MapPin
                size={15}
                className='text-gray-500'
              />
              Address Line 1<span className='text-red-500'>*</span>
            </label>
            <Input
              id='addressLineOne'
              className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30'
              placeholder='Enter street address, P.O. box, etc.'
              {...register("addressLineOne", {
                required: "Address line 1 is required",
              })}
            />
            {showErrorMessage("addressLineOne")}
          </div>

          <div className='space-y-1.5'>
            <label
              htmlFor='addressLineTwo'
              className='text-sm font-medium text-gray-700 flex items-center gap-1.5'>
              <MapPin
                size={15}
                className='text-gray-500'
              />
              Address Line 2
              <span className='text-gray-400 text-xs ml-1'>(Optional)</span>
            </label>
            <Input
              id='addressLineTwo'
              className='h-10 border-gray-300 focus:border-primary focus:ring-primary/30'
              placeholder='Enter apartment, suite, unit, building, floor, etc.'
              {...register("addressLineTwo")}
            />
          </div>
        </div>

        <div className='flex justify-between pt-6'>
          <Button
            type='button'
            onClick={() => setActive(0)}
            className='border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 h-10'>
            Back to Personal Info
          </Button>
          <Button
            type='button'
            onClick={handleNext}
            className='bg-primary hover:bg-primary/90 text-white px-6 h-10'>
            Continue to Documents
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfo;
