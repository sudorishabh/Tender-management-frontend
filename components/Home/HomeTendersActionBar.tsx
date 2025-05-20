import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  ChevronDown,
  Filter,
  SlidersHorizontal,
  ArrowRight,
  DollarSign,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { borderStyle } from "@/app/Styles";
import { useDispatch, useSelector } from "react-redux";
import {
  setHomeTenderBudgetRange,
  setHomeTenderPublishDate,
  setHomeTenderStatus,
  setHomeTenderCategory,
  setHomeTenderSortBy,
} from "@/Redux/tender/tenderSlice";
import { RootState } from "@/Redux/store";
import { ICategoryName } from "@/Types/Category-Types";
import { capitalizeFirstLetter } from "@/lib/helper";

const HomeTendersActionBar = ({
  categories,
  isCategoriesLoading,
}: {
  categories: ICategoryName[];
  isCategoriesLoading: boolean;
}) => {
  const dispatch = useDispatch();
  const {
    tenderHomeFilter: { category, budgetRange, publishDate, status, sortBy },
  } = useSelector((state: RootState) => state.tenderSlice);
  return (
    <div
      className={cn(
        "flex bg-white border-b items-center w-full justify-between sticky top-12 -mt-4 py-4 px-2 z-[1]",
        borderStyle
      )}>
      <div className='flex flex-wrap gap-3 items-center rounded-mmd'>
        <div>
          <Select
            onValueChange={(value) => dispatch(setHomeTenderCategory(value))}
            value={category}>
            <SelectTrigger className='border-gray-200 rounded-mmd bg-white hover:bg-gray-50 w-48'>
              <div className='flex items-center gap-2'>
                <Filter className='h-4 w-4 text-blue-600' />
                <SelectValue placeholder='Filter by Category' />
              </div>
            </SelectTrigger>
            {!isCategoriesLoading ? (
              <SelectContent className='rounded-mmd z-[700] border-gray-200 shadow-md'>
                <SelectGroup>
                  <SelectLabel className='text-gray-500'>
                    Categories
                  </SelectLabel>
                  {categories?.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.name}>
                      {capitalizeFirstLetter(category.name)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            ) : (
              <SelectContent className='rounded-mmd z-[700] border-gray-200 shadow-md'>
                <SelectGroup>
                  <SelectLabel className='text-gray-500'>
                    Categories
                  </SelectLabel>
                </SelectGroup>
              </SelectContent>
            )}
          </Select>
        </div>

        {/* Location Dropdown */}
        <div>
          <Select
            onValueChange={(value) => dispatch(setHomeTenderBudgetRange(value))}
            value={budgetRange}>
            <SelectTrigger className='border-gray-200 w-48 rounded-mmd bg-white hover:bg-gray-50'>
              <div className='flex items-center gap-2'>
                <DollarSign className='h-4 w-4 text-green-600' />
                <SelectValue placeholder='Budget Range' />
              </div>
            </SelectTrigger>
            <SelectContent className='rounded-mmd z-[700] border-gray-200 shadow-md'>
              <SelectGroup>
                <SelectLabel className='text-gray-500'>Range</SelectLabel>
                <SelectItem value='low'>&lt; 10 Lakhs</SelectItem>
                <SelectItem value='mid'>10-50 Lakhs</SelectItem>
                <SelectItem value='high'>&gt; 50 Lakhs</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              className='flex items-center rounded-mmd gap-2 bg-white border-gray-200 hover:bg-gray-50 w-48'>
              <SlidersHorizontal className='h-4 w-4 text-purple-600' />
              <span>Advanced Filters</span>
              <ChevronDown className='h-4 w-4 ml-1 text-gray-400' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='center'
            className='w-64 rounded-mmd z-[700] border-gray-200 shadow-md'>
            <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='flex items-center gap-2 cursor-pointer'>
              <span className='w-32'>Status</span>
              <Select
                onValueChange={(value) => dispatch(setHomeTenderStatus(value))}
                value={status}
                disabled={true}>
                <SelectTrigger className='h-7 min-h-0 ml-auto w-28 text-xs rounded-mmd'>
                  <SelectValue placeholder='Any' />
                </SelectTrigger>
                <SelectContent className='z-[800]'>
                  <SelectItem value='open'>Open</SelectItem>
                </SelectContent>
              </Select>
            </DropdownMenuItem>
            <DropdownMenuItem className='flex items-center gap-2 cursor-pointer'>
              <span className='w-32'>Publication Date</span>
              <Select
                onValueChange={(value) =>
                  dispatch(setHomeTenderPublishDate(value))
                }
                value={publishDate}>
                <SelectTrigger className='h-7 min-h-0 ml-auto w-28 text-xs rounded-mmd'>
                  <SelectValue placeholder='Any' />
                </SelectTrigger>
                <SelectContent className='z-[800] rounded-mmd'>
                  <SelectItem value='today'>Today</SelectItem>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                </SelectContent>
              </Select>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className='px-2 py-1.5'>
              <Button className='w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 rounded-mmd'>
                Apply Filters
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='flex items-center gap-2 hover:bg-gray-100 text-gray-700'>
              <span className='text-sm'>Sort by</span>
              <ChevronDown className='h-4 w-4 text-gray-500' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='w-48 border-gray-200 shadow-md z-[700] rounded-mmd '
            sideOffset={8}>
            <DropdownMenuItem
              className={`flex items-center gap-2 cursor-pointer ${
                sortBy === "latest" ? "text-blue-600" : ""
              } font-medium`}
              onClick={() => dispatch(setHomeTenderSortBy("latest"))}>
              {sortBy === "latest" ? (
                <ArrowRight className='h-3.5 w-3.5' />
              ) : (
                <ArrowRight className='h-3.5 w-3.5 opacity-0' />
              )}
              Latest
            </DropdownMenuItem>

            <DropdownMenuItem
              className={`flex items-center gap-2 cursor-pointer ${
                sortBy === "high-to-low" ? "text-blue-600" : ""
              } font-medium`}
              onClick={() => dispatch(setHomeTenderSortBy("high-to-low"))}>
              {sortBy === "high-to-low" ? (
                <ArrowRight className='h-3.5 w-3.5' />
              ) : (
                <ArrowRight className='h-3.5 w-3.5 opacity-0' />
              )}
              Budget (High to Low)
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`flex items-center gap-2 cursor-pointer ${
                sortBy === "low-to-high" ? "text-blue-600" : ""
              } font-medium`}
              onClick={() => dispatch(setHomeTenderSortBy("low-to-high"))}>
              {sortBy === "low-to-high" ? (
                <ArrowRight className='h-3.5 w-3.5' />
              ) : (
                <ArrowRight className='h-3.5 w-3.5 opacity-0' />
              )}
              Budget (Low to High)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default HomeTendersActionBar;
