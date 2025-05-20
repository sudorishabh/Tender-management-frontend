import { FC } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { borderStyle } from "@/app/Styles";

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  information?: string;
  className?: string;
  Button?: React.ReactNode;
}

const InfoCard: FC<InfoCardProps> = ({
  title,
  children,
  className = "",
  information,
  Button,
}) => {
  return (
    <div
      className={cn(
        "border rounded-xl shadow-md overflow-hidden bg-white",
        className,
        borderStyle
      )}>
      <div className='flex rounded-t-xl justify-between mb-4 px-4 pb-2 pt-4 border-b bg-gradient-to-r from-primary/10 to-primary/5 items-center '>
        <div className='flex items-center gap-3'>
          <h2 className='text-lg text-gray-900 font-semibold '>{title}</h2>
          {information && (
            <HoverCard openDelay={250}>
              <HoverCardTrigger asChild>
                <Info className='text-gray-700 size-4 mb-1' />
              </HoverCardTrigger>
              <HoverCardContent className='w-[16rem] text-sm '>
                <div className=' space-x-4'>
                  {/* <span className='font-semibold mr-1 text-blue-800'>
                    Note:
                  </span> */}
                  {information}
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
        {Button}
      </div>

      <div className='space-y-4 pb-4 px-4'>
        <span>{children}</span>
      </div>
    </div>
  );
};

export default InfoCard;
