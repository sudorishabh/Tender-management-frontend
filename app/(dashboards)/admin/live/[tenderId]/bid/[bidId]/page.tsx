"use client";
import React, { use, useState } from "react";
import { trpc } from "@/lib/trpc";
import AdminBidDetailsSkeleton from "@/components/Shared/skeleton/AdminBidDetailsSkeleton";
import {
  FileText,
  Building,
  Hash,
  CreditCard,
  Calendar,
  Home,
  Mail,
  Phone,
  Globe,
  Users,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  Lock,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import DashboardWrapper from "@/components/DashboardWrapper";
import PdfViewerModal from "@/components/Shared/PdfViewerModal";
import InfoCard from "@/components/Shared/InfoCard";
import { primaryButtonStyle, secondaryButtonStyle2 } from "@/app/styles";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatDisplayDateTime, formatDisplayDate } from "@/utils/dateUtils";

interface DetailItemProps {
  label: string;
  value: string | null | undefined;
  className?: string;
  icon?: React.ReactNode;
}

const DetailItem = ({ label, value, className, icon }: DetailItemProps) => {
  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      {icon && <div className='mt-0.5 text-gray-400'>{icon}</div>}
      <div className='flex-1 min-w-0'>
        <p className='text-xs font-medium text-gray-500 mb-0.5'>{label}</p>
        <p className='text-sm font-medium break-words text-gray-900'>
          {value || "—"}
        </p>
      </div>
    </div>
  );
};

