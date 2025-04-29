"use client";
import { FC, useState, useEffect } from "react";
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
import {
  useGetBidByIdQuery,
  useUpdateBidScoreMutation,
  useSetBidStatusMutation,
} from "@/Redux/bid/bidApi";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
import { format } from "date-fns";
import { toast } from "sonner";
import PdfViewerModal from "@/components/Shared/PdfViewerModal";
import { useRouter } from "next/navigation";
import PageLoading from "@/components/Shared/PageLoading";
import BidStatusConfirmDialog from "@/components/Bid/For-Admin/BidStatusConfirmDialog";
import { ApiError } from "@/app/Types";
import { ErrorCodes } from "@/lib/errorCodes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { rejectionTemplates } from "@/lib/constants";
import InfoCard from "@/components/Shared/InfoCard";
import { primaryButtonStyle, secondaryButtonStyle2 } from "@/app/Styles";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";

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

interface Props {
  bidId: string;
}
const BidDetails: FC<Props> = ({ bidId }) => {
  const [technicalScore, setTechnicalScore] = useState<number>(0);
  const [financialScore, setFinancialScore] = useState<number>(0);
  const [previousTechnicalScore, setPreviousTechnicalScore] =
    useState<number>(0);
  const [previousFinancialScore, setPreviousFinancialScore] =
    useState<number>(0);
  const [updateBidScore, { isLoading: isUpdatingScore }] =
    useUpdateBidScoreMutation();
  const [setBidStatus, { isLoading: isSettingBidStatus }] =
    useSetBidStatusMutation();
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    status: string;
  }>({
    isOpen: false,
    status: "",
  });
  const [rejectDialog, setRejectDialog] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });
  // Template rejection messages

  const router = useRouter();
  const {
    user: { role },
  } = useSelector((state: RootState) => state.authSlice);
  const { data, isLoading: isLoadingBid } = useGetBidByIdQuery(bidId);

  useEffect(() => {
    if (data?.bidsDetails) {
      const { bidData } = data.bidsDetails;
      const techScore = Math.min(Math.abs(bidData?.technical_score || 0), 5);
      const finScore = Math.min(Math.abs(bidData?.financial_score || 0), 5);
      setTechnicalScore(techScore);
      setFinancialScore(finScore);
      setPreviousTechnicalScore(techScore);
      setPreviousFinancialScore(finScore);
    }
  }, [data]);

  if (isLoadingBid) {
    return <PageLoading />;
  }

  const { bidData, tenderData, vendorData, businessData } =
    data?.bidsDetails || {};

  const handleTechnicalScoreChange = async (newScore: number) => {
    setPreviousTechnicalScore(technicalScore);
    setTechnicalScore(newScore);
    try {
      await updateBidScore({
        bidId,
        technicalScore: newScore,
        financialScore,
      }).unwrap();
      toast.success("Technical score updated successfully");
    } catch (error) {
      setTechnicalScore(previousTechnicalScore);
      toast.error("Failed to update technical score");
      console.error("Error updating technical score:", error);
    }
  };

  const handleFinancialScoreChange = async (newScore: number) => {
    setPreviousFinancialScore(financialScore);
    setFinancialScore(newScore);
    try {
      await updateBidScore({
        bidId,
        technicalScore,
        financialScore: newScore,
      }).unwrap();
      toast.success("Financial score updated successfully");
    } catch (error) {
      setFinancialScore(previousFinancialScore);
      toast.error("Failed to update financial score");
      console.error("Error updating financial score:", error);
    }
  };

  const handleUpdateStatus = (status: "selected" | "rejected") => {
    if (status === "selected") {
      setConfirmDialog({
        isOpen: true,
        status,
      });
    } else if (status === "rejected") {
      setRejectDialog({
        isOpen: true,
        message: "",
      });
    }
  };

  const confirmSetBidStatus = async () => {
    try {
      await setBidStatus({
        bidId,
        status: confirmDialog.status,
      }).unwrap();
      toast.success(`Bid ${confirmDialog.status.toLowerCase()} successfully`);
      setConfirmDialog({ ...confirmDialog, isOpen: false });
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.data?.errorCode && ErrorCodes[apiError.data.errorCode]) {
        toast.error(ErrorCodes[apiError.data.errorCode]);
      } else {
        toast.error(`Failed to ${confirmDialog.status.toLowerCase()} bid`);
        console.error(
          `Error updating status to ${confirmDialog.status}:`,
          error
        );
      }
      setConfirmDialog({ ...confirmDialog, isOpen: false });
    }
  };

  const handleSelectTemplate = (template: string) => {
    setRejectDialog({ ...rejectDialog, message: template });
  };

  const confirmRejectBid = async () => {
    if (!rejectDialog.message.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    try {
      await setBidStatus({
        bidId,
        status: "rejected",
        message: rejectDialog.message,
      }).unwrap();
      toast.success("Bid rejected successfully");
      setRejectDialog({ ...rejectDialog, isOpen: false });
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.data?.errorCode && ErrorCodes[apiError.data.errorCode]) {
        toast.error(ErrorCodes[apiError.data.errorCode]);
      } else {
        toast.error("Failed to reject bid");
        console.error("Error rejecting bid:", error);
      }
    }
  };

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
                    value={tenderData?.organization}
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
                          {bidData?.technical_doc_url
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
                          {bidData?.financial_doc_url
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
      <Dialog
        open={rejectDialog.isOpen}
        onOpenChange={(isOpen) => setRejectDialog({ ...rejectDialog, isOpen })}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Reject Bid</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this bid. This message will
              be visible to the vendor.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <p className='text-sm font-medium'>Select a template message</p>
              <Select onValueChange={handleSelectTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder='Choose a template' />
                </SelectTrigger>
                <SelectContent>
                  {rejectionTemplates.map((template, index) => (
                    <SelectItem
                      key={index}
                      value={template}>
                      {template.length > 50
                        ? `${template.substring(0, 50)}...`
                        : template}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <p className='text-sm font-medium'>Rejection message</p>
              <Textarea
                placeholder='Explain why this bid is being rejected...'
                value={rejectDialog.message}
                onChange={(e) =>
                  setRejectDialog({ ...rejectDialog, message: e.target.value })
                }
                rows={4}
                className='resize-none'
              />
            </div>
          </div>

          <DialogFooter className='sm:justify-between'>
            <Button
              type='button'
              variant='outline'
              onClick={() =>
                setRejectDialog({ ...rejectDialog, isOpen: false })
              }>
              Cancel
            </Button>
            <Button
              type='button'
              variant='destructive'
              className='gap-1'
              onClick={confirmRejectBid}
              disabled={isSettingBidStatus || !rejectDialog.message.trim()}>
              <ThumbsDown className='h-4 w-4' />
              {isSettingBidStatus ? "Processing..." : "Reject Bid"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
