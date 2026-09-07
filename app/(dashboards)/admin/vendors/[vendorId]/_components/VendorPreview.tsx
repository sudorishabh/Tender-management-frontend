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
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  FileText,
  DollarSign,
  Hash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";
import InfoCard from "@/components/Shared/InfoCard";
import PageError from "@/components/Shared/PageError";
import PageLoading from "@/components/Shared/PageLoading";
import { borderStyle, primaryButtonStyle } from "@/app/styles";
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
import { VENDOR_STATUS } from "@/enum/vendorStatus.enum";
import { formatDisplayDate } from "@/utils/dateUtils";

interface InfoItemProps {
  label: string;
  value: string;
  isUrl?: boolean;
  icon?: React.ReactNode;
}

interface Props {
  vendorId: string;
}

const InfoItem: React.FC<InfoItemProps> = ({
  label,
  value,
  isUrl = false,
  icon,
}) => {
  return (
    <div className='flex flex-col sm:flex-row sm:justify-between py-2'>
      <p className='text-sm font-medium text-gray-700 mb-1 sm:mb-0 flex items-center gap-2'>
        {icon}
        {label}
      </p>
      <div className='text-right text-gray-900 sm:text-left font-medium'>
        {isUrl ? (
          value ? (
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
            <span className='text-gray-400'>Not provided</span>
          )
        ) : (
          <span>{value || "Not provided"}</span>
        )}
      </div>
    </div>
  );
};

