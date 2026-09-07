import React, { FC } from "react";
import { FileText, Building, FileUp, Check, ChevronRight } from "lucide-react";

const registrationSteps = [
  {
    title: "Personal Information",
    icon: FileText,
    description: "Basic account details",
  },
  {
    title: "Business Information",
    icon: Building,
    description: "Company and address details",
  },
  {
    title: "Document Upload",
    icon: FileUp,
    description: "Required verification documents",
  },
];

interface Props {
  active: number;
  setActive: (active: number) => void;
}

const RegistrationNavSidebar: FC<Props> = ({ active, setActive }) => {
  const progress = (active / (registrationSteps.length - 1)) * 100;

  return (
    <div className='w-full lg:w-80 shrink-0'>
      <div className='sticky top-24 bg-white rounded-xl shadow-lg shadow-gray-200 border border-gray-100 overflow-hidden'>
        {/* Header with progress */}
        <div className='p-5 bg-gradient-to-br bg-gray-50/60  border-b border-gray-100'>
          <div className='flex items-center justify-between mb-3'>
            <h2 className='font-semibold text-gray-900'>Registration Steps</h2>
            <span className='text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full'>
              Step {active + 1} of {registrationSteps.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className='w-full h-1.5 bg-gray-200 rounded-full overflow-hidden'>
            <div
              className='h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps list */}
        <div className='p-3'>
          {registrationSteps?.map((step, i) => {
            const Icon = step.icon;
            const isCompleted = i < active;
            const isCurrent = i === active;
            const isClickable = i < active;

            return (
              <div
                key={step.title}
                className={`group relative flex items-center gap-4 rounded-xl p-4 transition-all duration-200
                  ${isClickable ? "cursor-pointer" : "cursor-default"}
                  ${
                    isCurrent
                      ? "bg-primary/5 ring-1 ring-primary/20"
                      : isClickable
                      ? "hover:bg-gray-50"
                      : "opacity-60"
                  }`}
                onClick={() => {
                  if (isClickable) setActive(i);
                }}>
                {/* Connector line */}
                {i < registrationSteps.length - 1 && (
                  <div
                    className={`absolute left-[1.85rem] top-14 w-0.5 h-6 transition-colors duration-300
                    ${isCompleted ? "bg-green-400" : "bg-gray-200"}
                  `}
                  />
                )}

                {/* Step indicator */}
                <div
                  className={`relative flex items-center justify-center rounded-xl w-10 h-10 transition-all duration-300 shrink-0
                    ${
                      isCompleted
                        ? "bg-green-500 text-white shadow-md shadow-green-500/30"
                        : isCurrent
                        ? "bg-primary text-white shadow-md shadow-primary/30"
                        : "bg-gray-100 text-gray-400"
                    }`}>
                  {isCompleted ? (
                    <Check
                      size={18}
                      strokeWidth={2.5}
                    />
                  ) : (
                    <Icon size={18} />
                  )}
                </div>

                {/* Step content */}
                <div className='flex-1 min-w-0'>
                  <p
                    className={`font-medium text-sm transition-colors duration-200
                      ${
                        isCurrent
                          ? "text-primary"
                          : isCompleted
                          ? "text-gray-900"
                          : "text-gray-500"
                      }`}>
                    {step.title}
                  </p>
                  <p className='text-xs text-gray-500 mt-0.5 truncate'>
                    {step.description}
                  </p>
                </div>

                {/* Arrow indicator for clickable items */}
                {isClickable && (
                  <ChevronRight
                    size={16}
                    className='text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200'
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Help section */}
        <div className='mx-3 mb-3 p-4 bg-gradient-to-br from-primary/5 to-indigo-50/50 rounded-xl border border-primary/50'>
          <p className='text-xs font-medium text-gray-700 mb-1'>Need help?</p>
          <p className='text-xs text-gray-500 leading-relaxed'>
            Contact our support team for assistance with your registration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationNavSidebar;
