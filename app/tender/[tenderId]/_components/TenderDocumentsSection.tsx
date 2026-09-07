import React from "react";
import { FileText } from "lucide-react";
import { IBidderDocumentsReq } from "@/_types/tender";

interface DocumentsSectionProps {
  bidderDocs: IBidderDocumentsReq[];
}

const TenderDocumentsSection: React.FC<DocumentsSectionProps> = ({
  bidderDocs,
}) => {
  return (
    <div className='grid grid-cols-1 gap-4'>
      {/* Bidder Documents */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4'>
        <div className='flex items-center justify-between mb-3'>
          <h2 className='text-sm font-semibold text-gray-900 flex items-center gap-2'>
            <span className='w-1 h-4 bg-primary0 rounded-full'></span>
            Required Documents
          </h2>
          <span className='text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full'>
            {bidderDocs?.length || 0} items
          </span>
        </div>
        <div className='space-y-2'>
          {bidderDocs && bidderDocs.length > 0 ? (
            bidderDocs.map((doc, index) => (
              <div
                key={doc.vdr_id}
                className='flex items-center gap-2.5 bg-gray-50 rounded-lg p-2.5 hover:bg-gray-100 transition-colors'>
                <div className='flex items-center justify-center w-6 h-6 bg-primary/5 rounded-md flex-shrink-0'>
                  <FileText className='h-3.5 w-3.5 text-primary' />
                </div>
                <div className='flex-1 min-w-0'>
                  <h3 className='text-xs font-medium text-gray-900 truncate'>
                    {doc.vdr_name}
                  </h3>
                  <p className='text-[10px] text-gray-400'>
                    {new Date(doc.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span className='text-[10px] font-medium text-primary bg-primary/5 px-1.5 py-0.5 rounded'>
                  #{index + 1}
                </span>
              </div>
            ))
          ) : (
            <div className='text-center py-6 bg-gray-50 rounded-lg'>
              <FileText className='h-6 w-6 text-gray-300 mx-auto mb-1' />
              <p className='text-xs text-gray-400'>No documents required</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenderDocumentsSection;
