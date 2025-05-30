"use client";
import React from "react";
import {
  ArrowUpDown,
  CheckCircle2,
  FileText,
  ShoppingBag,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { borderStyle } from "@/app/Styles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { capitalizeFirstLetter } from "@/lib/helper";
import {
  resetHomeTenderFilterOptions,
  setHomeTenderBudgetRange,
  setHomeTenderCategory,
  setHomeTenderPublishDate,
  setHomeTenderSortBy,
} from "@/Redux/tender/tenderSlice";
const HomeActiveFilter = () => {
  const dispatch = useDispatch();
  const {
    tenderHomeFilter: { category, budgetRange, publishDate, sortBy },
  } = useSelector((state: RootState) => state.tenderSlice);
  return (
    <div
      className={cn(
        "flex w-full flex-row mt-2 pb-5 justify-end items-center",
        borderStyle
      )}>
      <div className='flex flex-wrap gap-2'>
        {category !== "" ||
        budgetRange !== "" ||
        sortBy !== "" ||
        publishDate !== "" ? (
          <span
            className='text-xs  bg-gray-50 font-medium text-gray-700 px-1.5 py-1 rounded-full border border-gray-300 inline-flex items-center gap-1 cursor-pointer'
            onClick={() => dispatch(resetHomeTenderFilterOptions())}>
            Clear All
          </span>
        ) : null}
        <span className='text-xs  bg-blue-50 font-medium text-primary px-1.5 py-1 rounded-full border border-blue-200 inline-flex items-center gap-1'>
          <FileText className='size-3' />
          <span className='mr-0.5'>
            Category:
            {category === "" ? "All" : capitalizeFirstLetter(category)}
          </span>
          {category !== "" && (
            <X
              className='h-5 w-5 bg-blue-200 hover:bg-blue-300 cursor-pointer rounded-full p-0.5'
              onClick={() => dispatch(setHomeTenderCategory(""))}
            />
          )}
        </span>
        <span className='text-xs  bg-green-50 font-medium text-green-700 px-1.5 rounded-full border border-green-200 inline-flex items-center gap-1 '>
          <CheckCircle2 className='size-3' />
          <span className='mr-0.5'>Publication Date:</span>
          {publishDate === ""
            ? "All"
            : publishDate === "week"
            ? "This Week"
            : publishDate === "month"
            ? "This Month"
            : publishDate}
          {publishDate !== "" && (
            <X
              className='h-5 w-5 bg-green-200 hover:bg-green-300 cursor-pointer rounded-full p-0.5'
              onClick={() => dispatch(setHomeTenderPublishDate(""))}
            />
          )}
        </span>
        <span className='text-xs bg-purple-50 font-medium text-purple-700 px-1.5 rounded-full border border-purple-200 inline-flex items-center gap-1'>
          <ShoppingBag className='size-3' />
          <span className='mr-0.5'>Value:</span>
          {budgetRange === ""
            ? "All"
            : budgetRange === "low"
            ? "< ₹10L"
            : budgetRange === "mid"
            ? "₹10L - ₹50L"
            : "> ₹50L"}
          {budgetRange !== "" && (
            <X
              className='h-5 w-5 bg-purple-200 hover:bg-purple-300 cursor-pointer rounded-full p-0.5'
              onClick={() => dispatch(setHomeTenderBudgetRange(""))}
            />
          )}
        </span>
        <span className='text-xs bg-orange-50 font-medium text-orange-700 px-1.5 rounded-full border border-orange-200 inline-flex items-center gap-1'>
          <ArrowUpDown className='size-3' />
          <span className='mr-0.5'>Sort By:</span>
          {sortBy === ""
            ? "Latest"
            : sortBy === "high-to-low"
            ? "Budget (High to Low)"
            : sortBy === "low-to-high"
            ? "Budget (Low to High)"
            : ""}
          {sortBy !== "" && (
            <X
              className='h-5 w-5 bg-yellow-200 hover:bg-yellow-300 cursor-pointer rounded-full p-0.5'
              onClick={() => dispatch(setHomeTenderSortBy(""))}
            />
          )}
        </span>
      </div>
    </div>
  );
};

export default HomeActiveFilter;
