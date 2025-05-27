import React from "react";
import {
  Building2,
  Banknote,
  MapPin,
  ArrowRight,
  Hash,
  Briefcase,
  Tag,
  Calendar,
  FileText,
  CheckCircle,
  FileCheck,
  Star,
  File,
} from "lucide-react";
import GeneralWrapper from "../Shared/GeneralWrapper";
import { Button } from "../ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { capitalizeFirstLetter, toIndianCurrency } from "@/lib/helper";
import { primaryButtonStyle } from "@/app/Styles";
import { cn } from "@/lib/utils";
import PdfViewerModal from "../Shared/PdfViewerModal";

interface TenderData {
  id: string;
  company: string;
  department: string;
  tender_number: string;
  type: string;
  scope: string;
  category: string;
  title: string;
  description: string;
  tech_prebid_qual: string;
  tech_weightage: number;
  commercial_weightage: number;
  doc_fee: string;
  fee_payable_at: string;
  emd: string;
  edm_payable_at: string;
  location: string;
  value: string;
  pre_publish_date: string;
  publish_date: string;
  sale_close_date: string;
  clarification_start_date: string;
  clarification_end_date: string;
  revision_publishment_date: string;
  bid_submission_end_date: string;
  bid_open_date: string;
  status: "draft" | "live" | "closed";
  created_at: string;
}

interface VendorDocRequirement {
  id: string;
  name: string;
  format: string;
  purpose: string;
  tender_id: string;
  created_at: string;
}

interface TenderPrequalification {
  id: string;
  title: string;
  description: string;
  score: number;
  tender_id: string;
  created_at: string;
}

interface TenderSupportDocument {
  id: string;
  name: string;
  purpose: string;
  doc_s3_name: string;
  tender_id: string;
  created_at: string;
}

interface TenderDataResponse {
  tender: TenderData;
  bidderDocumentsReq: VendorDocRequirement[];
  tenderPreQualification: TenderPrequalification[];
  tenderSupportDocuments: TenderSupportDocument[];
}

interface ApiResponse {
  success: boolean;
  tenderData: TenderDataResponse;
}

interface TenderDetailsProps {
  tenderData: ApiResponse;
}

// SectionHeader component
const SectionHeader = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <div className='flex items-center gap-2 mb-6'>
    <div className='h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center text-accent'>
      {icon}
    </div>
    <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
  </div>
);