const VendorPreview: FC<Props> = ({ vendorId }) => {
  const { data, isLoading, isError } =
    trpc.vendor.getDetails.useQuery(vendorId);
  const updateStatusMutation = trpc.vendor.vendorStatusUpdateAdmin.useMutation();
  const isUpdating = updateStatusMutation.isPending;

  const router = useRouter();

  if (isLoading) return <PageLoading />;

  if (isError || data?.success === false) {
    return <PageError message='Error fetching vendor details' />;
  }

  const user = data?.user;
  const business = data?.business;

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === user?.vendor_status)
      return toast.error("Status is already updated");

    try {
      const updatedUserData = {
        vendorId: vendorId,
        status: newStatus as VENDOR_STATUS,
      };
      console.log("updatedUserData", updatedUserData);
      const result = await updateStatusMutation.mutateAsync(updatedUserData);
      if (result?.success) {
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
    <div className=''>
      <div className='pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-1'>
          <div
            className={cn(
              "border rounded-2xl shadow-sm p-6 mb-6 sticky top-20 bg-gray-50",
              borderStyle
            )}>
            <div className=' flex  flex-col items-center text-center mb-6'>
              <div className='size-14 rounded-full bg-gray-100 flex items-center justify-center mb-4'>
                <User className='size-8 text-gray-500' />
              </div>
              <h2 className='text-xl text-gray-900 font-bold'>
                {capitalizeFirstLetter(user?.full_name || "")}
              </h2>
              <p className='text-gray-900'>{user?.email}</p>
              <div className='mt-2'>
                <span
                  className={`font-medium border-[0.1rem] rounded-full text-[0.8rem] py-0.5 px-2 ${user?.vendor_status === VENDOR_STATUS.APPROVED
                    ? "bg-green-100  text-green-700 border-green-200"
                    : user?.vendor_status === VENDOR_STATUS.REJECTED
                      ? "bg-red-100  text-red-700 border-red-200"
                      : user?.vendor_status === VENDOR_STATUS.PENDING
                        ? "bg-yellow-100  text-yellow-700 border-yellow-200"
                        : ""
                    }`}>
                  {capitalizeFirstLetter(user?.vendor_status || "")}
                </span>
              </div>
            </div>

            <div className='space-y-3 text-sm'>
              <div className='flex items-center'>
                <Phone className='h-4 w-4 mr-2 text-gray-900 ' />
                <span className='text-gray-900'>
                  {user?.vendor_contact || "Not provided"}
                </span>
              </div>
              <div className='flex items-center'>
                <Mail className='h-4 w-4 mr-2 text-gray-900 ' />
                <span className='text-gray-900'>
                  {user?.email || "Not provided"}
                </span>
              </div>
              <div className='flex items-center'>
                <Briefcase className='h-4 w-4 mr-2  text-gray-900 ' />
                <span className='text-gray-900'>
                  {capitalizeFirstLetter(
                    business?.biz_legal_name || "Not provided"
                  )}
                </span>
              </div>
              <div className='flex items-center'>
                <MapPin className='h-4 w-4 mr-2 text-gray-900 ' />
                <span className='text-gray-900'>
                  {business?.biz_city && business?.biz_country
                    ? `${capitalizeFirstLetter(
                      business.biz_city
                    )}, ${capitalizeFirstLetter(business.biz_country)}`
                    : "Not provided"}
                </span>
              </div>
              <div className='flex items-center'>
                <Calendar className=' h-4 w-4 mr-2 text-gray-900 ' />
                <span className='text-gray-900'>
                  {business?.biz_established_year
                    ? `Established ${business.biz_established_year}`
                    : "Year not provided"}
                </span>
              </div>
            </div>

            {/* Rejection Reason */}
            {user?.vendor_status === VENDOR_STATUS.REJECTED &&
              user?.vendor_rejection_reason && (
                <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
                  <p className='text-xs font-medium text-red-700 mb-1'>
                    Rejection Reason:
                  </p>
                  <p className='text-sm text-red-600'>
                    {user.vendor_rejection_reason}
                  </p>
                </div>
              )}

            <div className='mt-6 pt-6 border-t space-y-4'>
              <div className='w-full'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Change Vendor Status
                </label>
                <Select
                  defaultValue={user?.vendor_status}
                  onValueChange={handleStatusChange}
                  disabled={isUpdating}>
                  <SelectTrigger className='rounded-lg bg-white w-full'>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent className='z-50 rounded-lg'>
                    <SelectItem
                      value={VENDOR_STATUS.PENDING}
                      className='flex items-center'>
                      <div className='flex items-center gap-2'>
                        <Clock className='h-4 w-4 text-yellow-600' />
                        <span>Pending</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value={VENDOR_STATUS.APPROVED}
                      className='flex items-center'>
                      <div className='flex items-center gap-2'>
                        <CheckCircle className='h-4 w-4 text-green-600' />
                        <span>Approved</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value={VENDOR_STATUS.REJECTED}
                      className='flex items-center'>
                      <div className='flex items-center gap-2'>
                        <XCircle className='h-4 w-4 text-red-600' />
                        <span>Rejected</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {isUpdating && (
                  <p className='text-xs text-primary mt-1'>
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
              value={user?.full_name || ""}
              icon={<User className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='Email'
              value={user?.email || ""}
              icon={<Mail className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='Contact Number'
              value={user?.vendor_contact || ""}
              icon={<Phone className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='Alternate Contact'
              value={user?.vendor_alt_contact || ""}
              icon={<Phone className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='Status'
              value={capitalizeFirstLetter(user?.vendor_status || "")}
              icon={<CheckCircle className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='Account Created'
              value={formatDisplayDate(user?.created_at)}
              icon={<Calendar className='h-4 w-4 text-gray-400' />}
            />
          </InfoCard>

          <InfoCard title='Identity Documents'>
            <InfoItem
              label='PAN Card Number'
              value={user?.vendor_pan_number || ""}
              icon={<FileText className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='PAN Card Document'
              value={user?.vendor_pan_doc_key || ""}
              isUrl
              icon={<FileText className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='Aadhaar Card Document'
              value={user?.vendor_adhar_doc_key || ""}
              isUrl
              icon={<FileText className='h-4 w-4 text-gray-400' />}
            />
          </InfoCard>

          <InfoCard title='Business Information'>
            <InfoItem
              label='Legal Name'
              value={business?.biz_legal_name || ""}
              icon={<Briefcase className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='Trade Name'
              value={business?.biz_trade_name || ""}
              icon={<Briefcase className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='Classification'
              value={business?.biz_classification || ""}
              icon={<FileText className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='Registration Number'
              value={business?.biz_reg_number || ""}
              icon={<Hash className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='Established Year'
              value={business?.biz_established_year?.toString() || ""}
              icon={<Calendar className='h-4 w-4 text-gray-400' />}
            />

            <InfoItem
              label='Website'
              value={business?.biz_website || ""}
              icon={<Globe className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='Company Email'
              value={business?.biz_email || ""}
              icon={<Mail className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='Company Phone'
              value={business?.biz_phone || ""}
              icon={<Phone className='h-4 w-4 text-gray-400' />}
            />
          </InfoCard>

          <InfoCard title='Tax & Financial Information'>
            <InfoItem
              label='GST Number'
              value={business?.biz_gst_number || ""}
              icon={<FileText className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='3 Year Turnover'
              value={business?.biz_3_year_turnover?.toString() || ""}
              icon={<DollarSign className='h-4 w-4 text-gray-400' />}
            />
          </InfoCard>

          <InfoCard title='Business Documents'>
            <InfoItem
              label='Registration Document'
              value={business?.biz_reg_doc_key || ""}
              isUrl
              icon={<FileText className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='GST Document'
              value={business?.biz_gst_doc_key || ""}
              isUrl
              icon={<FileText className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='Bank Document'
              value={business?.biz_bank_doc_key || ""}
              isUrl
              icon={<FileText className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='MSME Certificate'
              value={business?.biz_msme_cert_doc_key || ""}
              isUrl
              icon={<FileText className='h-4 w-4 text-gray-400' />}
            />
          </InfoCard>

          <InfoCard title='Business Address'>
            <InfoItem
              label='Address Line 1'
              value={business?.biz_addr_line1 || ""}
              icon={<MapPin className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='Address Line 2'
              value={business?.biz_addr_line2 || ""}
              icon={<MapPin className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='Locality'
              value={business?.biz_locality || ""}
              icon={<MapPin className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='City'
              value={capitalizeFirstLetter(business?.biz_city || "")}
              icon={<MapPin className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='State'
              value={capitalizeFirstLetter(business?.biz_state || "")}
              icon={<MapPin className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='PIN Code'
              value={business?.biz_pin_code || ""}
              icon={<Hash className='h-4 w-4 text-gray-400' />}
            />
            <InfoItem
              label='Country'
              value={capitalizeFirstLetter(business?.biz_country || "")}
              icon={<Globe className='h-4 w-4 text-gray-400' />}
            />
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default VendorPreview;
