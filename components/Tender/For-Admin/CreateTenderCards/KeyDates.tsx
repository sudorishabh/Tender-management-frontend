import { Calendar } from "@/components/ui/calendar";
import React, { FC } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  CalendarIcon,
  Calendar as CalendarIcon2,
  Clock,
  HelpCircle,
  InfoIcon,
  Save,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  formLabelStyle,
  inputStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  secondaryButtonStyle2,
} from "@/app/Styles";
import { useFormContext } from "react-hook-form";
import InfoCard from "@/components/Shared/InfoCard";

interface Props {
  setActive: (active: number) => void;
  handleSaveTender: () => void;
  isSavingTender: boolean;
}

const keyDateDescriptions = [
  {
    key: "prePublishDate",
    name: "Pre-Publish Date",
    description:
      "The date when minimal tender information will be shown as 'Coming Soon'. Vendors can set alerts and bookmark it.",
    icon: (
      <CalendarIcon2
        size={16}
        className='text-blue-500'
      />
    ),
  },
  {
    key: "publishDate",
    name: "Publish Date",
    description:
      "The official publication date when the complete tender details become visible to vendors.",
    icon: (
      <CalendarIcon2
        size={16}
        className='text-green-500'
      />
    ),
  },
  {
    key: "tenderSaleCloseDate",
    name: "Tender Sale Close Date",
    description:
      "The final date after which new vendors cannot apply to participate in the tender.",
    icon: (
      <Clock
        size={16}
        className='text-orange-500'
      />
    ),
  },
  {
    key: "clarificationStartDate",
    name: "Clarification Start Date",
    description:
      "The date from which vendors can begin submitting questions about the tender.",
    icon: (
      <CalendarIcon2
        size={16}
        className='text-purple-500'
      />
    ),
  },
  {
    key: "clarificationEndDate",
    name: "Clarification End Date",
    description:
      "The deadline after which no new questions about the tender will be accepted.",
    icon: (
      <Clock
        size={16}
        className='text-red-500'
      />
    ),
  },
  {
    key: "revisionPublishmentDate",
    name: "Revision Publication Date",
    description:
      "The date when any amendments or updates to the tender will be published.",
    icon: (
      <CalendarIcon2
        size={16}
        className='text-indigo-500'
      />
    ),
  },
  {
    key: "bidSubmissionEndDate",
    name: "Bid Submission Deadline",
    description:
      "The final date and time by which all bids must be submitted. No late submissions will be accepted.",
    icon: (
      <Clock
        size={16}
        className='text-red-600'
      />
    ),
  },
  {
    key: "bidOpenDate",
    name: "Bid Opening Date",
    description:
      "The date when submitted bids will be opened, evaluated, and results announced.",
    icon: (
      <CalendarIcon2
        size={16}
        className='text-emerald-500'
      />
    ),
  },
];

const KeyDates: FC<Props> = ({
  setActive,
  handleSaveTender,
  isSavingTender,
}) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  // Helper function to safely get error messages
  const getErrorMessage = (path: string) => {
    // Type-safe way to get nested errors
    const pathParts = path.split(".");
    let current = errors as Record<string, unknown>;

    // Navigate the error object path
    for (const part of pathParts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part] as Record<string, unknown>;
      } else {
        return undefined;
      }
    }

    return current?.message?.toString();
  };

  function setDateFun(date: Date | undefined, key: string) {
    setValue(key, date, { shouldValidate: true });
  }

  return (
    <InfoCard
      title='Key Tender Dates'
      information='Define the timeline for your tender process'
      Button={
        <Button
          type='button'
          className={secondaryButtonStyle2}
          onClick={handleSaveTender}
          disabled={isSavingTender}>
          <Save />
          {isSavingTender ? "Saving..." : "Save as Draft"}
        </Button>
      }>
      <div className='space-y-6'>
        <div className='p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start'>
          <HelpCircle
            size={20}
            className='text-blue-600 mr-3 mt-0.5 flex-shrink-0'
          />
          <div>
            <h3 className='font-medium text-blue-800 mb-1'>
              Important Timeline Information
            </h3>
            <p className='text-sm text-blue-700'>
              Setting clear dates for each phase of the tender ensures all
              participants understand the timeline. Vendors will receive
              notifications about these dates, so accuracy is essential.
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          {keyDateDescriptions?.map((keyDate, i) => (
            <div
              key={i}
              className='bg-gray-50 border border-gray-200 rounded-xl overflow-hidden'>
              <div className='bg-gray-100 py-3 px-4 flex items-center gap-2'>
                {keyDate.icon}
                <h3 className='text-gray-800 font-medium'>{keyDate.name}</h3>
              </div>

              <div className='p-4'>
                <div className='flex flex-col gap-3'>
                  <div className='space-y-2'>
                    <label
                      className={`${formLabelStyle} flex items-center gap-1`}>
                      Select Date
                      <span className='text-red-500'>*</span>
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            inputStyle,
                            "w-full justify-start text-left font-normal",
                            !watch(`keyDates.${keyDate.key}`) &&
                              "text-muted-foreground"
                          )}>
                          {watch(`keyDates.${keyDate.key}`) ? (
                            format(
                              new Date(watch(`keyDates.${keyDate.key}`)),
                              "PPP"
                            )
                          ) : (
                            <span>Select a date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className='w-auto p-0'
                        align='start'>
                        <Calendar
                          mode='single'
                          selected={
                            watch(`keyDates.${keyDate.key}`)
                              ? new Date(watch(`keyDates.${keyDate.key}`))
                              : undefined
                          }
                          onSelect={(e) =>
                            setDateFun(e, `keyDates.${keyDate.key}`)
                          }
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {getErrorMessage(`keyDates.${keyDate.key}`) && (
                      <p className='text-red-500 text-xs mt-1'>
                        {getErrorMessage(`keyDates.${keyDate.key}`)}
                      </p>
                    )}
                  </div>

                  <div className='flex items-start gap-2 mt-1'>
                    <InfoIcon
                      size={14}
                      className='text-gray-400 mt-0.5 flex-shrink-0'
                    />
                    <p className='text-gray-600 text-xs'>
                      {keyDate.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='flex justify-between mt-8'>
          <Button
            type='button'
            className={secondaryButtonStyle}
            onClick={() => setActive(2)}>
            <ArrowLeft size={16} /> Previous Step
          </Button>
          <Button
            type='button'
            className={primaryButtonStyle}
            onClick={() => setActive(4)}>
            Continue to Fee Details <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </InfoCard>
  );
};

export default KeyDates;
