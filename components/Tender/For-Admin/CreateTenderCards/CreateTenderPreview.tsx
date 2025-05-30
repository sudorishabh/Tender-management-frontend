import {
  IItemInfo,
  IKeyDate,
  ITenderFeeDetails,
  ITenderPreQualification,
  ITenderSupportDocument,
  IVendorDocRequirement,
} from "@/Types/Tender-Types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ClipboardList,
  ClipboardType,
  CoinsIcon,
  FileText,
  HelpCircle,
  Info,
  Loader2,
  Paperclip,
  Trophy,
  Sparkles,
  BookOpen,
  Building,
  Tag,
  Hash,
  CalendarClock,
  Award,
} from "lucide-react";
import React, { FC, memo, ReactNode, useState } from "react";
import { borderStyle, secondaryButtonStyle } from "@/app/Styles";
import { cn } from "@/lib/utils";

interface Props {
  isPreviewData: {
    itemInfo: IItemInfo;
    keyDates: IKeyDate;
    tenderFeeDetails: ITenderFeeDetails;
    tenderSupportDocuments: ITenderSupportDocument[];
    vendorDocRequirement: IVendorDocRequirement[];
    tenderPreQualifications: ITenderPreQualification[];
  };
  isLoading: boolean;
  setActive: (active: number) => void;
}

const MissingFieldIndicator: FC = memo(() => (
  <div className='flex items-center gap-2 text-red-500 font-medium text-xs mt-1.5 animate-pulse'>
    <span className='h-1.5 w-1.5 rounded-full bg-red-500'></span>
    <span>This field is required</span>
  </div>
));

MissingFieldIndicator.displayName = "MissingFieldIndicator";

// Define a union type that includes all possible value types from your data
type ValueType =
  | string
  | number
  | boolean
  | Date
  | File
  | Record<string, unknown>
  | null
  | undefined
  | ITenderSupportDocument
  | IVendorDocRequirement
  | ITenderPreQualification;

