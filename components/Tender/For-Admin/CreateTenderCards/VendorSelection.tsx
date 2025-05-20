import React, { FC, useState, useEffect, useRef } from "react";
import {
  formLabelStyle,
  inputStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  secondaryButtonStyle2,
} from "@/app/Styles";
import InfoCard from "@/components/Shared/InfoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  UserCircle,
  Users,
  Tag,
  Save,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  X,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGetVendorsForSelectionQuery } from "@/Redux/vendor/vendorApi";
import { ICategoryName } from "@/Types/Category-Types";
import { capitalizeFirstLetter } from "@/lib/helper";

interface Props {
  setActive: (active: number) => void;
  categoriesData: ICategoryName[];
  vendorSelection: {
    selectedVendors: string[];
    selectedCategories: string[];
  };
  setVendorSelection: (vendorSelection: {
    selectedVendors: string[];
    selectedCategories: string[];
  }) => void;
  handleSaveTender: () => void;
  isSavingTender: boolean;
}

interface Vendor {
  id: string;
  name: string;
  email: string;
  categoryId: string;
  categoryName: string;
  status: string;
}

const VendorSelection: FC<Props> = ({
  setActive,
  categoriesData,
  vendorSelection,
  setVendorSelection,
  handleSaveTender,
  isSavingTender,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use RTK Query to fetch vendors
  const { data: vendorData, isLoading } = useGetVendorsForSelectionQuery({
    categories: vendorSelection.selectedCategories,
    search: searchQuery,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get filtered vendors from API response
  const filteredVendors: Vendor[] = vendorData?.vendors || [];

  // Handle individual vendor selection
  const handleVendorSelect = (vendorId: string, checked: boolean) => {
    if (checked) {
      setVendorSelection({
        ...vendorSelection,
        selectedVendors: [...vendorSelection.selectedVendors, vendorId],
      });
    } else {
      setVendorSelection({
        ...vendorSelection,
        selectedVendors: vendorSelection.selectedVendors.filter(
          (id) => id !== vendorId
        ),
      });
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryName: string) => {
    let categories: string[] = [];

    if (vendorSelection.selectedCategories.includes("all")) {
      categories = [categoryName];
    } else if (vendorSelection.selectedCategories.includes(categoryName)) {
      const filteredCategories = vendorSelection.selectedCategories.filter(
        (category) => category !== categoryName
      );
      categories = filteredCategories.length ? filteredCategories : ["all"];
    } else if (categoryName === "all") {
      categories = ["all"];
    } else {
      categories = [...vendorSelection.selectedCategories, categoryName];
    }

    setVendorSelection({
      selectedVendors: [],
      selectedCategories: categories,
    });
  };

  const getCategoryName = (categoryName: string) => {
    if (categoryName === "all") return "All Categories";
    return (
      categoriesData?.find((c) => c.name === categoryName)?.name || "Unknown"
    );
  };

  // Remove a category from selection
  const removeCategory = (categoryName: string) => {
    const updatedCategories = vendorSelection.selectedCategories.filter(
      (name) => name !== categoryName
    );

    // If no categories are selected, default to "all"
    const categories =
      updatedCategories.length > 0 ? updatedCategories : ["all"];

    setVendorSelection({
      ...vendorSelection,
      selectedCategories: categories,
    });
  };

  return (
    <InfoCard
      title='Vendor Selection'
      information='Select which vendors will receive this tender invitation'
      Button={
        <Button
          type='button'
          className={secondaryButtonStyle2}
          onClick={handleSaveTender}
          disabled={isSavingTender}>
          <Save />
          {isSavingTender ? "Saving..." : "Save as Draft"}
        </Button>
      }>
      <div className='space-y-6'>
        {/* Information banner */}
        <div className='p-4 bg-amber-50 rounded-lg border border-amber-100 flex items-start'>
          <HelpCircle
            size={20}
            className='text-amber-600 mr-3 mt-0.5 flex-shrink-0'
          />
          <div>
            <h3 className='font-medium text-amber-800 mb-1'>
              Sending Tenders to Vendors
            </h3>
            <p className='text-sm text-amber-700'>
              You can select vendors by category or individually. Selected
              vendors will receive a notification about this tender. Only
              verified vendors can be selected.
            </p>
          </div>
        </div>

        {/* Category Selection */}
        <div className='p-5 bg-gray-50 rounded-xl border border-gray-200'>
          <div className='flex items-center gap-2 mb-4 text-gray-700'>
            <Tag size={18} />
            <h3 className='font-semibold'>Filter by Category</h3>
          </div>
          <div className='flex gap-4 flex-col'>
            <div className='flex items-start gap-2'>
              <div className='space-y-2 w-[50%]'>
                <label
                  className={formLabelStyle}
                  htmlFor='category'>
                  Vendor Categories
                </label>
                <div
                  className='relative'
                  ref={dropdownRef}>
                  <div
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`${inputStyle} flex flex-wrap gap-1 min-h-9 cursor-pointer`}>
                    {vendorSelection.selectedCategories.length === 0 ? (
                      <span className='text-gray-500'>
                        Select vendor categories
                      </span>
                    ) : (
                      <div className='flex flex-wrap gap-1'>
                        {vendorSelection.selectedCategories.map(
                          (categoryName) => (
                            <Badge
                              key={categoryName}
                              variant='secondary'
                              className='px-2 bg-primary/15 py-0.5 rounded-md flex items-center gap-1'>
                              {getCategoryName(categoryName)}
                              <X
                                size={14}
                                className='cursor-pointer'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeCategory(categoryName);
                                }}
                              />
                            </Badge>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  {dropdownOpen && (
                    <div className='absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto'>
                      <div
                        className='flex items-center px-2 py-1.5 hover:bg-gray-100 cursor-pointer'
                        onClick={() => {
                          handleCategorySelect("all");
                          setDropdownOpen(false);
                        }}>
                        <Checkbox
                          checked={vendorSelection.selectedCategories.includes(
                            "all"
                          )}
                          className='mr-2'
                        />
                        <span>All Categories</span>
                      </div>
                      {categoriesData?.map((category) => (
                        <div
                          key={category.name}
                          className='flex items-center px-2 py-1.5 hover:bg-gray-100 cursor-pointer'
                          onClick={() => {
                            handleCategorySelect(category.name);
                            setDropdownOpen(false);
                          }}>
                          <Checkbox
                            checked={vendorSelection.selectedCategories.includes(
                              category.name
                            )}
                            className='mr-2'
                          />
                          <span>{capitalizeFirstLetter(category.name)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className='text-xs text-gray-500 mt-1'>
                  Filter vendors by their registered categories
                </p>
              </div>
              <div className='space-y-2 w-[50%]'>
                <label
                  className={formLabelStyle}
                  htmlFor='search'>
                  Search Vendors
                </label>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4' />
                  <Input
                    id='search'
                    className={`${inputStyle} pl-9`}
                    placeholder='Search by name or email'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selection Summary - Moved here for better visibility */}
        <div className='p-4 bg-green-50 rounded-lg border border-green-200 shadow-sm'>
          <div className='flex items-start'>
            <Award
              size={22}
              className='text-green-600 mr-3 mt-0.5 flex-shrink-0'
            />
            <div>
              <h3 className='font-medium text-green-800 mb-1 text-lg'>
                Tender Distribution Summary
              </h3>
              <p className='text-sm text-green-700 font-medium'>
                {vendorSelection.selectedVendors.length > 0 &&
                vendorSelection.selectedCategories.includes("all")
                  ? `This tender will be sent to ${vendorSelection.selectedVendors.length} specifically selected vendor(s).`
                  : null}

                {vendorSelection.selectedVendors.length === 0 &&
                !vendorSelection.selectedCategories.includes("all") &&
                vendorSelection.selectedCategories.length > 0
                  ? "This tender will be sent to all selected categories vendors."
                  : null}

                {vendorSelection.selectedVendors.length > 0 &&
                !vendorSelection.selectedCategories.includes("all") &&
                vendorSelection.selectedCategories.length > 0
                  ? `This tender will be sent to ${vendorSelection.selectedVendors.length} specifically selected vendor(s).`
                  : null}

                {vendorSelection.selectedVendors.length === 0 &&
                vendorSelection.selectedCategories.includes("all")
                  ? "This tender will be sent to all vendors in the system"
                  : null}
              </p>
            </div>
          </div>
        </div>

        {/* Vendor Selection Table */}
        <div className='p-5 bg-gray-50 rounded-xl border border-gray-200'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2 text-gray-700'>
              <Users size={18} />
              <h3 className='font-semibold'>Available Vendors</h3>
            </div>
          </div>

          <div className='rounded-md border min-h-[15rem] max-h-[27rem] overflow-y-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[60px]'>Select</TableHead>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Category</TableHead>
                  {/* <TableHead>Status</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='text-center py-6 text-gray-500'>
                      Loading vendors...
                    </TableCell>
                  </TableRow>
                ) : filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor: Vendor) => {
                    return (
                      <TableRow key={vendor.id}>
                        <TableCell>
                          <Checkbox
                            checked={vendorSelection.selectedVendors.includes(
                              vendor.id
                            )}
                            onCheckedChange={(checked) =>
                              handleVendorSelect(vendor.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell className={`font-medium`}>
                          <div className='flex items-center gap-2'>
                            <UserCircle
                              size={18}
                              className='text-blue-500'
                            />
                            {vendor.name}
                          </div>
                        </TableCell>
                        <TableCell>{vendor.email}</TableCell>
                        <TableCell>
                          {capitalizeFirstLetter(vendor.categoryName)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='text-center py-6 text-gray-500'>
                      No vendors found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className='mt-4 text-sm text-gray-600'>
            {vendorSelection.selectedVendors.length} vendor(s) selected
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className='flex justify-between mt-8'>
          <Button
            type='button'
            variant='outline'
            className={secondaryButtonStyle}
            onClick={() => setActive(5)}>
            <ArrowLeft size={16} />
            Previous Step
          </Button>
          <Button
            type='button'
            className={primaryButtonStyle}
            onClick={() => setActive(7)}>
            Review & Publish
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </InfoCard>
  );
};

export default VendorSelection;
