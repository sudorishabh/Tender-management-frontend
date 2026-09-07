import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/_components/ui/form";
import { businessClassification } from "@/lib/constants";
import { MapPin, Info, Award, ArrowLeft, ArrowRight } from "lucide-react";
import { Checkbox } from "@/_components/ui/checkbox";
import React, { FC } from "react";
import { useFormContext } from "react-hook-form";
import { type RegistrationFormValues } from "../_schemas/registration.schema";
import CustomInput from "@/_components/Shared/CustomInput";
import { toast } from "sonner";
import CustomButton from "@/_components/Shared/CustomButton";

interface Props {
  handleNextStep: (active: number) => void;
  setActive: (active: number) => void;
}

const BusinessInfo: FC<Props> = ({ handleNextStep, setActive }) => {
  const { control, trigger, setValue } =
    useFormContext<RegistrationFormValues>();

  const years = Array.from(
    { length: new Date().getFullYear() - 1900 },
    (_, i) => new Date().getFullYear() - i
  );

  const handleNext = async () => {
    const businessFields = [
      "business.biz_legal_name",
      "business.biz_trade_name",
      "business.biz_classification",
      "business.biz_reg_number",
      "business.biz_established_year",
      "business.biz_gst_number",
      "business.biz_email",
      "business.biz_phone",
      "business.biz_3_year_turnover",
      "business.biz_website",
      "business.biz_country",
      "business.biz_locality",
      "business.biz_pin_code",
      "business.biz_city",
      "business.biz_state",
      "business.biz_addr_line1",
      "business.biz_addr_line2",
    ] as const;

    const isValid = await trigger(businessFields);
    if (isValid) {
      handleNextStep(2);
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
          <h2 className='font-medium text-gray-700'>Business Details</h2>
        </div>
        <p className='text-xs text-gray-500 ml-6'>
          Provide information about your company to help tenders find you.
        </p>
      </div>

      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <CustomInput
            Label='Legal Name'
            control={control}
            fieldName='business.biz_legal_name'
            placeholder='Enter your business legal name'
          />

          <CustomInput
            Label='Trade Name'
            control={control}
            fieldName='business.biz_trade_name'
            placeholder='Enter your business trade name'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <CustomInput
            Label='Business Classification'
            control={control}
            fieldName='business.biz_classification'
            placeholder='Select business classification'
            isSelect={true}
            selectOptions={businessClassification.map((item) => ({
              label: item,
              value: item,
            }))}
          />
          <CustomInput
            Label='Company Email'
            control={control}
            fieldName='business.biz_email'
            placeholder='Enter company email'
            type='email'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <CustomInput
            Label='Registration Number'
            control={control}
            fieldName='business.biz_reg_number'
            placeholder='Enter registration number'
            onChange={(value) => {
              const numericValue = value.replace(/[^0-9]/g, "");
              setValue("business.biz_reg_number", numericValue);
            }}
          />

          <CustomInput
            Label='GST Number'
            control={control}
            fieldName='business.biz_gst_number'
            placeholder='Enter GST number'
            onChange={(value) => {
              const numericValue = value.replace(/[^0-9]/g, "");
              setValue("business.biz_gst_number", numericValue);
            }}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          <CustomInput
            Label='Company Phone'
            control={control}
            fieldName='business.biz_phone'
            placeholder='Enter company phone'
            onChange={(value) => {
              const numericValue = value.replace(/[^0-9]/g, "");
              setValue("business.biz_phone", numericValue);
            }}
          />

          <CustomInput
            Label='Last Three Years Turnover (INR)'
            control={control}
            fieldName='business.biz_3_year_turnover'
            placeholder='Enter last three years turnover'
            onChange={(value) => {
              const numericValue = value.replace(/[^0-9]/g, "");
              setValue("business.biz_3_year_turnover", numericValue);
            }}
          />

          <CustomInput
            Label='Established Year'
            control={control}
            fieldName='business.biz_established_year'
            placeholder='Select year'
            isSelect={true}
            selectOptions={years.map((item) => ({
              label: item.toString(),
              value: item.toString(),
            }))}
          />
        </div>

        <CustomInput
          Label='Website'
          control={control}
          fieldName='business.biz_website'
          placeholder='https://www.yourcompany.com'
          optional={true}
        />

        <FormField
          control={control}
          name='business.biz_has_msme'
          render={({ field }) => (
            <FormItem className='flex items-center space-x-3 px-4 py-2.5 bg-amber-50 rounded-lg border border-amber-200'>
              <FormControl>
                <Checkbox
                  id='hasMsme'
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className='border-amber-400 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500'
                />
              </FormControl>
              <FormLabel
                htmlFor='hasMsme'
                className='text-xs font-medium text-gray-700 flex items-center gap-1.5 cursor-pointer !mt-0'>
                <Award
                  size={15}
                  className='text-amber-600'
                />
                I have an MSME Certificate
                <span className='text-gray-500 ml-1'>
                  (Check this if your business is registered under MSME)
                </span>
              </FormLabel>
            </FormItem>
          )}
        />

        <div className='h-px bg-gray-200 my-6'></div>

        <div className='mb-4'>
          <div className='flex items-center gap-2 mb-2'>
            <MapPin
              size={18}
              className='text-primary'
            />
            <h2 className='font-semibold text-gray-700'>Address Information</h2>
          </div>
          <p className='text-xs text-gray-500 ml-6'>
            Please provide your complete business address.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          <FormField
            control={control}
            name='business.biz_country'
            render={({ field }) => (
              <FormItem className='space-y-2'>
                <FormLabel className='text-xs font-medium text-neutral-700 flex items-center gap-2'>
                  <span>Country</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}>
                  <FormControl>
                    <SelectTrigger className='h-[2.25rem] px-4 text-sm bg-neutral-50 border-neutral-200 rounded-lg placeholder:text-neutral-400 transition-all duration-200 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 hover:border-neutral-300'>
                      <SelectValue
                        placeholder='Select country'
                        className='placeholder-gray-500'
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='India'>India</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className='text-xs' />
              </FormItem>
            )}
          />

          <CustomInput
            Label='Locality'
            control={control}
            fieldName='business.biz_locality'
            placeholder='Enter locality'
          />

          <CustomInput
            Label='PIN Code'
            control={control}
            fieldName='business.biz_pin_code'
            placeholder='Enter PIN code'
            onChange={(value) => {
              const numericValue = value.replace(/[^0-9]/g, "");
              setValue("business.biz_pin_code", numericValue);
            }}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <CustomInput
            Label='City'
            control={control}
            fieldName='business.biz_city'
            placeholder='Enter city'
          />

          <CustomInput
            Label='State'
            control={control}
            fieldName='business.biz_state'
            placeholder='Enter state'
          />
        </div>

        <div className='space-y-5 mt-2'>
          <CustomInput
            Label='Address Line 1'
            control={control}
            fieldName='business.biz_addr_line1'
            placeholder='Enter street address, P.O. box, etc.'
          />

          <CustomInput
            Label='Address Line 2'
            control={control}
            fieldName='business.biz_addr_line2'
            placeholder='Enter apartment, suite, unit, building, floor, etc.'
            optional={true}
          />
        </div>

        <div className='bg-gray-50 p-3 mb-6 rounded-lg border border-gray-200 flex items-center gap-3'>
          <Info
            size={14}
            className='text-primary shrink-0'
          />
          <p className='text-sm text-gray-700'>
            <span className='font-medium'>Note:</span> You will be asked to
            upload supporting documents in the next step.
          </p>
        </div>

        <div className='flex justify-between pt-4'>
          <CustomButton
            btnName='Back to Personal Info'
            variant='secondary'
            onClick={() => setActive(0)}
            LeftIcon={ArrowLeft}
          />
          <CustomButton
            btnName='Continue to Documents'
            variant='primary'
            onClick={handleNext}
            RightIcon={ArrowRight}
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessInfo;
