import React, { useMemo } from "react";
import { ITenderFormSteps } from "@/_types/tender/createTender.type";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
// icons removed for compact preview (no icons shown)
import CustomButton from "@/_components/Shared/CustomButton";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

const safeCap = (v: string | number) => {
  if (typeof v !== "string") return v;
  // don't modify emails or strings containing digits (numbers/currencies)
  if (/@|\d/.test(v)) return v;
  return capitalizeFirstLetter(v);
};

// Validation helper function
const getValidationIssues = (data: ITenderFormSteps): string[] => {
  const issues: string[] = [];
  const { step1, step3 } = data;

  // Check required fields
  if (!step1.tender_title?.trim()) issues.push("Tender Title");
  if (!step1.tender_department?.trim()) issues.push("Department");
  if (!step1.tender_type) issues.push("Tender Type");
  if (!step1.tender_scope) issues.push("Tender Scope");
  if (!step1.tender_description?.trim()) issues.push("Description");
  if (!step1.tender_location?.trim()) issues.push("Location");

  const docFee = Number(step1.tender_doc_fee);
  if (!step1.tender_doc_fee || isNaN(docFee) || docFee <= 0) {
    issues.push("Document Fee");
  }

  const emd = Number(step1.tender_emd);
  if (!step1.tender_emd || isNaN(emd) || emd <= 0) {
    issues.push("EMD");
  }

  // Check dates
  if (!step3.tender_release_date) issues.push("Release Date");
  if (!step3.tender_query_deadline) issues.push("Query Deadline");
  if (!step3.tender_query_response_date) issues.push("Query Response Date");
  if (!step3.tender_bid_submission_deadline)
    issues.push("Bid Submission Deadline");
  if (!step3.tender_technical_bid_opening)
    issues.push("Technical Bid Opening");
  if (!step3.tender_financial_bid_opening)
    issues.push("Financial Bid Opening");

  return issues;
};

interface Props {
  isPreviewData: ITenderFormSteps;
  isLoading: boolean;
  setActive: (active: number) => void;
}

