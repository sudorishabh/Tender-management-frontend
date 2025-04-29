import {
  borderStyle,
  primaryButtonStyle,
  secondaryButtonStyle2,
} from "@/app/Styles";
import { IAllTenderCard } from "@/app/Types/Tender-Types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { capitalizeFirstLetter } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Eye,
  FileText,
  Calendar,
  MapPin,
  Tag,
  Hash,
  Building,
  HandCoins,
  Star,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const TenderCardWithActions = ({ tender }: { tender: IAllTenderCard }) => {
  return (
    <div
      key={tender.id}
      className='mb-5'>
      <Card
        className={cn(
          "overflow-hidden shadow-none border transition-shadow duration-300 mb-4",
          borderStyle
        )}>
        <div className='flex flex-col md:flex-row w-full'>
          <div className='flex-1 p-5'>
            <div className='flex flex-wrap  items-center gap-2 mb-2'>
              <h3 className='text-lg font-semibold text-gray-900 mr-2'>
                {capitalizeFirstLetter(tender.title)}
              </h3>
              <span className='rounded-md px-2 text-xs font-medium  bg-green-50 border border-green-400  text-green-800'>
                {capitalizeFirstLetter(tender.status)}
              </span>
            </div>

            <div className='flex flex-wrap gap-10 mb-3'>
              <div className='flex w-[50%] items-center text-sm text-gray-500'>
                <Hash className='h-4 w-4 mr-1 text-accent' />
                <span className='text-gray-700 mr-1'>Tender No:</span>
                <span className='font-medium text-gray-900'>
                  {tender.tenderNumber}
                </span>
              </div>
              <div className='flex items-center text-sm text-gray-500'>
                <Calendar className='h-4 w-4 mr-1 text-accent' />
                <span className='text-gray-700 mr-1'>Bid End:</span>
                <span className='font-medium text-gray-900'>
                  {format(tender.bidEndDate, "dd MMM yyyy")}
                </span>
              </div>
            </div>

            <div className='flex flex-wrap gap-10 text-sm text-gray-500 mb-3'>
              <div className='flex w-[50%] items-center'>
                <span className='font-medium mr-1 flex items-center'>
                  <Building className='h-4     w-4 mr-1 text-accent' />
                  <span className='text-gray-700 mr-1'>Department:</span>
                </span>
                <span className='font-medium text-gray-900'>
                  {capitalizeFirstLetter(tender.department)}
                </span>
              </div>
              {tender.location && (
                <div className='flex items-center'>
                  <span className='font-medium mr-1 flex items-center'>
                    <MapPin className='h-4 w-4 mr-1 text-accent' />
                    <span className='text-gray-700 mr-1'>Location:</span>
                  </span>
                  <span className='font-medium text-gray-900'>
                    {capitalizeFirstLetter(tender.location)}
                  </span>
                </div>
              )}
            </div>

            <div className='flex flex-wrap gap-10 text-sm text-gray-500'>
              <div className='flex w-[50%] items-center'>
                <span className='font-medium mr-1 flex items-center'>
                  <FileText className='h-4 w-4 mr-1 text-accent' />
                  <span className='text-gray-700 mr-1'>Scope:</span>
                </span>
                <span className='font-medium text-gray-900'>
                  {capitalizeFirstLetter(tender.scope)}
                </span>
              </div>
              {tender.location && (
                <div className='flex items-center'>
                  <span className='font-medium mr-1 flex items-center'>
                    <Tag className='h-4 w-4 mr-1 text-accent' />
                    <span className='text-gray-700 mr-1'> Category:</span>
                  </span>
                  <span className='font-medium text-gray-900'>
                    {capitalizeFirstLetter(tender.category)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className='bg-gray-50 p-5 md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100'>
            <div>
              <div className='mb-3'>
                <div className='text-xs text-gray-700 uppercase mb-1'>
                  Document Fee
                </div>
                <div className='font-semibold text-gray-900'>
                  {formatCurrency(Number(tender.documentFee))}
                </div>
              </div>
              <div className='mb-3'>
                <div className='text-xs text-gray-700 uppercase mb-1'>EMD</div>
                <div className='font-semibold text-gray-900'>
                  {formatCurrency(Number(tender.emd))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-wrap justify-end pr-5 gap-5 py-4 bg-gray-50 border-t border-gray-100'>
          <Link href={`/tender/${tender.id}`}>
            <Button
              size='sm'
              className='bg-transparent text-gray-900 hover:bg-transparent hover:text-gray-900 shadow-none'>
              <Eye className='h-4 w-4' />
              View Details
            </Button>
          </Link>
          <Link href={`/admin/live/${tender.id}/bid/reviewed`}>
            <Button
              size='sm'
              className={secondaryButtonStyle2}>
              <Star className='h-4 w-4' />
              Reviewed Bids
            </Button>
          </Link>

          <Link href={`/admin/live/${tender.id}/bid`}>
            <Button
              size='sm'
              className={primaryButtonStyle}>
              <HandCoins className='h-4 w-4' />
              Bids
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default TenderCardWithActions;
