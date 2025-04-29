import React, { FC } from "react";
import {
  Briefcase,
  MapPin,
  Calendar,
  FileText,
  CreditCard,
  Tag,
  FileCode2,
  ArrowRight,
  Building2,
} from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { capitalizeFirstLetter } from "@/lib/helper";
import { Button } from "@/components/ui/button";
import { ITenderCard } from "@/app/Types/Tender-Types";
import { primaryButtonStyle } from "@/app/Styles";

const TenderCard: FC<{ tender: ITenderCard }> = ({ tender }) => {
  const router = useRouter();

  const emd = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(Number(tender.emd));

  const documentFee = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(Number(tender.documentFee));

  return (
    <div className='relative duration-300 rounded-xl max-w-[60rem] overflow-hidden pb-1'>
      <div className='flex  p-5'>
        <div className='flex-1 space-y-4'>
          <div>
            <h3 className='text-[1.30rem] font-semibold text-gray-900 line-clamp-2 leading-tight'>
              {tender.title}
            </h3>
            <div className='flex items-center mt-2 text-gray-700'>
              <Building2 className='size-4 mr-2' />
              <span className='text-[0.85rem]'>
                The Energy and Resources Institute (TERI)
              </span>
            </div>
          </div>

          {/* Tags Section */}
          <div className='flex flex-wrap gap-2'>
            <span className='px-3 py-1 text-xs font-semibold bg-primary/10 text-accent rounded-[0.4rem]'>
              {capitalizeFirstLetter(tender.type)}
            </span>
            <span className='px-3 py-1 text-xs font-semibold bg-primary/10 text-accent rounded-[0.4rem]'>
              {capitalizeFirstLetter(tender.category)}
            </span>
          </div>

          {/* Details Grid */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex items-center text-gray-700'>
              <div className='p-2 mr-3 bg-primary/10 flex items-center justify-center rounded-full'>
                <Briefcase className='text-gray-700 size-4' />
              </div>
              <div className='flex flex-col'>
                <span className='text-xs text-gray-700'>Department</span>
                <span className='text-[0.85rem] font-medium text-gray-900'>
                  {tender.department}
                </span>
              </div>
            </div>
            <div className='flex items-center text-gray-700'>
              <div className='p-2 mr-3 bg-primary/10 flex items-center justify-center rounded-full'>
                <MapPin className='text-gray-700 size-4' />
              </div>
              <div className='flex flex-col'>
                <span className='text-xs text-gray-700'>Location</span>
                <span className='text-[0.85rem] font-medium text-gray-900'>
                  {capitalizeFirstLetter(tender.location)}
                </span>
              </div>
            </div>
            <div className='flex items-center text-gray-700'>
              <div className='p-2 mr-3 bg-primary/10 flex items-center justify-center rounded-full'>
                <Tag className='text-gray-700 size-4' />
              </div>
              <div className='flex flex-col'>
                <span className='text-xs text-gray-700'>Scope</span>
                <span className='text-[0.85rem] font-medium text-gray-900'>
                  {capitalizeFirstLetter(tender.scope)}
                </span>
              </div>
            </div>
            <div className='flex items-center text-gray-700'>
              <div className='p-2 mr-3 bg-primary/10 flex items-center justify-center rounded-full'>
                <FileCode2 className='text-gray-700 size-4' />
              </div>
              <div className='flex flex-col'>
                <span className='text-xs text-gray-700'>Tender Number</span>
                <span className='text-[0.85rem] font-medium text-gray-900'>
                  #TN{tender.tenderNumber}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className='w-64 flex flex-col justify-between border-l border-gray-200 pl-5'>
          {/* Important Information */}
          <div className='space-y-2'>
            <div className='flex items-center px-3 py-2 rounded-lg'>
              <Calendar className=' text-gray-700 w-4 h-4 mr-2' />

              <span className='text-[0.85rem] text-gray-700'>
                Bid Ends:
                <span className='ml-1.5 font-medium text-gray-900'>
                  {tender?.bidEndDate
                    ? format(new Date(tender.bidEndDate), "dd MMM yyyy")
                    : "N/A"}
                </span>
              </span>
            </div>

            <div className='flex items-center px-3 py-2 rounded-lg'>
              <FileText className=' text-gray-700 w-4 h-4 mr-2' />
              <span className='text-[0.85rem] text-gray-700 flex items-center'>
                Doc Fee:
                <span className='ml-1.5 font-medium text-gray-900'>
                  {documentFee}
                </span>
              </span>
            </div>

            <div className='flex items-center px-3 py-1.5 rounded-lg'>
              <CreditCard className=' text-gray-700 w-4 h-4 mr-2' />
              <span className='text-[0.85rem] text-gray-700 flex items-center'>
                EMD:
                <span className='ml-1.5 font-medium text-gray-900'>{emd}</span>
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => router.push(`/tender/${tender.id}`)}
            className={primaryButtonStyle}>
            <span>View Details</span>
            <ArrowRight className='size-4 group-hover:translate-x-0.5 transition-transform' />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TenderCard;
