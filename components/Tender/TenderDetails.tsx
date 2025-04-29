import React, { FC } from "react";
import {
  Building2,
  Banknote,
  MapPin,
  Download,
  ArrowRight,
  Hash,
  Briefcase,
  Tag,
} from "lucide-react";
import GeneralWrapper from "../Shared/GeneralWrapper";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

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
  doc_url: string;
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

// Date display component
interface DateDisplayProps {
  label: string;
  date: string;
}

function DateDisplay({ label, date }: DateDisplayProps) {
  return (
    <div className='flex justify-between p-3 border-b border-gray-100 last:border-0'>
      <span className='text-gray-600'>{label}</span>
      <span className='font-medium'>{format(new Date(date), "PP")}</span>
    </div>
  );
}

interface TenderDetailsProps {
  tenderData: ApiResponse;
}

const TenderDetails: FC<TenderDetailsProps> = ({ tenderData }) => {
  const { isLoggedIn } = useSelector((state: RootState) => state.authSlice);

  const {
    tender,
    bidderDocumentsReq,
    tenderPreQualification,
    tenderSupportDocuments,
  } = tenderData?.tenderData;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return (
          <Badge className='bg-green-100 text-green-800 hover:bg-green-200'>
            Active
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

  return (
    <GeneralWrapper>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4'>
            <div className='flex items-center gap-2'>
              <Hash className='h-5 w-5 text-gray-400' />
              <span className='text-sm text-gray-500'>
                Tender ID: {tender.tender_number}
              </span>
              {getStatusBadge(tender.status)}
            </div>

            <div className='flex items-center gap-2'>
              <Building2 className='h-5 w-5 text-gray-400' />
              <span className='text-sm text-gray-500'>
                {tender.company} - {tender.department}
              </span>
            </div>
          </div>

          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            {tender.title}
          </h1>

          <div className='flex flex-wrap gap-4 text-sm'>
            <div className='flex items-center gap-2'>
              <MapPin className='h-4 w-4 text-gray-400' />
              <span>{tender.location}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Briefcase className='h-4 w-4 text-gray-400' />
              <span>Type: {tender.type}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Tag className='h-4 w-4 text-gray-400' />
              <span>Category: {tender.category}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Banknote className='h-4 w-4 text-gray-400' />
              <span>Value: {tender.value}</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className='space-y-6'>
          <Tabs
            defaultValue='details'
            className='w-full'>
            <TabsList className='grid w-full grid-cols-5 mb-6'>
              <TabsTrigger value='details'>Overview</TabsTrigger>
              <TabsTrigger value='requirements'>Requirements</TabsTrigger>
              <TabsTrigger value='qualifications'>Qualifications</TabsTrigger>
              <TabsTrigger value='documents'>Documents</TabsTrigger>
              <TabsTrigger value='dates'>Timeline</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent
              value='details'
              className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-gray-700'>{tender.description}</p>
                </CardContent>
              </Card>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>Financial Details</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='flex justify-between items-center pb-3 border-b'>
                      <span className='text-gray-600'>Tender Value</span>
                      <span className='font-semibold text-gray-900'>
                        {tender.value}
                      </span>
                    </div>
                    <div className='flex justify-between items-center pb-3 border-b'>
                      <span className='text-gray-600'>Document Fee</span>
                      <span className='font-semibold text-gray-900'>
                        {tender.doc_fee}
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-600'>EMD</span>
                      <span className='font-semibold text-gray-900'>
                        {tender.emd}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>Weightage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='bg-blue-50 p-4 rounded-md'>
                        <div className='text-sm font-medium text-blue-800 mb-1'>
                          Technical
                        </div>
                        <div className='text-3xl font-bold text-blue-700'>
                          {tender.tech_weightage}%
                        </div>
                      </div>
                      <div className='bg-indigo-50 p-4 rounded-md'>
                        <div className='text-sm font-medium text-indigo-800 mb-1'>
                          Commercial
                        </div>
                        <div className='text-3xl font-bold text-indigo-700'>
                          {tender.commercial_weightage}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Requirements Tab */}
            <TabsContent
              value='requirements'
              className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>
                    Pre-bid Qualifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-gray-700'>{tender.tech_prebid_qual}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Required Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='divide-y'>
                    {bidderDocumentsReq.map(
                      (doc: VendorDocRequirement, index: number) => (
                        <div
                          key={index}
                          className='py-3 first:pt-0 last:pb-0'>
                          <div className='flex justify-between items-start mb-1'>
                            <h4 className='font-medium text-gray-900'>
                              {doc.name}
                            </h4>
                            <Badge variant='outline'>{doc.format}</Badge>
                          </div>
                          <p className='text-sm text-gray-600'>{doc.purpose}</p>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Qualifications Tab */}
            <TabsContent
              value='qualifications'
              className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>
                    Prequalification Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='divide-y'>
                    {tenderPreQualification.map(
                      (qual: TenderPrequalification, index: number) => (
                        <div
                          key={index}
                          className='py-4 first:pt-0 last:pb-0'>
                          <div className='flex justify-between items-start mb-2'>
                            <h4 className='font-medium text-gray-900'>
                              {qual.title}
                            </h4>
                            <Badge>Score: {qual.score}</Badge>
                          </div>
                          <p className='text-sm text-gray-700'>
                            {qual.description}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent
              value='documents'
              className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Support Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {tenderSupportDocuments?.map(
                      (doc: TenderSupportDocument, index: number) => (
                        <div
                          key={index}
                          className='flex items-center justify-between border border-gray-200 rounded-md p-3'>
                          <div className='flex-1'>
                            <div className='font-medium text-gray-900 mb-1'>
                              {doc.name}
                            </div>
                            <div className='text-sm text-gray-600'>
                              {doc.purpose}
                            </div>
                          </div>
                          <Button
                            variant='outline'
                            size='sm'
                            asChild>
                            <a
                              href={doc.doc_url}
                              download>
                              <Download className='h-4 w-4 mr-2' />
                              Download
                            </a>
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent
              value='dates'
              className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Important Dates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-0'>
                    <DateDisplay
                      label='Pre-publish Date'
                      date={tender.pre_publish_date}
                    />
                    <DateDisplay
                      label='Publish Date'
                      date={tender.publish_date}
                    />
                    <DateDisplay
                      label='Sale Close Date'
                      date={tender.sale_close_date}
                    />
                    <DateDisplay
                      label='Clarification Start Date'
                      date={tender.clarification_start_date}
                    />
                    <DateDisplay
                      label='Clarification End Date'
                      date={tender.clarification_end_date}
                    />
                    <DateDisplay
                      label='Bid Submission End Date'
                      date={tender.bid_submission_end_date}
                    />
                    <DateDisplay
                      label='Bid Open Date'
                      date={tender.bid_open_date}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Action button */}
        {isLoggedIn && (
          <div className='mt-10 border-t border-gray-200 pt-6'>
            <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                  Ready to submit your bid?
                </h3>
                <p className='text-gray-600'>
                  Purchase this tender document to participate in bidding.
                </p>
              </div>
              <Link href={`/tender/buy/${tender.id}`}>
                <Button className='bg-primary hover:bg-primary/90 text-white'>
                  Purchase Tender
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </GeneralWrapper>
  );
};

export default TenderDetails;