const BidDetailsPage = ({ params }: { params: Promise<{ bidId: string }> }) => {
  const resolvedParams = use(params);
  const { bidId } = resolvedParams;

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);

  const { data, isLoading, refetch } = trpc.bid.getById.useQuery(bidId);

  const approveMutation = trpc.bid.approve.useMutation({
    onSuccess: () => {
      toast.success("Bid approved successfully!", {
        description:
          "Other bids for this tender have been automatically rejected.",
      });
      refetch();
      setApproveDialogOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to approve bid", {
        description: error.message,
      });
    },
  });

  const bidData = data?.bid;
  const tenderData = data?.tender;
  const vendorData = data?.vendor;
  const businessData = data?.business;
  const vendorDocuments = data?.vendorDocuments || [];
  const documentVisibility = data?.documentVisibility;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "under_review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "selected":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "ranked":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatStatus = (status: string) => {
    return status
      ?.split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleApproveBid = () => {
    approveMutation.mutate({ bidId });
  };

  const isAlreadyApproved = bidData?.bid_status === "approved";
  const isRejected = bidData?.bid_status === "rejected";

  if (isLoading) {
    return (
      <DashboardWrapper
        title='Bid Details'
        description='View the details of this bid.'
        showBackButton={true}>
        <AdminBidDetailsSkeleton />
      </DashboardWrapper>
    );
  }

  return (
    <DashboardWrapper
      title='Bid Details'
      description='Comprehensive view of bid submission and vendor information'
      showBackButton={true}>
      {/* Approve Bid Confirmation Dialog */}
      <Dialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <CheckCircle className='h-5 w-5 text-green-600' />
              Approve Bid
            </DialogTitle>
            <div className='flex w-full items-start mb-2 gap-2 mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200'>
              <AlertTriangle className='h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0' />
              <div className='text-sm text-amber-800'>
                <span className='font-semibold'>Important:</span> Approving this
                bid will automatically reject all other bids submitted for this
                tender.
              </div>
            </div>
            <DialogDescription className='text-sm text-gray-700 pt-2'>
              Are you sure you want to approve the bid from{" "}
              <span className='font-semibold'>
                {businessData?.biz_legal_name || "this vendor"}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2'>
            <Button
              variant='outline'
              className='rounded-md'
              onClick={() => setApproveDialogOpen(false)}
              disabled={approveMutation.isPending}>
              Cancel
            </Button>
            <Button
              onClick={handleApproveBid}
              disabled={approveMutation.isPending}
              className={cn(
                primaryButtonStyle,
                "bg-green-600 hover:bg-green-700"
              )}>
              {approveMutation.isPending ? "Approving..." : "Approve Bid"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className='space-y-5'>
        {/* Enhanced Header Card - Bid Summary */}
        <div className='bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border border-primary/10 rounded-xl p-5 shadow-sm'>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex items-start gap-4 flex-1'>
              <div className='h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary flex-shrink-0 shadow-md shadow-primary/20'>
                <FileText className='h-6 w-6 text-primary' />
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-3 mb-1'>
                  <h2 className='text-lg font-bold text-gray-900 leading-tight'>
                    {tenderData?.tender_title}
                  </h2>
                  {bidData?.bid_status && (
                    <Badge
                      className={cn(
                        "text-xs",
                        getStatusColor(bidData.bid_status)
                      )}>
                      {formatStatus(bidData.bid_status)}
                    </Badge>
                  )}
                </div>
                {tenderData?.tender_department && (
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <Building className='h-3.5 w-3.5' />
                    <span>{tenderData.tender_department}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Approve Bid Button */}
            {!isAlreadyApproved && !isRejected && (
              <Button
                onClick={() => setApproveDialogOpen(true)}
                className={cn(
                  primaryButtonStyle,
                  "bg-green-600 hover:bg-green-700 flex items-center gap-2"
                )}>
                <CheckCircle className='h-4 w-4' />
                Approve Bid
              </Button>
            )}
            {isAlreadyApproved && (
              <div className='flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-md'>
                <CheckCircle className='h-4 w-4' />
                <span className='text-sm font-medium'>Bid Approved</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-5'>
          {/* Left Column - Main Content */}
          <div className='lg:col-span-8 space-y-5'>
            {/* Tender Information */}
            <InfoCard title='Tender Information'>
              {tenderData?.tender_description && (
                <div className='mb-4 pb-4 border-b'>
                  <p className='text-sm text-gray-700 leading-relaxed'>
                    {tenderData.tender_description}
                  </p>
                </div>
              )}

              {bidData?.bid_optional_info && (
                <div className='bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-4'>
                  <div className='flex items-start gap-3'>
                    <div className='h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0'>
                      <FileText className='h-4 w-4 text-amber-700' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-sm font-semibold text-amber-900 mb-1.5'>
                        Additional Bid Information
                      </h4>
                      <p className='text-sm text-amber-800 leading-relaxed'>
                        {bidData.bid_optional_info}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </InfoCard>

            {/* Documents Section - Combined */}
            <InfoCard title='Documents'>
              {/* Document Visibility Timeline Info */}
              {documentVisibility && (
                <div className='mb-5 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                  <h4 className='text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2'>
                    <Clock className='h-4 w-4' />
                    Document Visibility Timeline
                  </h4>
                  <div className='grid grid-cols-1 gap-2 text-sm'>
                    <div
                      className={`flex items-center gap-2 ${
                        documentVisibility.canShowTechnicalDoc
                          ? "text-green-700"
                          : "text-gray-500"
                      }`}>
                      <div
                        className={`h-2 w-2 rounded-full ${
                          documentVisibility.canShowTechnicalDoc
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      />
                      <span>
                        Technical Document:{" "}
                        {documentVisibility.canShowTechnicalDoc
                          ? "Available"
                          : `Opens on ${
                              documentVisibility.technicalBidOpeningDate
                                ? formatDisplayDateTime(
                                    documentVisibility.technicalBidOpeningDate
                                  )
                                : "N/A"
                            }`}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-2 ${
                        documentVisibility.canShowFinancialDoc
                          ? "text-green-700"
                          : "text-gray-500"
                      }`}>
                      <div
                        className={`h-2 w-2 rounded-full ${
                          documentVisibility.canShowFinancialDoc
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      />
                      <span>
                        Financial Document:{" "}
                        {documentVisibility.canShowFinancialDoc
                          ? "Available"
                          : `Opens on ${
                              documentVisibility.financialBidOpeningDate
                                ? formatDisplayDateTime(
                                    documentVisibility.financialBidOpeningDate
                                  )
                                : "N/A"
                            }`}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bid Documents */}
              <div className='mb-5'>
                <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2'>
                  <div className='h-1 w-1 rounded-full bg-primary' />
                  Bid Submissions
                </h4>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  {/* Document Fee Receipt */}
                  {tenderData?.tender_doc_fee && (
                    <PdfViewerModal
                      value={tenderData.tender_doc_fee}
                      isS3File={true}
                      triggerButton={
                        <Button
                          variant='outline'
                          size='sm'
                          className={cn(
                            secondaryButtonStyle2,
                            "w-full h-auto py-3 hover:shadow-md transition-all bg-purple-50 border-purple-200 hover:bg-purple-100"
                          )}>
                          <FileText className='mr-2 h-4 w-4 text-purple-600' />
                          <span className='text-xs font-medium'>
                            Document Fee Receipt
                          </span>
                        </Button>
                      }
                    />
                  )}

                  {/* Bid Fee Document */}
                  {bidData?.bid_fee_doc_key && (
                    <PdfViewerModal
                      value={bidData.bid_fee_doc_key}
                      isS3File={true}
                      triggerButton={
                        <Button
                          variant='outline'
                          size='sm'
                          className={cn(
                            secondaryButtonStyle2,
                            "w-full h-auto py-3 hover:shadow-md transition-all bg-green-50 border-green-200 hover:bg-green-100"
                          )}>
                          <IndianRupee className='mr-2 h-4 w-4 text-green-600' />
                          <span className='text-xs font-medium'>
                            Bid Fee Receipt
                          </span>
                        </Button>
                      }
                    />
                  )}

                  {/* Technical Document */}
                  {bidData?.technical_doc_key ? (
                    <PdfViewerModal
                      value={bidData.technical_doc_key}
                      isS3File={true}
                      triggerButton={
                        <Button
                          variant='outline'
                          size='sm'
                          className={cn(
                            secondaryButtonStyle2,
                            "w-full h-auto py-3 hover:shadow-md transition-all"
                          )}>
                          <FileText className='mr-2 h-4 w-4' />
                          <span className='text-xs font-medium'>
                            Technical Document
                          </span>
                        </Button>
                      }
                    />
                  ) : documentVisibility &&
                    !documentVisibility.canShowTechnicalDoc ? (
                    <div className='flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md'>
                      <Lock className='h-4 w-4 text-amber-600' />
                      <span className='text-xs text-amber-700 font-medium'>
                        Technical Doc locked until{" "}
                        {documentVisibility.technicalBidOpeningDate
                          ? formatDisplayDate(
                              documentVisibility.technicalBidOpeningDate
                            )
                          : "opening date"}
                      </span>
                    </div>
                  ) : null}

                  {/* Financial Document */}
                  {bidData?.financial_doc_key ? (
                    <PdfViewerModal
                      value={bidData.financial_doc_key}
                      isS3File={true}
                      triggerButton={
                        <Button
                          variant='outline'
                          size='sm'
                          className={cn(
                            secondaryButtonStyle2,
                            "w-full h-auto py-3 hover:shadow-md transition-all"
                          )}>
                          <FileText className='mr-2 h-4 w-4' />
                          <span className='text-xs font-medium'>
                            Financial Document
                          </span>
                        </Button>
                      }
                    />
                  ) : documentVisibility &&
                    !documentVisibility.canShowFinancialDoc ? (
                    <div className='flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md'>
                      <Lock className='h-4 w-4 text-amber-600' />
                      <span className='text-xs text-amber-700 font-medium'>
                        Financial Doc locked until{" "}
                        {documentVisibility.financialBidOpeningDate
                          ? formatDisplayDate(
                              documentVisibility.financialBidOpeningDate
                            )
                          : "opening date"}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Vendor Requirement Documents */}
              {vendorDocuments.length > 0 && (
                <div className='mb-5'>
                  <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2'>
                    <div className='h-1 w-1 rounded-full bg-blue-500' />
                    Vendor Requirements
                  </h4>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {vendorDocuments.map(
                      (doc: {
                        bvd_id: number;
                        bvd_doc_key: string;
                        bvd_doc_name: string | null;
                      }) => (
                        <PdfViewerModal
                          key={doc.bvd_id}
                          value={doc.bvd_doc_key}
                          isS3File={true}
                          triggerButton={
                            <Button
                              variant='outline'
                              size='sm'
                              className={cn(
                                secondaryButtonStyle2,
                                "w-full h-auto py-3 hover:shadow-md transition-all"
                              )}>
                              <FileText className='mr-2 h-4 w-4' />
                              <span className='text-xs truncate font-medium'>
                                {doc.bvd_doc_name || "Document"}
                              </span>
                            </Button>
                          }
                        />
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Business Documents */}
              {(businessData?.biz_reg_doc_key ||
                businessData?.biz_gst_doc_key ||
                businessData?.biz_bank_doc_key ||
                businessData?.biz_msme_cert_doc_key ||
                vendorData?.vendor_pan_doc_key) && (
                <div>
                  <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2'>
                    <div className='h-1 w-1 rounded-full bg-teal-500' />
                    Business & Compliance
                  </h4>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {businessData?.biz_reg_doc_key && (
                      <PdfViewerModal
                        value={businessData.biz_reg_doc_key}
                        isS3File={true}
                        triggerButton={
                          <Button
                            variant='outline'
                            size='sm'
                            className={cn(
                              secondaryButtonStyle2,
                              "w-full h-auto py-3 hover:shadow-md transition-all"
                            )}>
                            <FileText className='mr-2 h-4 w-4' />
                            <span className='text-xs font-medium'>
                              Registration
                            </span>
                          </Button>
                        }
                      />
                    )}
                    {businessData?.biz_gst_doc_key && (
                      <PdfViewerModal
                        value={businessData.biz_gst_doc_key}
                        isS3File={true}
                        triggerButton={
                          <Button
                            variant='outline'
                            size='sm'
                            className={cn(
                              secondaryButtonStyle2,
                              "w-full h-auto py-3 hover:shadow-md transition-all"
                            )}>
                            <FileText className='mr-2 h-4 w-4' />
                            <span className='text-xs font-medium'>GST</span>
                          </Button>
                        }
                      />
                    )}
                    {businessData?.biz_bank_doc_key && (
                      <PdfViewerModal
                        value={businessData.biz_bank_doc_key}
                        isS3File={true}
                        triggerButton={
                          <Button
                            variant='outline'
                            size='sm'
                            className={cn(
                              secondaryButtonStyle2,
                              "w-full h-auto py-3 hover:shadow-md transition-all"
                            )}>
                            <FileText className='mr-2 h-4 w-4' />
                            <span className='text-xs font-medium'>
                              Bank Details
                            </span>
                          </Button>
                        }
                      />
                    )}
                    {businessData?.biz_msme_cert_doc_key && (
                      <PdfViewerModal
                        value={businessData.biz_msme_cert_doc_key}
                        isS3File={true}
                        triggerButton={
                          <Button
                            variant='outline'
                            size='sm'
                            className={cn(
                              secondaryButtonStyle2,
                              "w-full h-auto py-3 hover:shadow-md transition-all"
                            )}>
                            <FileText className='mr-2 h-4 w-4' />
                            <span className='text-xs font-medium'>
                              MSME Certificate
                            </span>
                          </Button>
                        }
                      />
                    )}
                    {vendorData?.vendor_pan_doc_key && (
                      <PdfViewerModal
                        value={vendorData.vendor_pan_doc_key}
                        isS3File={true}
                        triggerButton={
                          <Button
                            variant='outline'
                            size='sm'
                            className={cn(
                              secondaryButtonStyle2,
                              "w-full h-auto py-3 hover:shadow-md transition-all"
                            )}>
                            <FileText className='mr-2 h-4 w-4' />
                            <span className='text-xs font-medium'>
                              PAN Card
                            </span>
                          </Button>
                        }
                      />
                    )}
                  </div>
                </div>
              )}

              {!bidData?.technical_doc_key &&
                !bidData?.financial_doc_key &&
                vendorDocuments.length === 0 &&
                !businessData?.biz_reg_doc_key &&
                !businessData?.biz_gst_doc_key &&
                !businessData?.biz_bank_doc_key &&
                !businessData?.biz_msme_cert_doc_key &&
                !vendorData?.vendor_pan_doc_key && (
                  <div className='text-center py-8'>
                    <FileText className='h-12 w-12 text-gray-300 mx-auto mb-3' />
                    <p className='text-sm text-gray-500'>
                      No documents available
                    </p>
                  </div>
                )}
            </InfoCard>
          </div>

          {/* Right Column - Vendor & Business Info */}
          <div className='lg:col-span-4 space-y-5'>
            {/* Vendor Information */}
            <InfoCard title='Vendor Information'>
              <div className='space-y-2.5'>
                <DetailItem
                  label='Contact'
                  value={vendorData?.vendor_contact}
                  icon={<Phone className='h-3.5 w-3.5' />}
                />
                <DetailItem
                  label='PAN Number'
                  value={vendorData?.vendor_pan_number}
                  icon={<CreditCard className='h-3.5 w-3.5' />}
                />
              </div>
            </InfoCard>

            {/* Business Information */}
            <InfoCard title='Business Information'>
              <div className='space-y-2.5'>
                <DetailItem
                  label='Legal Name'
                  value={businessData?.biz_legal_name}
                  icon={<Building className='h-3.5 w-3.5' />}
                />
                {businessData?.biz_trade_name && (
                  <DetailItem
                    label='Trade Name'
                    value={businessData.biz_trade_name}
                    icon={<Building className='h-3.5 w-3.5' />}
                  />
                )}
                {businessData?.biz_classification && (
                  <DetailItem
                    label='Classification'
                    value={businessData.biz_classification}
                    icon={<Hash className='h-3.5 w-3.5' />}
                  />
                )}
                <DetailItem
                  label='Registration'
                  value={businessData?.biz_reg_number}
                  icon={<Hash className='h-3.5 w-3.5' />}
                />
                <DetailItem
                  label='GST'
                  value={businessData?.biz_gst_number}
                  icon={<Hash className='h-3.5 w-3.5' />}
                />
                <DetailItem
                  label='Established'
                  value={businessData?.biz_established_year}
                  icon={<Calendar className='h-3.5 w-3.5' />}
                />
                <DetailItem
                  label='Location'
                  value={`${businessData?.biz_city}${
                    businessData?.biz_state ? ", " + businessData.biz_state : ""
                  }, ${businessData?.biz_country}`}
                  icon={<Home className='h-3.5 w-3.5' />}
                />
              </div>
            </InfoCard>

            {/* Contact Details */}
            <InfoCard title='Contact'>
              <div className='space-y-2.5'>
                {businessData?.biz_email && (
                  <DetailItem
                    label='Email'
                    value={businessData.biz_email}
                    icon={<Mail className='h-3.5 w-3.5' />}
                  />
                )}
                {businessData?.biz_phone && (
                  <DetailItem
                    label='Phone'
                    value={businessData.biz_phone}
                    icon={<Phone className='h-3.5 w-3.5' />}
                  />
                )}
                {businessData?.biz_website && (
                  <DetailItem
                    label='Website'
                    value={businessData.biz_website}
                    icon={<Globe className='h-3.5 w-3.5' />}
                  />
                )}
              </div>

              {businessData?.biz_addr_line1 && (
                <>
                  <Separator className='my-4' />
                  <div className='bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-3 border border-gray-100'>
                    <h4 className='text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5'>
                      <Home className='h-3 w-3' />
                      Address
                    </h4>
                    <p className='text-xs text-gray-700 leading-relaxed'>
                      {businessData.biz_addr_line1}
                      {businessData.biz_addr_line2 &&
                        `, ${businessData.biz_addr_line2}`}
                      <br />
                      {businessData.biz_locality &&
                        `${businessData.biz_locality}, `}
                      {businessData.biz_city}
                      <br />
                      {businessData.biz_pin_code}, {businessData.biz_country}
                    </p>
                  </div>
                </>
              )}
            </InfoCard>

            {/* Business Metrics */}
            {(businessData?.biz_3_year_turnover ||
              businessData?.biz_employee_count) && (
              <InfoCard title='Metrics'>
                <div className='space-y-2.5'>
                  {businessData?.biz_3_year_turnover && (
                    <DetailItem
                      label='3-Year Turnover'
                      value={businessData.biz_3_year_turnover}
                      icon={<TrendingUp className='h-3.5 w-3.5' />}
                    />
                  )}
                  {businessData?.biz_employee_count && (
                    <DetailItem
                      label='Employees'
                      value={businessData.biz_employee_count.toString()}
                      icon={<Users className='h-3.5 w-3.5' />}
                    />
                  )}
                </div>
              </InfoCard>
            )}
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default BidDetailsPage;
