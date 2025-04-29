import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationCardProps {
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  onClick: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  description,
  timestamp,
  isRead,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "p-3 flex items-start gap-3 hover:bg-gray-50 cursor-pointer border-b",
        isRead ? "bg-white" : "bg-blue-50"
      )}
      onClick={onClick}>
      <div className='mt-1'>
        <Bell className='size-4 text-gray-500' />
      </div>
      <div className='flex-1'>
        <p className={cn("text-sm font-medium", !isRead && "font-semibold")}>
          {title}
        </p>
        <p className='text-xs text-gray-600 line-clamp-2'>{description}</p>
        <p className='text-xs text-blue-500 mt-1'>{timestamp}</p>
      </div>
      {!isRead && <div className='size-2 bg-blue-500 rounded-full mt-2'></div>}
    </div>
  );
};

export default NotificationCard;