const CreateTenderPreview: React.FC<Props> = ({
  isPreviewData,
  setActive,
  isLoading,
}) => {
  const previewData = useMemo<ITenderFormSteps>(() => {
    return {
      step1: { ...isPreviewData.step1 },
      step2: Array.isArray(isPreviewData.step2) ? isPreviewData.step2 : [],
      step3: { ...isPreviewData.step3 },
    } as ITenderFormSteps;
  }, [isPreviewData]);

  // Calculate validation issues
  const validationIssues = useMemo(
    () => getValidationIssues(previewData),
    [previewData]
  );



  const vendorDocs = previewData.step2 as Array<{
    vdr_name?: string;
    name?: string;
    document_name?: string;
    label?: string;
  } | string>;

  return (
    <Card className='w-full'>
      <CardHeader className='pb-6'>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <CardTitle className='text-lg'>Review & Submit</CardTitle>
            <p className='text-xs text-muted-foreground mt-1'>
              Review all tender details before submitting for approval
            </p>
          </div>
          <Button
            type='button'
            variant='outline'
            onClick={() => setActive(0)}>
            Edit Details
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Validation Summary */}
        {validationIssues.length > 0 && (
          <div className='mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg'>
            <div className='flex items-start gap-3'>
              <div className='flex-shrink-0 w-5 h-5 mt-0.5 text-destructive'>
                ⚠️
              </div>
              <div className='flex-1'>
                <h4 className='text-sm font-semibold text-destructive mb-2'>
                  Cannot Submit - Missing Required Fields ({validationIssues.length})
                </h4>
                <p className='text-xs text-muted-foreground mb-3'>
                  Please complete the following fields before submitting:
                </p>
                <div className='flex flex-wrap gap-2'>
                  {validationIssues.slice(0, 10).map((issue, idx) => (
                    <Badge key={idx} variant='destructive' className='text-xs'>
                      {issue}
                    </Badge>
                  ))}
                  {validationIssues.length > 10 && (
                    <Badge variant='outline' className='text-xs'>
                      +{validationIssues.length - 10} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='space-y-8'>
          {/* Primary Information */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold border-l-4 border-primary pl-3'>
              Primary Information
            </h3>

            <div className='grid gap-4'>
              {/* Title - Full Width */}
              <div className='p-3 rounded-lg border bg-card'>
                <div className='flex items-start gap-3'>
                  {/* <FileText className='h-5 w-5 text-muted-foreground mt-0.5' /> */}
                  <div className='flex-1 min-w-0'>
                    <div className='text-xs font-medium text-gray-600 mb-1'>
                      Tender Title
                    </div>
                    <div className='text-sm font-semibold'>
                      {safeCap(previewData.step1.tender_title) ||
                        "Not provided"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid Items */}
              <div className='grid md:grid-cols-2 gap-3'>
                <InfoCard
                  label='Type'
                  value={previewData.step1.tender_type || "Not provided"}
                />
                <InfoCard
                  label='Scope'
                  value={previewData.step1.tender_scope || "Not provided"}
                />
                <InfoCard
                  label='Location'
                  value={previewData.step1.tender_location || "Not provided"}
                />
              </div>

              {/* Description */}
              <div className='p-3 rounded-lg border bg-card'>
                <p className='text-xs text-muted-foreground'>
                  No vendor document requirements added
                </p>
                <div className='whitespace-pre-wrap text-xs leading-snug'>
                  {previewData.step1.tender_description || "Not provided"}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Vendor Document Requirements */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-sm font-semibold border-l-4 border-primary pl-3'>
                Vendor Document Requirements
              </h3>
              <Badge variant='outline'>
                {vendorDocs?.length || 0}{" "}
                {vendorDocs?.length === 1 ? "Document" : "Documents"}
              </Badge>
            </div>

            {/* Show selected standard document types as badges */}
            {(previewData.step1.tender_is_technical_doc ||
              previewData.step1.tender_is_financial_doc) && (
                <div className='flex items-center gap-2'>
                  {previewData.step1.tender_is_technical_doc && (
                    <span className='px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full'>
                      Technical Document
                    </span>
                  )}
                  {previewData.step1.tender_is_financial_doc && (
                    <span className='px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full'>
                      Financial Document
                    </span>
                  )}
                </div>
              )}

            {vendorDocs && vendorDocs.length ? (
              <div className='text-xs grid gap-3'>
                {vendorDocs.map((d, idx) => {
                  const rawName =
                    (typeof d === "object" && d !== null && (d.vdr_name || d.name || d.document_name || d.label)) ||
                    (typeof d === "string" ? d : undefined) ||
                    "Untitled Document";
                  const name = safeCap(rawName);

                  return (
                    <div
                      key={idx}
                      className='p-3 rounded-lg border bg-card hover:transition-colors'>
                      <div className='flex items-start gap-3'>
                        <div className='flex-1 min-w-0'>
                          <div className='font-medium mb-1'>{name}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className='p-4 text-center rounded-lg border border-dashed bg-muted/20'>
                <p className='text-xs text-muted-foreground'>
                  No vendor document requirements added
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Key Dates */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold border-l-4 border-primary pl-3'>
              Key Dates
            </h3>

            <div className='grid md:grid-cols-2 gap-3'>
              <DateCard
                label='Release of Tender'
                value={previewData.step3.tender_release_date}
              />
              <DateCard
                label='Query Submission Deadline'
                value={previewData.step3.tender_query_deadline}
              />
              <DateCard
                label='Query Response Date'
                value={previewData.step3.tender_query_response_date}
              />
              <DateCard
                label='Bid Submission Deadline'
                value={previewData.step3.tender_bid_submission_deadline}
                includeTime
              />
              <DateCard
                label='Technical Bid Opening'
                value={previewData.step3.tender_technical_bid_opening}
                includeTime
              />
              <DateCard
                label='Financial Bid Opening'
                value={previewData.step3.tender_financial_bid_opening}
                includeTime
              />
            </div>

            {/* Venue and Project Duration */}
            <div className='grid md:grid-cols-2 gap-3 mt-4'>
              <div className='p-3 rounded-lg border bg-card'>
                <div className='flex items-start gap-3'>
                  <div className='flex-1 min-w-0'>
                    <div className='text-xs font-medium text-muted-foreground mb-1'>
                      Bid Opening Venue
                    </div>
                    <div className='text-xs whitespace-pre-wrap'>
                      {safeCap(previewData.step1.tender_opening_venue) ||
                        "Not specified"}
                    </div>
                  </div>
                </div>
              </div>
              <div className='p-3 rounded-lg border bg-card'>
                <div className='flex items-start gap-3'>
                  <div className='flex-1 min-w-0'>
                    <div className='text-xs font-medium text-muted-foreground mb-1'>
                      Project Timeframe
                    </div>
                    <div className='text-xs font-semibold'>
                      {safeCap(previewData.step1.tender_project_duration) ||
                        "Not specified"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Fees & EMD */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold border-l-4 border-primary pl-3'>
              Fees & EMD
            </h3>

            <div className='grid md:grid-cols-2 gap-3'>
              <FeeCard
                label='Document Fee'
                value={previewData.step1.tender_doc_fee || "Not specified"}
              />
              <FeeCard
                label='EMD Amount'
                value={previewData.step1.tender_emd || "Not specified"}
              />
            </div>
          </div>

          <Separator />

          {/* Email Invitations (for Limited Tenders) */}
          {previewData.step1.tender_type?.toLowerCase() === "limited" &&
            previewData.step1.invited_emails &&
            previewData.step1.invited_emails.length > 0 && (
              <>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-sm font-semibold border-l-4 border-primary pl-3'>
                      Email Invitations
                    </h3>
                    <Badge variant='outline'>
                      {previewData.step1.invited_emails.length}{" "}
                      {previewData.step1.invited_emails.length === 1
                        ? "Vendor"
                        : "Vendors"}{" "}
                      Invited
                    </Badge>
                  </div>

                  <div className='grid gap-2'>
                    {previewData.step1.invited_emails.map((email, idx) => (
                      <div
                        key={idx}
                        className='p-3 rounded-lg border bg-card'>
                        <div className='flex items-center gap-3'>
                          <div className='text-sm font-medium'>{email}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className='p-3 rounded-lg border border-blue-200 bg-blue-50/50'>
                    <p className='text-xs text-blue-800'>
                      <strong>Note:</strong> Email invitations will be sent to
                      these vendors once the tender is published by a super
                      admin.
                    </p>
                  </div>
                </div>

                <Separator />
              </>
            )}

          {/* Submit Button */}
          <div className='pt-4 border-t'>
            <div className='flex items-center justify-center flex-col space-y-4'>
              <div className='text-center'>
                <h4 className='text-sm font-semibold mb-1'>Ready to Submit?</h4>

                <p className='text-xs text-muted-foreground'>
                  Once submitted, this tender will be sent for review before
                  being published
                </p>
              </div>
              <CustomButton
                btnName={
                  validationIssues.length > 0
                    ? `Complete ${validationIssues.length} Required Field${validationIssues.length > 1 ? "s" : ""
                    } to Submit`
                    : isLoading
                      ? "Submitting..."
                      : "Submit for Review"
                }
                variant='primary'
                type='submit'
                disabled={isLoading || validationIssues.length > 0}
                className='px-4'
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper Components
const InfoCard = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className='p-3 rounded-lg border bg-card'>
    <div className='mb-1.5'>
      <div className='text-xs font-medium text-gray-600'>{label}</div>
    </div>
    <div className='text-xs font-semibold'>
      {typeof value === "string" ? safeCap(value) : value}
    </div>
  </div>
);

const DateCard = ({
  label,
  value,
  includeTime = false,
}: {
  label: string;
  value: Date | string | null | undefined;
  includeTime?: boolean;
}) => {
  const formatForCard = (
    val: Date | string | null | undefined,
    showTime = false
  ) => {
    if (!val) return "Not set";
    const d = typeof val === "string" ? new Date(val) : val;
    if (Number.isNaN(d.getTime())) return "Not set";
    if (showTime) {
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className='p-3 rounded-lg border bg-card'>
      <div className='mb-1.5'>
        <div className='text-xs font-medium text-gray-600'>{label}</div>
      </div>
      <div className='text-xs font-semibold'>
        {formatForCard(value, includeTime)}
      </div>
    </div>
  );
};

const FeeCard = ({ label, value }: { label: string; value: string }) => (
  <div className='p-3 rounded-lg border bg-card'>
    <div className='mb-2'>
      <div className='text-xs font-medium text-gray-600'>{label}</div>
    </div>
    <div className='text-sm font-semibold mb-1'>
      {typeof value === "string" ? safeCap(value) : value}
    </div>
  </div>
);

export default CreateTenderPreview;
