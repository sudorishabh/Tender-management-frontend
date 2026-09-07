import React from "react";
import { Building2, MapPin, Tag } from "lucide-react";
import { ITender } from "@/_types/tender";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

interface TenderHeaderProps {
  tender: ITender;
}

const TenderHeader: React.FC<TenderHeaderProps> = ({ tender }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "closed":
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
      case "draft":
        return "bg-slate-50 text-slate-600 border-slate-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className='bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden'>
      <div className='p-6'>
        {/* Status and ID */}
        <div className='flex items-center gap-3 mb-4'>
          <span
            className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(
              tender.tender_status ?? "draft"
            )}`}>
            {capitalizeFirstLetter(tender.tender_status ?? "draft")}
          </span>
          <span className='text-xs text-neutral-500 font-mono'>
            {tender.tender_number ?? "N/A"}
          </span>
        </div>

        {/* Title */}
        <h1 className='text-xl font-semibold text-primary leading-tight mb-3'>
          {capitalizeFirstLetter(tender.tender_title ?? "")}
        </h1>

        {/* Description */}
        {tender.tender_description && (
          <p className='text-sm text-slate-600 leading-relaxed mb-6'>
            {capitalizeFirstLetter(tender.tender_description)}
          </p>
        )}

        {/* Info Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-5 pt-5 border-t border-neutral-100'>
          {/* Department */}
          <div>
            <div className='flex items-center gap-1.5 mb-1.5'>
              <Building2 className='w-3.5 h-3.5 text-neutral-400' />
              <p className='text-xs font-medium text-neutral-500 uppercase tracking-wide'>
                Department
              </p>
            </div>
            <p className='text-sm font-medium text-slate-900'>
              {capitalizeFirstLetter(tender.tender_department ?? "N/A")}
            </p>
          </div>



          {/* Location */}
          <div className='sm:text-center'>
            <div className='flex items-center gap-1.5 mb-1.5 sm:justify-center'>
              <MapPin className='w-3.5 h-3.5 text-neutral-400' />
              <p className='text-xs font-medium text-neutral-500 uppercase tracking-wide'>
                Location
              </p>
            </div>
            <p className='text-sm font-medium text-slate-900'>
              {capitalizeFirstLetter(tender.tender_location ?? "N/A")}
            </p>
          </div>

          {/* Scope */}
          <div className='sm:text-right'>
            <div className='flex items-center gap-1.5 mb-1.5 sm:justify-end'>
              <Tag className='w-3.5 h-3.5 text-neutral-400' />
              <p className='text-xs font-medium text-neutral-500 uppercase tracking-wide'>
                Scope
              </p>
            </div>
            <p className='text-sm font-medium text-slate-900'>
              {capitalizeFirstLetter(tender.tender_scope) || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderHeader;
