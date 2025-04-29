"use client";
import React, { FC } from "react";
import {
  Edit,
  Mail,
  Phone,
  Calendar,
  User,
  Briefcase,
  MapPin,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { capitalizeFirstLetter } from "@/lib/helper";
import {
  useGetVendorDetailsQuery,
  useUploadVendorByAdminMutation,
} from "@/Redux/vendor/vendorApi";
import { useRouter } from "next/navigation";
import InfoCard from "@/components/Shared/InfoCard";
import PageError from "@/components/Shared/PageError";
import PageLoading from "@/components/Shared/PageLoading";
import { borderStyle, primaryButtonStyle } from "@/app/Styles";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import PdfViewerModal from "@/components/Shared/PdfViewerModal";

interface InfoItemProps {
  label: string;
  value: string;
  isUrl?: boolean;
}

interface Props {
  vendorId: string;
}

interface VendorData {
  user: {
    id: string;
    fullname: string;
    email: string;
    role: string;
    status: string;
    phoneNumber: string;
    panCardNumber: string;
    panCardDoc: string;
    createdAt: string;
  };
  business: {
    id: string;
    businessName: string;
    businessClassification: string;
    registrationNumber: string;
    establishedYear: string;
    addressLineOne: string;
    addressLineTwo: string;
    locality: string;
    city: string;
    pinCode: string;
    country: string;
    registrationDoc: string;
    msmeCertificate: string;
    website: string;
    companyEmail: string;
    gstNumber: string;
    companyPhone: string;
    annualTurnover: string;
  };
}
const InfoItem: React.FC<InfoItemProps> = ({ label, value, isUrl = false }) => {
  return (
    <div className='flex flex-col sm:flex-row sm:justify-between py-2'>
      <p className='text-sm font-medium text-gray-700  mb-1 sm:mb-0'>{label}</p>
      <div className='text-right text-gray-900 sm:text-left font-medium'>
        {isUrl ? (
          <PdfViewerModal
            value={value}
            isS3File={true}
            triggerButton={
              <p className='cursor-pointer text-primary inline-flex items-center hover:underline'>
                View Document
              </p>
            }
          />
        ) : (
          <span>{value || "Not provided"}</span>
        )}
      </div>
    </div>
  );
};

const VendorPreview: FC<Props> = ({ vendorId }) => {
  const { data, isLoading, isError } = useGetVendorDetailsQuery(vendorId);
  const [updateVendor, { isLoading: isUpdating }] =
    useUploadVendorByAdminMutation();

  const router = useRouter();

  if (isLoading) return <PageLoading />;

  if (isError || data?.success === false) {
    return <PageError message='Error fetching vendor details' />;
  }

  const { user, business } = data?.vendorDetails as VendorData;

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === user?.status) return;

    try {
      const updatedUserData = {
        user: {
          ...user,
          status: newStatus,
        },
        business: business,
      };

      const result = await updateVendor(updatedUserData).unwrap();
      if (result.success) {
        toast.success("Vendor status updated successfully");
      } else {
        toast.error("Failed to update vendor status");
      }
    } catch (error) {
      toast.error("An error occurred while updating status");
      console.error("Status update error:", error);
    }
  };

  return (
    <div className='container mx-auto px-6 py-8'>
      <div className='w-full bg-white border-b mb-8'>
        <div className='container mx-auto py-8'>
          <div className='flex items-center mb-4'>
            <button
              onClick={() => router.back()}
              className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors mr-4'>
              <ArrowLeft className='size-6' />
            </button>
            <div className='ml-4'>
              <h1 className='text-3xl font-bold text-gray-900'>
                Vendor Details
              </h1>
              <p className='text-gray-600 mt-1'>
                View details of
                <span className='font-semibold text-gray-900 ml-1'>
                  {data?.vendorDetails?.user?.fullname || "this vendor"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='px-16 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-1'>
          <div
            className={cn(
              "border rounded-2xl shadow-sm p-6 mb-6 sticky top-28 bg-gray-50",
              borderStyle
            )}>
            <div className=' flex  flex-col items-center text-center mb-6'>
              <div className='h-24 w-24 rounded-full bg-card-darker1 flex items-center justify-center mb-4'>
                <User className='h-12 w-12 text-gray-500' />
              </div>
              <h2 className='text-xl text-gray-900 font-bold'>
                {capitalizeFirstLetter(user?.fullname)}
              </h2>
              <p className='text-gray-900'>{user?.email}</p>
              <div className='mt-2'>
                <span
                  className={`font-medium border-[0.1rem] rounded-full text-[0.8rem] py-0.5 px-2 ${
                    user?.status === "pending"
                      ? "bg-orange-100  text-orange-700 border-orange-200"
                      : user?.status === "approved"
                      ? "bg-green-100  text-green-700 border-green-200"
                      : user?.status === "rejected"
                      ? "bg-red-100  text-red-700 border-red-200"
                      : ""
                  }`}>
                  {capitalizeFirstLetter(user?.status)}
                </span>
              </div>
            </div>

            <div className='space-y-3 text-sm'>
              <div className='flex items-center'>
                <Phone className='h-4 w-4 mr-2 text-gray-900 ' />
                <span className='text-gray-900'>{user?.phoneNumber}</span>
              </div>
              <div className='flex items-center'>
                <Mail className='h-4 w-4 mr-2 text-gray-900 ' />
                <span className='text-gray-900'>{user?.email}</span>
              </div>
              <div className='flex items-center'>
                <Briefcase className='h-4 w-4 mr-2  text-gray-900 ' />
                <span className='text-gray-900'>
                  {capitalizeFirstLetter(business?.businessName)}
                </span>
              </div>
              <div className='flex items-center'>
                <MapPin className='h-4 w-4 mr-2 text-gray-900 ' />
                <span className='text-gray-900'>
                  {capitalizeFirstLetter(business?.city)},{" "}
                  {capitalizeFirstLetter(business?.country)}
                </span>
              </div>
              <div className='flex items-center'>
                <Calendar className=' h-4 w-4 mr-2 text-gray-900 ' />
                <span className='text-gray-900'>
                  Established {business?.establishedYear}
                </span>
              </div>
            </div>

            <div className='mt-6 pt-6 border-t space-y-4'>
              <div className='w-full'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Change Vendor Status
                </label>
                <Select
                  defaultValue={user?.status}
                  onValueChange={handleStatusChange}
                  disabled={isUpdating}>
                  <SelectTrigger className='rounded-lg bg-white w-full'>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent className='z-50 rounded-lg'>
                    <SelectItem
                      value='pending'
                      className='flex items-center'>
                      <div className='flex items-center gap-2'>
                        <Clock className='h-4 w-4 text-orange-600' />
                        <span>Pending</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value='approved'
                      className='flex items-center'>
                      <div className='flex items-center gap-2'>
                        <CheckCircle className='h-4 w-4 text-green-600' />
                        <span>Approved</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value='rejected'
                      className='flex items-center'>
                      <div className='flex items-center gap-2'>
                        <XCircle className='h-4 w-4 text-red-600' />
                        <span>Rejected</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {isUpdating && (
                  <p className='text-xs text-blue-600 mt-1'>
                    Updating status...
                  </p>
                )}
              </div>

              <Button
                className={cn(primaryButtonStyle, "w-full")}
                onClick={() => router.push(`/admin/vendors/${vendorId}/edit`)}
                disabled={isUpdating}>
                <Edit className='mr-2 h-4 w-4' /> Edit Details
              </Button>
            </div>
          </div>
        </div>

        <div className='lg:col-span-2 space-y-6'>
          <InfoCard title='Vendor Profile'>
            <InfoItem
              label='Full Name'
              value={user?.fullname}
            />
            <InfoItem
              label='Contact Number'
              value={user?.phoneNumber}
            />
            <InfoItem
              label='PAN Card Number'
              value={user?.panCardNumber}
            />
            <InfoItem
              label='PAN Card Document'
              value={user?.panCardDoc}
              isUrl
            />
            <InfoItem
              label='Status'
              value={capitalizeFirstLetter(user?.status)}
            />
            <InfoItem
              label='Account Created'
              value={new Date(user?.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
          </InfoCard>

          <InfoCard title='Business Information'>
            <InfoItem
              label='Business Name'
              value={business?.businessName}
            />
            <InfoItem
              label='Classification'
              value={business?.businessClassification}
            />
            <InfoItem
              label='Registration Number'
              value={business?.registrationNumber}
            />

            <InfoItem
              label='Established Year'
              value={business?.establishedYear}
            />
            {business?.website && (
              <InfoItem
                label='Website'
                value={business?.website}
              />
            )}
            {business?.companyEmail && (
              <InfoItem
                label='Company Email'
                value={business?.companyEmail}
              />
            )}
            {business?.gstNumber && (
              <InfoItem
                label='GST Number'
                value={business?.gstNumber}
              />
            )}
            {business?.companyPhone && (
              <InfoItem
                label='Company Phone'
                value={business?.companyPhone}
              />
            )}
            {business?.annualTurnover && (
              <InfoItem
                label='Annual Turnover'
                value={business?.annualTurnover}
              />
            )}
            <InfoItem
              label='Registration Document'
              value={business?.registrationDoc}
              isUrl
            />
            {business?.msmeCertificate && (
              <InfoItem
                label='MSME Certificate'
                value={business?.msmeCertificate}
                isUrl
              />
            )}
          </InfoCard>

          <InfoCard title='Business Address'>
            <InfoItem
              label='Address Line 1'
              value={business?.addressLineOne}
            />
            <InfoItem
              label='Address Line 2'
              value={business?.addressLineTwo}
            />
            <InfoItem
              label='Locality'
              value={business?.locality}
            />
            <InfoItem
              label='City'
              value={capitalizeFirstLetter(business?.city)}
            />
            <InfoItem
              label='PIN Code'
              value={business?.pinCode}
            />
            <InfoItem
              label='Country'
              value={capitalizeFirstLetter(business?.country)}
            />
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default VendorPreview;