const TenderDetails: React.FC<TenderDetailsProps> = ({ tenderData }) => {
  const {
    tender,
    bidderDocumentsReq,
    tenderPreQualification,
    tenderSupportDocuments,
  } = tenderData?.tenderData;

  console.log(tenderSupportDocuments);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return (
          <Badge className='bg-green-100 text-green-800 hover:bg-green-200'>
            <span className='flex items-center gap-1.5'>
              <span className='h-2 w-2 rounded-full bg-green-500 animate-pulse'></span>
              Active
            </span>
          </Badge>
        );
      case "closed":
        return (
          <Badge className='bg-red-100 text-red-800 hover:bg-red-200'>
            Closed
          </Badge>
        );
      default:
        return (
          <Badge className='bg-yellow-100 text-yellow-800 hover:bg-yellow-200'>
            Draft
          </Badge>
        );
    }
  };

  // Format dates clearly
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  return (
    <GeneralWrapper>
      <div className='bg-white min-h-screen'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16'>
          {/* Header with key tender info */}
          <div className='border-b pb-6 mb-8'>
            <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6'>
              <div>
                <div className='flex items-center gap-2 mb-3'>
                  {getStatusBadge(tender.status)}
                  <span className='text-sm text-gray-500 flex items-center'>
                    <Hash className='h-4 w-4 mr-1 text-gray-400' />
                    {tender.tender_number}
                  </span>
                </div>

                <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4'>
                  {capitalizeFirstLetter(tender.title)}
                </h1>

                <div className='flex items-center text-sm text-gray-600'>
                  <Building2 className='h-4 w-4 mr-2 text-accent' />
                  <span className='font-medium mr-1'>{tender.company}</span>
                  <span className='mx-2'>•</span>
                  <span>{tender.department}</span>
                </div>
              </div>

              <div className='shrink-0'>
                <Link href={`/tender/buy/${tender.id}`}>
                  <Button
                    size='lg'
                    className={primaryButtonStyle}>
                    Purchase Tender
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Key details */}
            <div className='flex flex-wrap gap-4 mt-6'>
              <div className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-mmd'>
                <MapPin className='h-4 w-4 text-gray-500' />
                <span className='text-sm font-medium'>
                  {capitalizeFirstLetter(tender.location)}
                </span>
              </div>

              <div className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-mmd'>
                <Briefcase className='h-4 w-4 text-gray-500' />
                <span className='text-sm font-medium'>
                  {capitalizeFirstLetter(tender.type)}
                </span>
              </div>

              <div className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-mmd'>
                <Tag className='h-4 w-4 text-gray-500' />
                <span className='text-sm font-medium'>
                  {capitalizeFirstLetter(tender.category)}
                </span>
              </div>

              <div className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-mmd'>
                <Banknote className='h-4 w-4 text-gray-500' />
                <span className='text-sm font-medium'>
                  {capitalizeFirstLetter(tender.value)}
                </span>
              </div>

              <div className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-mmd'>
                <Calendar className='h-4 w-4 text-gray-500' />
                <span className='text-sm font-medium'>
                  Deadline: {formatDate(tender.bid_submission_end_date)}
                </span>
              </div>
            </div>
          </div>

          {/* Main content - Single page layout */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2 space-y-8 '>
              {/* Project Description Section */}
              <section className='bg-white shadow-md border border-gray-300 rounded-lg p-6'>
                <SectionHeader
                  icon={<FileText className='h-5 w-5' />}
                  title='Project Overview'
                />
                <p className='text-gray-700 leading-relaxed'>
                  {tender.description}
                </p>
              </section>

              {/* Pre-qualification Section */}
              <section className='bg-white border rounded-lg p-6 shadow-md border-gray-300'>
                <SectionHeader
                  icon={<CheckCircle className='h-5 w-5' />}
                  title='Pre-qualification Requirements'
                />

                <div className='mb-6'>
                  <h3 className='text-base font-medium text-gray-800 mb-3'>
                    Pre-bid Qualifications
                  </h3>
                  <div className='bg-gray-100 border border-gray-200 rounded-lg p-4'>
                    <p className='text-gray-700 '>{tender.tech_prebid_qual}</p>
                  </div>
                </div>

                <div>
                  <h3 className='text-base font-medium text-gray-800 mb-3'>
                    Qualification Criteria
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {tenderPreQualification.map((qual) => (
                      <div
                        key={qual.id}
                        className='bg-gray-100 border border-gray-200 rounded-lg p-4'>
                        <div className='flex items-start gap-3'>
                          <div className='h-8 w-8 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 mt-0.5'>
                            <span className='font-medium'>{qual.score}</span>
                          </div>
                          <div>
                            <h4 className='font-medium text-gray-900'>
                              {qual.title}
                            </h4>
                            <p className='text-sm text-gray-600 mt-1'>
                              {qual.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Required Documents Section */}
              <section className='bg-white border rounded-lg p-6 shadow-md border-gray-300'>
                <SectionHeader
                  icon={<FileCheck className='h-5 w-5' />}
                  title='Document Requirements'
                />

                <div className='mb-6'>
                  <h3 className='text-base font-medium text-gray-800 mb-3'>
                    Required Documents
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {bidderDocumentsReq.map((doc, index) => (
                      <div
                        key={doc.id}
                        className='border shadow border-gray-100  rounded-lg overflow-hidden'>
                        <div className='bg-gray-100 px-4 py-3 border-b'>
                          <div className='flex justify-between items-center'>
                            <h4 className='font-medium text-gray-900 flex items-center'>
                              <span className='h-6 w-6 rounded-full bg-accent/10 text-accent flex items-center justify-center mr-2 text-xs'>
                                {index + 1}
                              </span>
                              {doc.name}
                            </h4>
                            <Badge
                              variant='outline'
                              className='bg-accent/10 text-accent'>
                              {doc.format}
                            </Badge>
                          </div>
                        </div>
                        <div className='p-4 bg-gray-50'>
                          <p className='text-sm text-gray-600'>{doc.purpose}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className='text-base font-medium text-gray-800 mb-3'>
                    Support Documents
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {tenderSupportDocuments?.map((doc) => (
                      <div
                        key={doc.id}
                        className='bg-white  shadow border border-gray-100 rounded-lg overflow-hidden'>
                        <div className='py-3 px-4 border-b bg-gray-100'>
                          <h3 className='font-medium text-gray-900 truncate'>
                            {capitalizeFirstLetter(doc.name)}
                          </h3>
                        </div>
                        <div className='p-4 bg-gray-50'>
                          <p className='text-sm text-gray-600 mb-4 line-clamp-2'>
                            {doc.purpose}
                          </p>
                          <PdfViewerModal
                            value={doc.doc_s3_name}
                            isS3File={true}
                            triggerButton={
                              <Button
                                variant='outline'
                                size='sm'
                                className='w-full flex items-center justify-center hover:bg-accent/10 hover:text-accent transition-colors'>
                                <File className='h-5 w-4 mr-2' />
                                View Document
                              </Button>
                            }
                          />
                          {/* <Button
                            variant='outline'
                            size='sm'
                            className='w-full flex items-center justify-center hover:bg-accent/10 hover:text-accent transition-colors'
                            asChild>
                            <a
                              href={doc.doc_s3_name}
                              download>
                              <Download className='h-4 w-4 mr-2' />
                              Download
                            </a>
                          </Button> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <div className='grid grid-cols-1 gap-8'>
              {/* Financial Details Section */}
              <section className='bg-white border rounded-lg p-6 shadow-md border-gray-300 '>
                <SectionHeader
                  icon={<Banknote className='h-5 w-5' />}
                  title='Financial Details'
                />
                <div className='space-y-3'>
                  <div className='flex justify-between py-2 border-b'>
                    <span className='text-gray-600'>Tender Value</span>
                    <span className='font-medium text-gray-900'>
                      {toIndianCurrency(Number(tender.value))}
                    </span>
                  </div>
                  <div className='flex justify-between py-2 border-b'>
                    <span className='text-gray-600'>Document Fee</span>
                    <span className='font-medium text-gray-900'>
                      {toIndianCurrency(Number(tender.doc_fee))}
                    </span>
                  </div>
                  <div className='flex justify-between py-2 border-b'>
                    <span className='text-gray-600'>EMD</span>
                    <span className='font-medium text-gray-900'>
                      {toIndianCurrency(Number(tender.emd))}
                    </span>
                  </div>
                  <div className='flex justify-between py-2 border-b'>
                    <span className='text-gray-600'>EMD Payable At</span>
                    <span className='font-medium text-gray-900'>
                      {tender.edm_payable_at}
                    </span>
                  </div>
                  <div className='flex justify-between py-2'>
                    <span className='text-gray-600'>Fee Payable At</span>
                    <span className='font-medium text-gray-900'>
                      {tender.fee_payable_at}
                    </span>
                  </div>
                </div>
              </section>

              {/* Evaluation Section */}
              <section className='bg-white border rounded-lg p-6 shadow-md border-gray-300'>
                <SectionHeader
                  icon={<Star className='h-5 w-5' />}
                  title='Evaluation Criteria'
                />
                <div className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Technical</span>
                    <span className='font-medium text-gray-900'>
                      {tender.tech_weightage}%
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Commercial</span>
                    <span className='font-medium text-gray-900'>
                      {tender.commercial_weightage}%
                    </span>
                  </div>
                </div>
              </section>

              {/* Timeline Section */}
              <section className='bg-white border rounded-lg p-6 shadow-md border-gray-300'>
                <SectionHeader
                  icon={<Calendar className='h-5 w-5' />}
                  title='Important Dates'
                />

                <div className='space-y-4'>
                  <div>
                    <h4 className='font-medium text-gray-900'>
                      Submission Deadline
                    </h4>
                    <p className='text-red-600 font-medium mt-1'>
                      {formatDate(tender.bid_submission_end_date)}
                    </p>
                  </div>

                  <Separator />

                  <div className='space-y-3'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Publish Date</span>
                      <span className='font-medium text-gray-900'>
                        {formatDate(tender.publish_date)}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Sale Close Date</span>
                      <span className='font-medium text-gray-900'>
                        {formatDate(tender.sale_close_date)}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Clarification Start</span>
                      <span className='font-medium text-gray-900'>
                        {formatDate(tender.clarification_start_date)}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Clarification End</span>
                      <span className='font-medium text-gray-900'>
                        {formatDate(tender.clarification_end_date)}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Bid Open Date</span>
                      <span className='font-medium text-gray-900'>
                        {formatDate(tender.bid_open_date)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Call to action */}
                <div className='mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4'>
                  <p className='text-sm text-primary mb-4'>
                    Ready to participate? Purchase this tender document to
                    access all required information and guidelines.
                  </p>
                  <Link href={`/tender/buy/${tender.id}`}>
                    <Button className={cn(primaryButtonStyle, "w-full")}>
                      Purchase Tender
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </Button>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </GeneralWrapper>
  );
};

export default TenderDetails;
