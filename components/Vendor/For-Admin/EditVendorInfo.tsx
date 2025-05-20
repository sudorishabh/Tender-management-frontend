import React, { useEffect, FC } from "react";
import {
  Save,
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  Building,
  User,
  MapPin,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { borderStyle, primaryButtonStyle } from "@/app/Styles";
import { cn } from "@/lib/utils";
import { useUploadVendorByAdminMutation } from "@/Redux/vendor/vendorApi";
import { ApiError } from "@/Types";
import { ErrorCodes } from "@/lib/errorCodes";
import { IVendorEditResponse } from "@/Types/Vendor-Types";

interface Props {
  data: IVendorEditResponse;
  vendorId: string;
}

interface FormData {
  user: {
    id: string;
    fullname: string;
    status: string;
    phoneNumber: string;
    panCardNumber: string;
  };
  business: {
    id: string;
    businessName: string;
    registrationNumber: string;
    establishedYear: string;
    addressLineOne: string;
    addressLineTwo: string;
    locality: string;
    city: string;
    pinCode: string;
    country: string;
  };
}

const EditVendorInfo: FC<Props> = ({ data }) => {
  const router = useRouter();
  const [updateVendor, { isLoading: isSubmitting }] =
    useUploadVendorByAdminMutation();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      user: {
        id: "",
        fullname: "",
        phoneNumber: "",
        panCardNumber: "",
      },
      business: {
        id: "",
        businessName: "",
        registrationNumber: "",
        establishedYear: "",
        addressLineOne: "",
        addressLineTwo: "",
        locality: "",
        city: "",
        pinCode: "",
        country: "",
      },
    },
  });

  useEffect(() => {
    if (data) {
      const vendorDetails = data?.vendorDetails;

      reset({
        user: {
          id: vendorDetails.user.id.toString(),
          fullname: vendorDetails.user.fullname,
          phoneNumber: vendorDetails.user.phoneNumber,
          panCardNumber: vendorDetails.user.panCardNumber,
        },
        business: {
          id: vendorDetails.business.id.toString(),
          businessName: vendorDetails.business.businessName,
          registrationNumber: vendorDetails.business.registrationNumber,
          establishedYear: vendorDetails.business.establishedYear,
          addressLineOne: vendorDetails.business.addressLineOne,
          addressLineTwo: vendorDetails.business.addressLineTwo,
          locality: vendorDetails.business.locality,
          city: vendorDetails.business.city,
          pinCode: vendorDetails.business.pinCode,
          country: vendorDetails.business.country,
        },
      });
    }
  }, [data, reset]);

  const showErrorMessage = (fieldName: string) => {
    const getNestedError = (path: string) => {
      const parts = path.split(".");
      let current: Record<string, unknown> = errors;

      for (const part of parts) {
        if (!current || typeof current !== "object") return undefined;
        current = current[part] as Record<string, unknown>;
      }

      return current;
    };

    const error = getNestedError(fieldName);
    return error ? (
      <p className='text-red-600 text-[0.85rem] ml-0.5 mt-1'>
        {error.message as string}
      </p>
    ) : null;
  };

  async function onSubmit(formData: FormData) {
    try {
      const updatedUserData = {
        user: {
          ...formData.user,
          status: data?.vendorDetails?.user?.status,
        },
        business: formData.business,
      };

      const result = await updateVendor(updatedUserData).unwrap();
      if (result.success) {
        toast.success("Vendor status updated successfully");
      }
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.data?.errorCode && ErrorCodes[apiError.data.errorCode]) {
        toast.error(ErrorCodes[apiError.data.errorCode]);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  }

  const StatusIcon = () => {
    const status = watch("user.status");

    switch (status) {
      case "approved":
        return <CheckCircle className='h-5 w-5 text-emerald-500' />;
      case "rejected":
        return <XCircle className='h-5 w-5 text-red-500' />;
      case "pending":
      default:
        return <Clock className='h-5 w-5 text-amber-500' />;
    }
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "pending":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const SectionTitle = ({
    icon,
    title,
  }: {
    icon: React.ReactNode;
    title: string;
  }) => (
    <div className='flex items-center space-x-2 mb-4'>
      {icon}
      <h3 className='text-lg font-medium text-gray-900'>{title}</h3>
    </div>
  );

  const FormField = ({
    label,
    name,
    register: registerFn,
    errorField,
    required = false,
    className = "",
  }: {
    label: string;
    name: string;
    register: Record<string, unknown>;
    errorField: string;
    required?: boolean;
    className?: string;
  }) => (
    <div className={className}>
      <label
        className='block text-sm font-medium text-gray-700 mb-1'
        htmlFor={name}>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
      <Input
        id={name}
        className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
        {...registerFn}
      />
      {showErrorMessage(errorField)}
    </div>
  );

  return (
    <div
      className={cn(
        "mx-auto max-w-[61rem] bg-gray-50 mt-10 rounded-xl border px-4 sm:px-6 lg:px-8 py-8",
        borderStyle
      )}>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Edit Details</h1>
          <p className='mt-1 text-sm text-gray-500'>
            Edit vendor information and business details
          </p>
        </div>
        <Badge
          className={`${getStatusClasses(
            watch("user.status")
          )} px-3 py-1.5 text-xs font-medium border rounded-full flex items-center gap-1.5`}>
          <StatusIcon />
          <span className='capitalize'>
            {watch("user.status") || "Pending"}
          </span>
        </Badge>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-8'>
          <Card className='overflow-hidden border border-gray-200 rounded-lg shadow-sm'>
            <CardContent className='p-6'>
              <SectionTitle
                icon={<User className='h-5 w-5 text-blue-600' />}
                title='Vendor Profile'
              />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                  label='Full Name'
                  name='full_name'
                  register={register("user.fullname", {
                    required: "Full name is required",
                  })}
                  errorField='user.fullname'
                  required
                />

                <FormField
                  label='Contact Number'
                  name='contact_number'
                  register={register("user.phoneNumber", {
                    required: "Contact number is required",
                  })}
                  errorField='user.phoneNumber'
                  required
                />

                <FormField
                  label='PAN Card Number'
                  name='pan_card_number'
                  register={register("user.panCardNumber", {
                    required: "PAN card number is required",
                  })}
                  errorField='user.panCardNumber'
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card className='overflow-hidden border border-gray-200 rounded-lg shadow-sm'>
            <CardContent className='p-6'>
              <SectionTitle
                icon={<Building className='h-5 w-5 text-blue-600' />}
                title='Business Information'
              />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                  label='Business Name'
                  name='business_name'
                  register={register("business.businessName", {
                    required: "Business name is required",
                  })}
                  errorField='business.businessName'
                  required
                />

                <FormField
                  label='Registration Number'
                  name='registration_number'
                  register={register("business.registrationNumber", {
                    required: "Registration number is required",
                  })}
                  errorField='business.registrationNumber'
                  required
                />

                <FormField
                  label='Established Year'
                  name='established_year'
                  register={register("business.establishedYear", {
                    required: "Established year is required",
                  })}
                  errorField='business.establishedYear'
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card className='overflow-hidden border border-gray-200 rounded-lg shadow-sm'>
            <CardContent className='p-6'>
              <SectionTitle
                icon={<MapPin className='h-5 w-5 text-blue-600' />}
                title='Business Address'
              />

              <div className='grid grid-cols-1 gap-6'>
                <FormField
                  label='Address Line 1'
                  name='address_line1'
                  register={register("business.addressLineOne", {
                    required: "Address line 1 is required",
                  })}
                  errorField='business.addressLineOne'
                  required
                />

                <FormField
                  label='Address Line 2'
                  name='address_line2'
                  register={register("business.addressLineTwo")}
                  errorField='business.addressLineTwo'
                />

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <FormField
                    label='Locality'
                    name='locality'
                    register={register("business.locality", {
                      required: "Locality is required",
                    })}
                    errorField='business.locality'
                    required
                  />

                  <FormField
                    label='City'
                    name='city'
                    register={register("business.city", {
                      required: "City is required",
                    })}
                    errorField='business.city'
                    required
                  />

                  <FormField
                    label='PIN Code'
                    name='pin_code'
                    register={register("business.pinCode", {
                      required: "PIN code is required",
                    })}
                    errorField='business.pinCode'
                    required
                  />

                  <FormField
                    label='Country'
                    name='country'
                    register={register("business.country", {
                      required: "Country is required",
                    })}
                    errorField='business.country'
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className='flex justify-between items-center mt-8'>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.push("/admin/vendors")}
              className='flex items-center space-x-2 rounded-md border-gray-300 hover:bg-gray-50'>
              <ArrowLeft className='h-4 w-4' />
              <span>Back to Vendors</span>
            </Button>

            <Button
              type='submit'
              disabled={isSubmitting}
              className={primaryButtonStyle}>
              {isSubmitting ? (
                <span className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
              ) : (
                <>
                  <Save className='h-4 w-4 mr-2' />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditVendorInfo;
