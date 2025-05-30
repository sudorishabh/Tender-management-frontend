import React, { FC } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  resetTenderFilterOptions,
  setManageTenderSearchQuery,
  setTenderCategoryAdmin,
  setTenderDepartmentAdmin,
} from "@/Redux/tender/tenderSlice";
import { RootState } from "@/Redux/store";
import { inputStyle } from "@/app/Styles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCategoriesNamesQuery } from "@/Redux/category/categoryApi";
import { departments } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ICategoryName } from "@/Types/Category-Types";

const LiveTendersFilterBar: FC = () => {
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetCategoriesNamesQuery({});

  const {
    tenderAdminFilter: { searchQuery, category, department },
  } = useSelector((state: RootState) => state.tenderSlice);
  const dispatch = useDispatch();
  function handleResetNav() {
    dispatch(resetTenderFilterOptions());
  }

  if (isCategoriesLoading) return null;

  return (
    <div className='sticky border-b bg-white border-accent/10 top-12 z-[1] py-4 px-2 justify-center flex items-center'>
      <div className='flex gap-4 items-center w-full'>
        <div className='flex items-center w-[30rem]'>
          <label
            htmlFor='search'
            className='rounded-lg flex w-full items-center bg-white'>
            <div className='relative w-full sm:w-auto sm:flex-1'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-700' />
              <Input
                id='search'
                className={inputStyle}
                style={{ paddingLeft: "2rem" }}
                value={searchQuery}
                onChange={(e) =>
                  dispatch(setManageTenderSearchQuery(e.target.value))
                }
                placeholder='Search tenders by Title, Category, Location, Department, etc.'
              />
            </div>
          </label>
        </div>
        <div>
          <Select
            value={category}
            onValueChange={(value) => dispatch(setTenderCategoryAdmin(value))}>
            <SelectTrigger
              id='category'
              className={cn(inputStyle, "w-40")}>
              <SelectValue placeholder='Select Category' />
            </SelectTrigger>
            <SelectContent>
              {categoriesData?.categories?.map((category: ICategoryName) => (
                <SelectItem
                  key={category.name}
                  value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={department}
            onValueChange={(value) =>
              dispatch(setTenderDepartmentAdmin(value))
            }>
            <SelectTrigger
              id='department'
              className={cn(inputStyle, "w-44")}>
              <SelectValue placeholder='Select Department' />
            </SelectTrigger>
            <SelectContent align='center'>
              {departments.map((department) => (
                <SelectItem
                  key={department.key}
                  value={department.label}>
                  {department.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant='outline'
          className='py-1.5 px-3 bg-white border border-gray-300 rounded-mmd text-sm text-gray-700 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-primary focus:border-primary'
          onClick={handleResetNav}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default LiveTendersFilterBar;
