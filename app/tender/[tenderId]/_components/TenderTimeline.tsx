import React from "react";
import { Clock, Calendar, HelpCircle, Info } from "lucide-react";
import { ITender } from "@/_types/tender";
import {
  formatDisplayDateWithWeekday,
  formatDisplayTime12,
} from "@/utils/dateUtils";

interface TenderTimelineProps {
  tender: ITender;
}

const TenderTimeline: React.FC<TenderTimelineProps> = ({ tender }) => {
  // Dates that should show time
  const datesWithTime = [
    "tender_technical_bid_opening",
    "tender_financial_bid_opening",
    "tender_bid_submission_deadline",
  ];

  // Query-related event keys
  const queryRelatedEvents = [
    "tender_query_deadline",
    "tender_query_response_date",
  ];

  const timelineEvents = [
    {
      label: "Tender Release Date",
      description: "Date when tender was published and made available",
      date: tender.tender_release_date,
      status: "completed",
      key: "tender_release_date",
    },
    {
      label: "Query Submission Deadline",
      description: "Last date to submit clarification queries",
      date: tender.tender_query_deadline,
      status: "upcoming",
      key: "tender_query_deadline",
    },
    {
      label: "Query Response Date",
      description: "Date when responses to queries will be published",
      date: tender.tender_query_response_date,
      status: "upcoming",
      key: "tender_query_response_date",
    },
    {
      label: "Bid Submission Deadline",
      description: "Final date and time to submit your bid",
      date: tender.tender_bid_submission_deadline,
      status: "upcoming",
      key: "tender_bid_submission_deadline",
    },
    {
      label: "Technical Bid Opening",
      description: "Date and time when technical bids will be opened",
      date: tender.tender_technical_bid_opening,
      status: "upcoming",
      key: "tender_technical_bid_opening",
    },
    {
      label: "Financial Bid Opening",
      description: "Date and time when financial bids will be opened",
      date: tender.tender_financial_bid_opening,
      status: "upcoming",
      key: "tender_financial_bid_opening",
    },
  ];

  const getStatusColor = (status: string, eventKey: string) => {
    // Special styling for query-related events
    if (queryRelatedEvents.includes(eventKey)) {
      return "bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300 shadow-sm";
    }

    switch (status) {
      case "completed":
        return "bg-emerald-50 border-emerald-200";
      case "active":
        return "bg-slate-50 border-slate-200";
      case "upcoming":
        return "bg-neutral-50 border-neutral-200";
      default:
        return "bg-neutral-50 border-neutral-200";
    }
  };

  const shouldShowTime = (eventKey: string) => datesWithTime.includes(eventKey);

  const isQueryRelatedEvent = (eventKey: string) =>
    queryRelatedEvents.includes(eventKey);

  return (
    <div className='bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden'>
      <div className='px-5 py-4 border-b border-neutral-100'>
        <h2 className='text-sm font-semibold text-slate-900'>
          Timeline & Key Dates
        </h2>
        <p className='text-xs text-slate-600 mt-1'>
          Important dates and deadlines for this tender
        </p>
      </div>

      <div className='p-5'>
        {/* Query Information Box */}
        {(tender.tender_query_deadline ||
          tender.tender_query_response_date) && (
          <div className='mb-5 p-4 rounded-lg bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200'>
            <div className='flex items-start gap-3'>
              <div className='flex-shrink-0 mt-0.5'>
                <div className='p-2 rounded-lg bg-blue-100'>
                  <HelpCircle className='h-5 w-5 text-blue-600' />
                </div>
              </div>
              <div className='flex-1'>
                <h3 className='text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2'>
                  <Info className='h-4 w-4' />
                  Query Submission Process
                </h3>
                <div className='space-y-2'>
                  <p className='text-xs text-blue-800 leading-relaxed'>
                    <span className='font-semibold'>
                      Query Submission Period:
                    </span>{" "}
                    You can submit clarification queries only{" "}
                    <span className='font-bold text-blue-900'>
                      before{" "}
                      {tender.tender_query_deadline
                        ? formatDisplayDateWithWeekday(
                            tender.tender_query_deadline,
                          )
                        : "the query deadline"}
                    </span>
                    .
                  </p>
                  <p className='text-xs text-blue-800 leading-relaxed'>
                    <span className='font-semibold'>Response Timeline:</span>{" "}
                    All answers to submitted queries will be published{" "}
                    <span className='font-bold text-blue-900'>
                      on or before{" "}
                      {tender.tender_query_response_date
                        ? formatDisplayDateWithWeekday(
                            tender.tender_query_response_date,
                          )
                        : "the response date"}
                    </span>
                    .
                  </p>
                  <p className='text-xs text-purple-800 leading-relaxed bg-purple-100/50 p-2 rounded border border-purple-200 mt-3'>
                    <span className='font-semibold'>⚠️ Important:</span> Queries
                    submitted after the deadline will not be entertained. Plan
                    accordingly to receive timely clarifications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='space-y-3'>
          {timelineEvents.map((event, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getStatusColor(
                event.status,
                event.key,
              )}`}>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    {isQueryRelatedEvent(event.key) ? (
                      <HelpCircle className='h-3.5 w-3.5 text-blue-600' />
                    ) : (
                      <Clock className='h-3.5 w-3.5 text-slate-600' />
                    )}
                    <h3
                      className={`font-semibold text-sm ${
                        isQueryRelatedEvent(event.key)
                          ? "text-blue-900"
                          : "text-slate-900"
                      }`}>
                      {event.label}
                    </h3>
                    {isQueryRelatedEvent(event.key) && (
                      <span className='px-2 py-0.5 text-[10px] font-semibold bg-primary text-white rounded-full uppercase tracking-wide'>
                        Query
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs leading-relaxed ml-5 ${
                      isQueryRelatedEvent(event.key)
                        ? "text-blue-800"
                        : "text-slate-600"
                    }`}>
                    {event.description}
                  </p>
                </div>
                <div className='text-right flex-shrink-0'>
                  {event.date ? (
                    <>
                      <div className='flex items-center gap-1.5 justify-end mb-0.5'>
                        <Calendar className='h-3 w-3 text-slate-500' />
                        <p
                          className={`text-sm font-semibold ${
                            isQueryRelatedEvent(event.key)
                              ? "text-blue-900"
                              : "text-slate-900"
                          }`}>
                          {formatDisplayDateWithWeekday(event.date)}
                        </p>
                      </div>
                      {shouldShowTime(event.key) && (
                        <p className='text-xs text-slate-600 font-medium'>
                          {formatDisplayTime12(event.date)}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className='text-sm font-semibold text-neutral-400'>
                      TBD
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Venue and Project Duration */}
        {(tender.tender_opening_venue || tender.tender_project_duration) && (
          <div
            className={`grid gap-3 mt-5 pt-5 border-t border-neutral-100 ${
              tender.tender_opening_venue && tender.tender_project_duration
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1"
            }`}>
            {tender.tender_opening_venue && (
              <div className='p-3.5 rounded-lg bg-slate-50 border border-slate-200'>
                <h3 className='text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2'>
                  Opening Venue
                </h3>
                <p className='text-sm text-slate-700 leading-relaxed mb-1'>
                  {tender.tender_opening_venue}
                </p>
                <p className='text-xs text-slate-600'>
                  Authorized bidders or their representatives may attend the bid
                  opening at this venue
                </p>
              </div>
            )}
            {tender.tender_project_duration && (
              <div className='p-3.5 rounded-lg bg-slate-50 border border-slate-200'>
                <h3 className='text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2'>
                  Project Duration
                </h3>
                <p className='text-sm text-slate-900 font-semibold mb-1'>
                  {tender.tender_project_duration}
                </p>
                <p className='text-xs text-slate-600'>
                  Timeline from contract award to final project completion and
                  handover
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenderTimeline;
