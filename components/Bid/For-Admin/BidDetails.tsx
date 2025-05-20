import { FC } from "react";
import {
  FileText,
  Building,
  User,
  BarChart4,
  Star,
  ArrowLeft,
  ThumbsDown,
  Check,
  Calendar,
  Hash,
  CreditCard,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
import { format } from "date-fns";
import PdfViewerModal from "@/components/Shared/PdfViewerModal";
import BidStatusConfirmDialog from "@/components/Bid/For-Admin/BidStatusConfirmDialog";

import InfoCard from "@/components/Shared/InfoCard";
import { primaryButtonStyle, secondaryButtonStyle2 } from "@/app/Styles";
import { RootState } from "@/Redux/store";
import { useSelector } from "react-redux";

import RejectBidDialog from "./RejectBidDialog";
import { NextRouter } from "next/router";
interface DetailItemProps {
  label: string;
  value: string | null | undefined;
  className?: string;
  icon?: React.ReactNode;
}
const DetailItem = ({ label, value, className, icon }: DetailItemProps) => {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      {icon && <div className='mt-0.5 text-primary/70'>{icon}</div>}
      <div className='flex-1'>
        <p className='text-sm font-medium text-gray-500 mb-1'>{label}</p>
        <p className='text-sm font-medium break-words text-gray-900'>
          {value || "—"}
        </p>
      </div>
    </div>
  );
};

interface ScoreInputProps {
  currentScore: number;
  maxScore: number;
  onScoreChange: (newScore: number) => void;
  disabled?: boolean;
}

const ScoreInput: FC<ScoreInputProps> = ({
  currentScore,
  maxScore,
  onScoreChange,
  disabled = false,
}) => {
  return (
    <div className='flex items-center gap-2'>
      <div className='relative flex items-center'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={18}
            className={`cursor-pointer transition-colors ${
              index < currentScore
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300 hover:text-gray-400"
            }`}
            onClick={() => !disabled && onScoreChange(index + 1)}
          />
        ))}
      </div>
      <span className='text-sm font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded'>
        {currentScore}/{maxScore}
      </span>
    </div>
  );
};

interface IBidDetailsResponse {
  bidsDetails: {
    bidData: {
      bank_branch: string;
      bank_number: string;
      created_at: string;
      dd_date: string;
      dd_number: string;
      financial_doc_s3_name: string;
      financial_score: string;
      id: number;
      optional_info: null | string;
      ranking: number;
      rejection_message: null | string;
      status: string;
      technical_doc_s3_name: string;
      technical_score: string;
      tender_id: number;
      total_score: string;
      updated_at: string;
      vendor_id: number;
    };
    businessData: {
      address_line1: string;
      address_line2: string;
      annual_turnover: string;
      business_classification: string;
      business_name: string;
      city: string;
      company_email: string;
      company_phone: string;
      country: string;
      created_at: string;
      employee_count: number | null;
      established_year: string;
      gst_number: string | null;
      id: number;
      locality: string;
      msme_certificate_s3_name: string;
      pin_code: string;
      registration_doc_s3_name: string;
      registration_number: string;
      state: string;
      updated_at: string;
      user_id: number;
      website: string;
    };
    tenderData: {
      bid_open_date: string;
      bid_submission_end_date: string;
      category: string;
      clarification_end_date: string;
      clarification_start_date: string;
      commercial_weightage: string;
      company: string;
      created_at: string;
      created_by: number;
      department: string;
      description: string;
      doc_fee: string;
      emd: string;
      emd_payable_at: string;
      fee_payable_at: string;
      id: number;
      location: string;
      pre_publish_date: string;
      publish_date: string;
      revision_publishment_date: string;
      sale_close_date: string;
      scope: string;
      select_all: boolean;
      status: string;
      tech_prebid_qual: string;
      tech_weightage: string;
      tender_number: string;
      title: string;
      type: string;
      updated_at: string;
      value: string;
    };
    vendorData: {
      alternate_contact: string | null;
      contact_number: string;
      created_at: string;
      full_name: string;
      id: number;
      pan_card_doc_s3_name: string;
      pan_card_number: string;
      profile_image_s3_name: string | null;
      rejection_reason: string | null;
      status: string;
      updated_at: string;
      user_id: number;
    };
  };
}