const CreateTenderPreview: FC<Props> = ({
  isPreviewData,
  setActive,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<string>("general");

  const camelToWords = (str: string): string => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const isValueMissing = (value: ValueType): boolean => {
    return !value || (typeof value === "string" && value === "NaN");
  };

  const renderValueAsString = (value: ValueType): string => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (value instanceof File) {
      return value.name;
    }
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return String(value || "");
  };

  const getOrdinalSuffix = (index: number): string => {
    if (index === 0) return "1st";
    if (index === 1) return "2nd";
    if (index === 2) return "3rd";
    return `${index + 1}th`;
  };

  const renderValue = (value: ValueType): ReactNode => {
    if (value instanceof File) {
      return (
        <div className='flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-md border border-blue-100 text-blue-700 hover:bg-blue-100 transition-colors'>
          <Paperclip size={16} />
          <span className='font-medium'>{value.name}</span>
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <ul className='space-y-2'>
          {value.map((item, index) => (
            <li
              key={index}
              className='bg-gray-50 rounded-md p-3 border border-gray-100'>
              {renderValue(item as ValueType)}
            </li>
          ))}
        </ul>
      );
    }

    if (typeof value === "object" && value !== null) {
      return (
        <div className='space-y-3'>
          {Object.entries(value).map(([key, val]) => (
            <div
              key={key}
              className='bg-gray-50 rounded-md p-3 border-l-2 border-gray-200'>
              <span className='text-xs uppercase tracking-wider text-gray-500 font-medium block mb-1.5'>
                {camelToWords(key)}
              </span>
              {isValueMissing(val as ValueType) ? (
                <span className='text-gray-400 text-sm italic'>
                  Not specified
                </span>
              ) : (
                <div className='font-medium text-gray-800'>
                  {renderValue(val as ValueType)}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (typeof value === "string" && value === "NaN") {
      return (
        <span className='text-gray-400 text-sm italic'>Not specified</span>
      );
    }

    // For URLs - detect and make them clickable
    if (
      typeof value === "string" &&
      (value.startsWith("http://") || value.startsWith("https://"))
    ) {
      return (
        <a
          href={value}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-600 hover:underline flex items-center gap-1.5'>
          <span>{value}</span>
        </a>
      );
    }

    return <span className='text-gray-800'>{renderValueAsString(value)}</span>;
  };

  const renderField = (
    key: string,
    value: ValueType,
    isDate: boolean = false,
    icon?: ReactNode
  ) => (
    <div
      key={key}
      className='p-0 rounded-lg border border-gray-100 shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-300 overflow-hidden'>
      <div className='flex flex-col h-full'>
        <div className='bg-gray-50 px-4 py-2 border-b border-gray-100 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            {icon || null}
            <span className='text-xs uppercase tracking-wider text-gray-600 font-medium'>
              {camelToWords(key)}
            </span>
          </div>
          {isValueMissing(value) && (
            <span className='inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 border border-red-100'>
              Required
            </span>
          )}
        </div>
        <div className='px-4 py-3 bg-white flex-grow'>
          {!isValueMissing(value) ? (
            <span className='font-medium text-gray-800'>
              {isDate && value instanceof Date
                ? format(value, "PPP")
                : renderValueAsString(value)}
            </span>
          ) : (
            <span className='text-gray-400 text-sm italic'>Not specified</span>
          )}
        </div>
      </div>
    </div>
  );

  const renderDocument = (key: string, value: ValueType) => (
    <div
      key={key}
      className='p-0 rounded-lg border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all duration-300 overflow-hidden'>
      <div className='flex flex-col h-full'>
        <div className='bg-blue-50 px-4 py-2 border-b border-blue-100 flex items-center justify-between'>
          <span className='text-xs uppercase tracking-wider text-blue-700 font-medium flex items-center gap-1.5'>
            <Paperclip size={14} />
            {getOrdinalSuffix(Number(key))} Document
          </span>
          <Badge
            variant='outline'
            className='bg-white text-blue-700 border-blue-200'>
            Document
          </Badge>
        </div>
        <div className='px-4 py-3 bg-white flex-grow'>
          {!isValueMissing(value) ? (
            <div className='font-medium text-gray-800'>
              {renderValue(value)}
            </div>
          ) : (
            <span className='text-gray-400 text-sm italic'>Not specified</span>
          )}
        </div>
      </div>
    </div>
  );

  const renderQualification = (key: string, value: ValueType) => (
    <div
      key={key}
      className='p-0 rounded-lg border border-gray-100 shadow-sm hover:border-amber-200 hover:shadow-md transition-all duration-300 overflow-hidden'>
      <div className='flex flex-col h-full'>
        <div className='bg-amber-50 px-4 py-2 border-b border-amber-100 flex items-center justify-between'>
          <span className='text-xs uppercase tracking-wider text-amber-700 font-medium flex items-center gap-1.5'>
            <Trophy size={14} />
            {getOrdinalSuffix(Number(key))} Qualification Criteria
          </span>
          <Badge
            variant='outline'
            className='bg-white text-amber-700 border-amber-200'>
            Qualification
          </Badge>
        </div>
        <div className='px-4 py-3 bg-white flex-grow'>
          {!isValueMissing(value) ? (
            <div className='font-medium text-gray-800'>
              {renderValue(value)}
            </div>
          ) : (
            <span className='text-gray-400 text-sm italic'>Not specified</span>
          )}
        </div>
      </div>
    </div>
  );

  // Count missing fields
  const getMissingFieldsCount = () => {
    let count = 0;

    // Check item info
    Object.values(isPreviewData?.itemInfo || {}).forEach((value) => {
      if (isValueMissing(value)) count++;
    });

    // Check dates
    Object.values(isPreviewData?.keyDates || {}).forEach((value) => {
      if (isValueMissing(value)) count++;
    });

    // Check fees
    Object.values(isPreviewData?.tenderFeeDetails || {}).forEach((value) => {
      if (isValueMissing(value)) count++;
    });

    // Check documents
    isPreviewData?.tenderSupportDocuments?.forEach((doc) => {
      Object.values(doc).forEach((value) => {
        if (isValueMissing(value)) count++;
      });
    });

    // Check vendor requirements
    isPreviewData?.vendorDocRequirement?.forEach((req) => {
      Object.values(req).forEach((value) => {
        if (isValueMissing(value)) count++;
      });
    });

    // Check qualifications
    isPreviewData?.tenderPreQualifications?.forEach((qual) => {
      Object.values(qual).forEach((value) => {
        if (isValueMissing(value)) count++;
      });
    });

    return count;
  };

  const missingFieldsCount = getMissingFieldsCount();

  const getItemInfoFields = () => {
    const icons = {
      company: (
        <Building
          size={14}
          className='text-blue-600'
        />
      ),
      department: (
        <Building
          size={14}
          className='text-blue-600'
        />
      ),
      tenderNumber: (
        <Hash
          size={14}
          className='text-indigo-600'
        />
      ),
      tenderType: (
        <ClipboardType
          size={14}
          className='text-indigo-600'
        />
      ),
      tenderScope: (
        <BookOpen
          size={14}
          className='text-indigo-600'
        />
      ),
      category: (
        <Tag
          size={14}
          className='text-purple-600'
        />
      ),
      title: (
        <FileText
          size={14}
          className='text-blue-600'
        />
      ),
      description: (
        <FileText
          size={14}
          className='text-blue-600'
        />
      ),
      technicalPreBidQualification: (
        <Award
          size={14}
          className='text-amber-600'
        />
      ),
      technicalWeightage: (
        <Award
          size={14}
          className='text-amber-600'
        />
      ),
      commercialWeightage: (
        <CoinsIcon
          size={14}
          className='text-green-600'
        />
      ),
    };

    return Object.entries(isPreviewData?.itemInfo || {}).map(([key, value]) =>
      renderField(key, value, false, icons[key as keyof typeof icons])
    );
  };

  const getKeyDateFields = () => {
    const dateIcon = (
      <CalendarClock
        size={14}
        className='text-rose-600'
      />
    );

    return Object.entries(isPreviewData?.keyDates || {}).map(([key, value]) =>
      renderField(
        key,
        value,
        key.substring(key.length - 4) === "Date",
        dateIcon
      )
    );
  };

  return (
    <div className='space-y-8 pb-4 animate-in fade-in duration-500'>
      {/* Header and summary card */}
      <div className='flex flex-col gap-6'>
        <Card className={cn("w-full border", borderStyle)}>
          <CardHeader className='bg-gradient-to-r from-primary to-accent text-white rounded-lg pb-8'>
            <div className='flex justify-between items-start'>
              <div>
                <h2 className='text-2xl font-bold flex items-center gap-2'>
                  <Sparkles
                    size={20}
                    className='text-amber-300'
                  />
                  Tender Preview
                </h2>
                <p className='text-blue-100 mt-1 max-w-md'>
                  Review your tender details before publishing to ensure
                  accuracy and completeness.
                </p>
              </div>
              <div className='flex flex-col items-end'>
                <div className='text-right'>
                  <Badge
                    className={`${
                      missingFieldsCount > 0
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white border-0 animate-in fade-in duration-500`}>
                    {missingFieldsCount > 0
                      ? `${missingFieldsCount} Missing Fields`
                      : "Ready to Publish"}
                  </Badge>
                </div>
                <p className='text-xs text-blue-100 mt-1.5'>
                  {isPreviewData?.itemInfo?.tenderNumber
                    ? `Tender #${isPreviewData.itemInfo.tenderNumber}`
                    : "New Tender"}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card
          className={cn(
            "w-full bg-gradient-to-br from-amber-100 to-orange-50 border-0"
          )}>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg font-semibold flex items-center gap-2'>
              <Info
                size={18}
                className='text-amber-600'
              />
              Important Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-3 text-sm'>
              <li className='flex gap-2'>
                <Check
                  size={16}
                  className='text-green-600 mt-0.5 flex-shrink-0'
                />
                <span>Verify all details carefully before publishing</span>
              </li>
              <li className='flex gap-2'>
                <Check
                  size={16}
                  className='text-green-600 mt-0.5 flex-shrink-0'
                />
                <span>Ensure all key dates are correct and sequential</span>
              </li>
              <li className='flex gap-2'>
                <Check
                  size={16}
                  className='text-green-600 mt-0.5 flex-shrink-0'
                />
                <span>All required documents should be attached</span>
              </li>
              <li className='flex gap-2'>
                <Check
                  size={16}
                  className='text-green-600 mt-0.5 flex-shrink-0'
                />
                <span>
                  Qualification criteria should be clear and measurable
                </span>
              </li>
            </ul>
            <Separator className='my-4' />
            <div className='text-amber-800 bg-amber-100 rounded-md p-3 text-sm flex gap-2'>
              <HelpCircle
                size={16}
                className='text-amber-600 mt-0.5 flex-shrink-0'
              />
              <div>
                <span className='font-medium'>Need Help?</span> Once published,
                your tender will be visible to all eligible bidders on the
                platform.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for tender sections */}
      <Card className='border'>
        <Tabs
          defaultValue='general'
          value={activeTab}
          onValueChange={setActiveTab}
          className='w-full'>
          <CardHeader className='pb-0'>
            <TabsList className='bg-gray-100 p-1'>
              <TabsTrigger
                value='general'
                className='data-[state=active]:bg-white rounded-md'>
                <div className='flex items-center gap-1.5'>
                  <FileText size={16} />
                  <span>General Info</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value='documents'
                className='data-[state=active]:bg-white rounded-md'>
                <div className='flex items-center gap-1.5'>
                  <Paperclip size={16} />
                  <span>Documents</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value='dates'
                className='data-[state=active]:bg-white rounded-md'>
                <div className='flex items-center gap-1.5'>
                  <CalendarDays size={16} />
                  <span>Key Dates</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value='fees'
                className='data-[state=active]:bg-white rounded-md'>
                <div className='flex items-center gap-1.5'>
                  <CoinsIcon size={16} />
                  <span>Fees & Details</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value='qualifications'
                className='data-[state=active]:bg-white rounded-md'>
                <div className='flex items-center gap-1.5'>
                  <Award size={16} />
                  <span>Qualifications</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className='pt-6'>
            <ScrollArea className='h-[30rem] pr-4'>
              <TabsContent
                value='general'
                className='mt-0'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {getItemInfoFields()}
                </div>
              </TabsContent>

              <TabsContent
                value='documents'
                className='mt-0 space-y-6'>
                <div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
                  <div className='bg-blue-50 px-5 py-3 border-b border-blue-100'>
                    <h3 className='text-sm font-semibold flex items-center gap-2 text-blue-700'>
                      <Paperclip size={16} />
                      Support Documents
                    </h3>
                  </div>
                  <div className='p-4'>
                    {isPreviewData?.tenderSupportDocuments &&
                    isPreviewData.tenderSupportDocuments.length > 0 ? (
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {Object.entries(
                          isPreviewData.tenderSupportDocuments
                        ).map(([key, value]) => renderDocument(key, value))}
                      </div>
                    ) : (
                      <div className='flex flex-col items-center justify-center py-8 px-4 text-center'>
                        <div className='bg-blue-50 p-3 rounded-full mb-3'>
                          <Paperclip
                            size={20}
                            className='text-blue-500'
                          />
                        </div>
                        <h4 className='text-gray-800 font-medium mb-1'>
                          No Support Documents
                        </h4>
                        <p className='text-gray-500 text-sm'>
                          No tender support documents have been uploaded yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
                  <div className='bg-indigo-50 px-5 py-3 border-b border-indigo-100'>
                    <h3 className='text-sm font-semibold flex items-center gap-2 text-indigo-700'>
                      <ClipboardList size={16} />
                      Bidder Documents Requirements
                    </h3>
                  </div>
                  <div className='p-4'>
                    {isPreviewData?.vendorDocRequirement &&
                    isPreviewData.vendorDocRequirement.length > 0 ? (
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {Object.entries(isPreviewData.vendorDocRequirement).map(
                          ([key, value]) => {
                            return (
                              <div
                                key={key}
                                className='rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all'>
                                <div className='bg-indigo-50 px-4 py-2 border-b border-indigo-100 flex justify-between items-center'>
                                  <span className='text-xs uppercase tracking-wider font-medium text-indigo-700 flex items-center gap-1.5'>
                                    <ClipboardList size={14} />
                                    {getOrdinalSuffix(Number(key))} Requirement
                                  </span>
                                  <Badge
                                    variant='outline'
                                    className='bg-white border-indigo-200 text-indigo-700'>
                                    Required
                                  </Badge>
                                </div>
                                <div className='p-4'>
                                  {!isValueMissing(value) ? (
                                    <div className='space-y-2'>
                                      {typeof value === "object" &&
                                        value !== null && (
                                          <>
                                            {Object.entries(value).map(
                                              ([docKey, docValue]) => (
                                                <div
                                                  key={docKey}
                                                  className='bg-gray-50 rounded-md p-3'>
                                                  <span className='text-xs text-gray-500 block mb-1'>
                                                    {camelToWords(docKey)}
                                                  </span>
                                                  <span className='font-medium text-gray-800'>
                                                    {isValueMissing(
                                                      docValue as ValueType
                                                    ) ? (
                                                      <span className='text-gray-400 text-sm italic'>
                                                        Not specified
                                                      </span>
                                                    ) : (
                                                      String(docValue)
                                                    )}
                                                  </span>
                                                </div>
                                              )
                                            )}
                                          </>
                                        )}
                                    </div>
                                  ) : (
                                    <span className='text-gray-400 text-sm italic'>
                                      No details specified
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <div className='flex flex-col items-center justify-center py-8 px-4 text-center'>
                        <div className='bg-indigo-50 p-3 rounded-full mb-3'>
                          <ClipboardList
                            size={20}
                            className='text-indigo-500'
                          />
                        </div>
                        <h4 className='text-gray-800 font-medium mb-1'>
                          No Document Requirements
                        </h4>
                        <p className='text-gray-500 text-sm'>
                          No bidder document requirements have been added yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value='dates'
                className='mt-0'>
                <div className='mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg'>
                  <h3 className='text-sm font-semibold mb-1 flex items-center gap-2 text-blue-800'>
                    <Info size={16} />
                    Timeline
                  </h3>
                  <p className='text-xs text-blue-700'>
                    All dates should follow a logical sequence from pre-publish
                    through bid opening.
                  </p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {getKeyDateFields()}
                </div>
              </TabsContent>

              <TabsContent
                value='fees'
                className='mt-0'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {Object.entries(isPreviewData?.tenderFeeDetails || {}).map(
                    ([key, value]) =>
                      renderField(
                        key,
                        value,
                        false,
                        <CoinsIcon
                          size={14}
                          className='text-green-600'
                        />
                      )
                  )}
                </div>
              </TabsContent>

              <TabsContent
                value='qualifications'
                className='mt-0'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {Object.entries(
                    isPreviewData?.tenderPreQualifications || {}
                  ).map(([key, value]) => renderQualification(key, value))}
                </div>
              </TabsContent>
            </ScrollArea>
          </CardContent>
        </Tabs>
      </Card>

      {/* Action buttons */}
      <div className='flex justify-between pt-6 border-t border-gray-200'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type='button'
                variant='outline'
                className={secondaryButtonStyle}
                onClick={() => setActive(6)}>
                <ArrowLeft size={16} /> Previous Step
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Go back to edit qualification criteria</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className='flex gap-3'>
          <Button
            type='submit'
            // disabled={isLoading || missingFieldsCount > 0}
            className='bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white rounded-mmd font-medium shadow-md hover:shadow-lg flex transition-all duration-300 items-center gap-2 px-6 py-2.5 h-auto'
            aria-busy={isLoading}>
            {isLoading ? (
              <Loader2 className='animate-spin h-4 w-4' />
            ) : (
              <Sparkles
                size={16}
                className='text-amber-200'
              />
            )}
            {missingFieldsCount > 0
              ? `Complete ${missingFieldsCount} Missing Fields`
              : "Publish Tender"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(CreateTenderPreview);
