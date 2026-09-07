import React from "react";
import BackButton from "./Shared/BackButton";
import { Button } from "./ui/button";
import { primaryButtonStyle } from "@/app/styles";
import CustomButton from "./Shared/CustomButton";

interface Props {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showBackButton?: boolean;
  className?: string;
  button?: {
    label: string;
    icon?: React.JSXElementConstructor<React.SVGProps<SVGSVGElement>>;
    onClick?: () => void;
  };
}

const DashboardWrapper: React.FC<Props> = ({
  children,
  title = "",
  description = "",
  showBackButton = false,
  className = "",
  button = undefined,
}) => {
  return (
    <div className={`w-full pt-8 px-8 ${className}`}>
      <div className='w-full mb-6'>
        <div className='flex justify-between items-center mb-4'>
          <div
            aria-label={title || "Page header"}
            className='flex items-center gap-4'>
            {showBackButton && <BackButton />}
            <div>
              {title ? (
                <h1 className='text-lg font-semibold text-gray-700'>{title}</h1>
              ) : null}
              {description ? (
                <p className='text-gray-500 text-[0.8rem] max-w-2xl'>
                  {description}
                </p>
              ) : null}
            </div>
          </div>

          {button && (
            <CustomButton btnName={button.label} variant="primary" LeftIcon={button.icon} onClick={button.onClick} />
          )}

        </div>

        <main className='mt-6'>{children}</main>
      </div>
    </div>
  );
};

export default DashboardWrapper;
