"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, CheckCheck } from "lucide-react";
import NotificationCard from "./NotificationCard";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

// Mock data for notifications
const mockNotifications = [
  {
    id: "1",
    title: "New Tender Published",
    description: "A new tender for IT services has been published.",
    timestamp: "2 hours ago",
    isRead: false,
  },
  {
    id: "2",
    title: "Tender Deadline Approaching",
    description: "Reminder: Tender XYZ deadline is tomorrow.",
    timestamp: "1 day ago",
    isRead: false,
  },
  {
    id: "3",
    title: "Bid Accepted",
    description: "Your bid for tender ABC has been accepted.",
    timestamp: "3 days ago",
    isRead: true,
  },
  {
    id: "4",
    title: "System Maintenance",
    description: "Scheduled maintenance tonight at 2 AM.",
    timestamp: "5 days ago",
    isRead: true,
  },
];

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='relative rounded-full border-gray-200 bg-gray-100 hover:bg-gray-200'>
          <Bell className='size-5 text-gray-600' />
          {unreadCount > 0 && (
            <span className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white'>
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-80 md:w-96 p-0 mr-4 mt-1'
        align='end'>
        <DropdownMenuLabel className='flex justify-between items-center p-3 border-b'>
          <span className='font-semibold'>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant='ghost'
              size='sm'
              className='text-xs h-auto p-1 text-blue-600 hover:text-blue-800'
              onClick={handleMarkAllRead}>
              <CheckCheck className='size-3 mr-1' />
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <ScrollArea className='h-[300px] md:h-[400px]'>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                title={notification.title}
                description={notification.description}
                timestamp={notification.timestamp}
                isRead={notification.isRead}
                onClick={() => handleNotificationClick(notification.id)}
              />
            ))
          ) : (
            <div className='p-4 text-center text-sm text-gray-500'>
              No new notifications
            </div>
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='justify-center p-2 text-sm text-blue-600 hover:!text-blue-800 hover:!bg-gray-100 cursor-pointer'>
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