interface Props {
  handleTechnicalScoreChange: (newScore: number) => void;
  handleFinancialScoreChange: (newScore: number) => void;
  handleUpdateStatus: (status: "selected" | "rejected") => void;
  confirmSetBidStatus: () => void;
  confirmRejectBid: () => void;
  handleSelectTemplate: (template: string) => void;
  isUpdatingScore: boolean;
  isSettingBidStatus: boolean;
  data: IBidDetailsResponse;
  setRejectDialog: (rejectDialog: { isOpen: boolean; message: string }) => void;
  rejectDialog: { isOpen: boolean; message: string };
  setConfirmDialog: (confirmDialog: {
    isOpen: boolean;
    status: string;
  }) => void;
  confirmDialog: { isOpen: boolean; status: string };
  technicalScore: number;
  financialScore: number;
  router: NextRouter;
}

const BidDetails: FC<Props> = ({
  handleTechnicalScoreChange,
  handleFinancialScoreChange,
  handleUpdateStatus,
  confirmSetBidStatus,
  confirmRejectBid,
  handleSelectTemplate,
  isUpdatingScore,
  isSettingBidStatus,
  data,
  setRejectDialog,
  rejectDialog,
  setConfirmDialog,
  confirmDialog,
  technicalScore,
  financialScore,
  router,
}) => {
  const {
    user: { role },
  } = useSelector((state: RootState) => state.authSlice);

  const { bidData, tenderData, vendorData, businessData } =
    data?.bidsDetails || {};

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "selected":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getTotalScore = () => {
    return ((technicalScore + financialScore) / 10) * 100;
  };

  return (
    <AdminPagesWrapper>
      <div className='min-h-screen'>
        <div className='container mx-auto px-4 sm:px-6 py-8'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4'>
            <div className='flex items-center'>
              <button
                onClick={() => router.back()}
                className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm'>
                <ArrowLeft className='size-5 text-gray-700' />
              </button>
              <div className='ml-4'>
                <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight'>
                  Bid Details
                </h1>
                <div className='flex items-center mt-1'>
                  <p className='text-gray-600'>
                    Submitted by
                    <span className='font-semibold text-gray-900 ml-1'>
                      {vendorData?.full_name || "this vendor"}
                    </span>
                  </p>
                  <div className='flex items-center ml-4'>
                    <Badge
                      className={cn(
                        "ml-2 font-medium",
                        getStatusColor(bidData?.status)
                      )}
                      variant='outline'>
                      {bidData?.status === "under_review"
                        ? "under review"
                        : bidData?.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {role === "admin" && (
              <div className='flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0'>
                {bidData?.status?.toLowerCase() === "under_review" && (
                  <Button
                    onClick={() => handleUpdateStatus("selected")}
                    className={primaryButtonStyle}
                    disabled={isSettingBidStatus}>
                    <Check className='mr-2 h-4 w-4' />
                    Select Bid
                  </Button>
                )}
                {bidData?.status?.toLowerCase() === "under_review" ||
                bidData?.status?.toLowerCase() === "selected" ||
                bidData?.status?.toLowerCase() === "ranked" ||
                bidData?.status?.toLowerCase() !== "rejected" ? (
                  <Button
                    onClick={() => handleUpdateStatus("rejected")}
                    variant='outline'
                    className='border-red-500 text-red-600 hover:bg-red-50 rounded-mmd'
                    disabled={isSettingBidStatus}>
                    <ThumbsDown className='mr-2 h-4 w-4' />
                    Reject Bid
                  </Button>
                ) : null}
              </div>
            )}
          </div>

          {/* Score Overview */}
          <div className='bg-white rounded-xl shadow border border-gray-200 p-4 mb-8'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='p-4 rounded-lg bg-primary/5 border border-primary/15'>
                <h3 className='text-sm font-medium text-accent mb-2'>
                  Technical Score
                </h3>
                <div className='flex items-center'>
                  <div className='text-2xl font-bold text-accent'>
                    {technicalScore}
                  </div>
                  <span className='text-sm font-medium text-accent ml-1'>
                    /5
                  </span>
                </div>
              </div>

              <div className='p-4 rounded-lg bg-primary/5 border border-primary/15'>
                <h3 className='text-sm font-medium text-accent mb-2'>
                  Financial Score
                </h3>
                <div className='flex items-center'>
                  <div className='text-2xl font-bold text-accent'>
                    {financialScore}
                  </div>
                  <span className='text-sm font-medium text-accent ml-1'>
                    /5
                  </span>
                </div>
              </div>
              <div className='p-4 rounded-lg bg-primary/5 border border-primary/15'>
                <h3 className='text-sm font-medium text-accent mb-2'>
                  Total Score
                </h3>
                <div className='flex items-center'>
                  <div className='text-2xl font-bold text-accent'>
                    {getTotalScore()}%
                  </div>
                </div>
              </div>
              <div className='p-4 rounded-lg bg-primary/5 border border-primary/15'>
                <h3 className='text-sm font-medium text-accent mb-2'>
                  Submission Date
                </h3>
                <div className='flex items-center'>
                  <div className='text-lg font-medium text-accent'>
                    {bidData?.created_at
                      ? format(new Date(bidData.created_at), "dd MMM yyyy")
                      : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
            <div className='lg:col-span-2'>
              <InfoCard title='Bid Information'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <DetailItem
                    label='DD Number'
                    value={bidData?.dd_number}
                    icon={<Hash size={16} />}
                  />
                  <DetailItem
                    label='DD Date'
                    value={
                      bidData?.dd_date
                        ? format(new Date(bidData.dd_date), "PPP")
                        : "—"
                    }
                    icon={<Calendar size={16} />}
                  />
                  <DetailItem
                    label='Bank Number'
                    value={bidData?.bank_number}
                    icon={<CreditCard size={16} />}
                  />
                  <DetailItem
                    label='Bank Branch'
                    value={bidData?.bank_branch}
                    icon={<Home size={16} />}
                  />
                </div>

                <Separator className='my-6' />

                <h4 className='text-sm font-semibold text-gray-800 mb-4 flex items-center'>
                  <BarChart4 className='mr-2 h-4 w-4 text-primary' />
                  Tender Information
                </h4>
                <div className='p-4 rounded-lg bg-gray-50 border border-gray-100'>
                  <DetailItem
                    label='Tender Title'
                    value={tenderData?.title}
                    className='mb-3'
                  />
                  <DetailItem
                    label='Organization'
                    value={tenderData?.company}
                    className='mb-3'
                  />
                  <DetailItem
                    label='Description'
                    value={tenderData?.description}
                  />
                </div>

                <Separator className='my-6' />

                <h4 className='text-sm font-semibold text-gray-800 mb-4 flex items-center'>
                  <FileText className='mr-2 h-4 w-4 text-primary' />
                  Documents
                </h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='bg-white p-5 flex flex-col gap-4 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-shadow relative overflow-hidden'>
                    <div className='absolute top-0 right-0 w-16 h-16 transform translate-x-8 -translate-y-8 rotate-45 bg-primary/10'></div>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <div className='h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center'>
                          <FileText className='h-4 w-4 text-accent' />
                        </div>
                        <h4 className='font-semibold text-gray-800'>
                          Technical Document
                        </h4>
                      </div>
                      <Badge
                        variant='outline'
                        className='bg-primary/10 text-accent border-primary/50'>
                        Required
                      </Badge>
                    </div>

                    <Separator className='my-1' />

                    <div className='flex flex-col gap-2'>
                      {role === "admin" && (
                        <div className='flex justify-between items-center'>
                          <p className='text-sm text-gray-600'>
                            Evaluation Score
                          </p>
                          <ScoreInput
                            currentScore={technicalScore}
                            maxScore={5}
                            onScoreChange={handleTechnicalScoreChange}
                            disabled={isUpdatingScore}
                          />
                        </div>
                      )}
                      <div className='flex items-center gap-2 text-xs text-gray-500 mt-1'>
                        <span className='bg-gray-100 px-2 py-1 rounded'>
                          {bidData?.technical_doc_s3_name
                            ? "Document uploaded"
                            : "No document"}
                        </span>
                        <span>•</span>
                        <span>
                          {bidData?.created_at
                            ? format(new Date(bidData.created_at), "PPP")
                            : "Unknown date"}
                        </span>
                      </div>
                    </div>

                    <PdfViewerModal
                      value={bidData?.technical_doc_s3_name || null}
                      isS3File={true}
                      triggerButton={
                        <Button
                          variant='default'
                          size='sm'
                          className={cn(secondaryButtonStyle2, "w-full")}
                          disabled={!bidData?.technical_doc_s3_name}>
                          <FileText className='mr-2 h-4 w-4' />
                          View Document
                        </Button>
                      }
                    />
                  </div>

                  <div className='bg-white p-5 flex flex-col gap-4 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-shadow relative overflow-hidden'>
                    <div className='absolute top-0 right-0 w-16 h-16 transform translate-x-8 -translate-y-8 rotate-45 bg-primary/10'></div>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <div className='h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center'>
                          <FileText className='h-4 w-4 text-accent' />
                        </div>
                        <h4 className='font-semibold text-gray-800'>
                          Financial Document
                        </h4>
                      </div>
                      <Badge
                        variant='outline'
                        className='bg-primary/10 text-accent border-primary/50'>
                        Required
                      </Badge>
                    </div>

                    <Separator className='my-1' />

                    <div className='flex flex-col gap-2'>
                      {role === "admin" && (
                        <div className='flex justify-between items-center'>
                          <p className='text-sm text-gray-600'>
                            Evaluation Score
                          </p>
                          <ScoreInput
                            currentScore={financialScore}
                            maxScore={5}
                            onScoreChange={handleFinancialScoreChange}
                            disabled={isUpdatingScore}
                          />
                        </div>
                      )}

                      <div className='flex items-center gap-2 text-xs text-gray-500 mt-1'>
                        <span className='bg-gray-100 px-2 py-1 rounded'>
                          {bidData?.financial_doc_s3_name
                            ? "Document uploaded"
                            : "No document"}
                        </span>
                        <span>•</span>
                        <span>
                          {bidData?.created_at
                            ? format(new Date(bidData.created_at), "PPP")
                            : "Unknown date"}
                        </span>
                      </div>
                    </div>

                    <PdfViewerModal
                      value={bidData?.financial_doc_s3_name || null}
                      isS3File={true}
                      triggerButton={
                        <Button
                          variant='default'
                          size='sm'
                          className={cn(secondaryButtonStyle2, "w-full")}
                          disabled={!bidData?.financial_doc_s3_name}>
                          <FileText className='mr-2 h-4 w-4' />
                          View Document
                        </Button>
                      }
                    />
                  </div>
                </div>

                {bidData?.optional_info && (
                  <>
                    <Separator className='my-6' />
                    <div className='bg-amber-50 border border-amber-100 rounded-lg p-4'>
                      <h4 className='text-sm font-semibold text-amber-800 mb-2 flex items-center'>
                        <FileText className='mr-2 h-4 w-4 text-amber-600' />
                        Additional Information
                      </h4>
                      <p className='text-sm text-amber-700'>
                        {bidData?.optional_info}
                      </p>
                    </div>
                  </>
                )}
              </InfoCard>
            </div>

            <div className='space-y-6'>
              <InfoCard title='Vendor Information'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center'>
                    <User className='h-6 w-6 text-accent' />
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-900'>
                      {vendorData?.full_name || "Unknown vendor"}
                    </h4>
                    <p className='text-sm text-gray-500'>
                      Vendor ID:{" "}
                      {vendorData?.id
                        ? vendorData.id.toString().substring(0, 8)
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <Separator className='my-4' />

                <div className='space-y-3'>
                  <DetailItem
                    label='Contact'
                    value={vendorData?.contact_number}
                    icon={<User className='h-4 w-4' />}
                  />
                  <DetailItem
                    label='PAN Number'
                    value={vendorData?.pan_card_number}
                    icon={<CreditCard className='h-4 w-4' />}
                  />
                </div>

                <div className='mt-4'>
                  <PdfViewerModal
                    value={vendorData?.pan_card_doc_s3_name || null}
                    isS3File={true}
                    triggerButton={
                      <Button
                        variant='outline'
                        size='sm'
                        className={cn(secondaryButtonStyle2, "w-full")}>
                        <FileText className='mr-2 h-4 w-4' />
                        View PAN Card
                      </Button>
                    }
                  />
                </div>
              </InfoCard>

              <InfoCard title='Business Information'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center'>
                    <Building className='h-6 w-6 text-accent' />
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-900'>
                      {businessData?.business_name}
                    </h4>
                    <Badge
                      variant='outline'
                      className='mt-1 bg-teal-50 text-teal-700 border-teal-200'>
                      {businessData?.business_classification}
                    </Badge>
                  </div>
                </div>

                <Separator className='my-4' />

                <div className='space-y-3'>
                  <DetailItem
                    label='Reg. Number'
                    value={businessData?.registration_number}
                    icon={<Hash className='h-4 w-4' />}
                  />
                  <DetailItem
                    label='Established'
                    value={businessData?.established_year}
                    icon={<Calendar className='h-4 w-4' />}
                  />
                  <DetailItem
                    label='Location'
                    value={`${businessData?.city}, ${businessData?.country}`}
                    icon={<Home className='h-4 w-4' />}
                  />
                </div>

                <div className='mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100'>
                  <h4 className='text-sm font-semibold text-gray-800 mb-2 flex items-center'>
                    <Home className='mr-2 h-4 w-4 text-gray-600' />
                    Address
                  </h4>
                  <p className='text-sm text-gray-700'>
                    {businessData?.address_line1}, {businessData?.address_line2}
                    ,
                    <br />
                    {businessData?.locality}, {businessData?.city},<br />
                    {businessData?.pin_code}, {businessData?.country}
                  </p>
                </div>

                <div className='mt-4'>
                  <PdfViewerModal
                    value={businessData?.registration_doc_s3_name || null}
                    isS3File={true}
                    triggerButton={
                      <Button
                        variant='outline'
                        size='sm'
                        className={cn(secondaryButtonStyle2, "w-full")}>
                        <FileText className='mr-2 h-4 w-4' />
                        View Registration Doc
                      </Button>
                    }
                  />
                </div>
                {businessData?.msme_certificate_s3_name && (
                  <div className='mt-4'>
                    <PdfViewerModal
                      value={businessData?.msme_certificate_s3_name || null}
                      isS3File={true}
                      triggerButton={
                        <Button
                          variant='outline'
                          size='sm'
                          className={cn(secondaryButtonStyle2, "w-full")}>
                          <FileText className='mr-2 h-4 w-4' />
                          View MSME Certificate
                        </Button>
                      }
                    />
                  </div>
                )}
              </InfoCard>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Dialog */}
      <RejectBidDialog
        handleSelectTemplate={handleSelectTemplate}
        confirmRejectBid={confirmRejectBid}
        isSettingBidStatus={isSettingBidStatus}
        rejectDialog={rejectDialog}
        setRejectDialog={setRejectDialog}
      />

      <BidStatusConfirmDialog
        isOpen={confirmDialog.isOpen}
        onOpenChange={(isOpen) =>
          setConfirmDialog({ ...confirmDialog, isOpen })
        }
        status={confirmDialog.status}
        onConfirm={confirmSetBidStatus}
        isProcessing={isSettingBidStatus}
      />
    </AdminPagesWrapper>
  );
};

export default BidDetails;
