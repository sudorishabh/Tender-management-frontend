"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { setActiveTenderTab } from "@/Redux/tender/tenderSlice";
import { cn } from "@/lib/utils";
import { ClipboardList, ClipboardMinus } from "lucide-react";
import { borderStyle } from "@/app/Styles";
import AssignTabSkeleton from "../Shared/skeleton/AssignTabSkeleton";

const HomeTenderTabs = () => {
  const dispatch = useDispatch();
  const { activeTenderTab } = useSelector(
    (state: RootState) => state.tenderSlice
  );
  const { isLoggedIn, isRefreshing } = useSelector(
    (state: RootState) => state.authSlice
  );

  const handleTabChange = (tab: "latest" | "assigned") => {
    dispatch(setActiveTenderTab(tab));
  };

  return (
    <div className={cn("flex items-center border-b mb-1", borderStyle)}>
      <div className='flex'>
        <button
          onClick={() => handleTabChange("latest")}
          className={cn(
            "px-14 py-2.5  font-medium transition-all duration-200 relative flex justify-center items-center gap-1.5",
            activeTenderTab === "latest"
              ? "text-primary"
              : "text-gray-500 hover:text-gray-700"
          )}>
          <ClipboardList className='h-4 w-4' />
          Latest
          {activeTenderTab === "latest" && (
            <span className='absolute -bottom-[1px] left-0 w-full h-0.5 bg-primary'></span>
          )}
        </button>
        {isRefreshing ? (
          <AssignTabSkeleton />
        ) : (
          <>
            {isLoggedIn && (
              <button
                onClick={() => handleTabChange("assigned")}
                className={cn(
                  "px-14 py-2.5 font-medium text-sm transition-all duration-200 relative flex justify-center items-center gap-1.5",
                  activeTenderTab === "assigned"
                    ? "text-primary"
                    : "text-gray-500 hover:text-gray-700"
                )}>
                <ClipboardMinus className='h-4 w-4' />
                Assigned by Admin
                {activeTenderTab === "assigned" && (
                  <span className='absolute bottom-0 left-0 w-full h-0.5 bg-primary'></span>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomeTenderTabs;
