import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Props {
  variant: "primary" | "secondary" | "tertiary";
  onClick?: () => void;
  btnName: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  LeftIcon?: React.JSXElementConstructor<React.SVGProps<SVGSVGElement>>;
  RightIcon?: React.JSXElementConstructor<React.SVGProps<SVGSVGElement>>;
  className?: string;
  isLoading?: boolean;
  fullWidth?: boolean;
}

function CustomButton({
  variant,
  onClick,
  btnName,
  type = "button",
  LeftIcon,
  RightIcon,
  disabled,
  className,
  isLoading = false,
  fullWidth = false,
}: Props) {
  const baseStyle =
    "px-3 h-8 rounded-md font-medium text-xs transition-all duration-200 ease-in-out flex items-center gap-0.5 justify-center";

  let btnStyle;

  switch (variant) {
    case "primary":
      btnStyle =
        "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-sm";
      break;
    case "secondary":
      btnStyle =
        "bg-white border border-primary text-primary hover:bg-primary/10";
      break;
    case "tertiary":
      btnStyle = "bg-primary/15 text-primary hover:bg-primary/25 shadow-none";
      break;
    default:
      btnStyle = "bg-primary text-white hover:bg-primary/90";
  }

  return (
    <Button
      type={type}
      className={cn(baseStyle, btnStyle, className, {
        "w-full": fullWidth,
      })}
      onClick={onClick}
      disabled={isLoading || disabled}>
      {isLoading ? (
        <Loader2 className='w-full animate-spin' />
      ) : (
        <>
          {LeftIcon && <LeftIcon className='mr-2' />}
          {btnName}
          {RightIcon && <RightIcon className='ml-2' />}
        </>
      )}
    </Button>
  );
}

export default CustomButton;
