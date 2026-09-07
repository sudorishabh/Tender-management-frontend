import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { LoaderCircle, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { inputStyle } from "@/app/styles";
import { cn } from "@/lib/utils";

const SearchResultBox = ({
  isMobileSearchExpanded,
  setIsMobileSearchExpanded,
}: {
  isMobileSearchExpanded: boolean;
  setIsMobileSearchExpanded: (value: boolean) => void;
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [tenderSearchQuery, setTenderSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, isLoading: isSearchLoading } = trpc.tender.search.useQuery(
    { query: tenderSearchQuery },
    {
      enabled: !!tenderSearchQuery,
    }
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
        setIsMobileSearchExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsMobileSearchExpanded]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTenderSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  function handleResetNav() {
    setSearchInput("");
    setIsMobileSearchExpanded(false);
  }

  function handleTenderSelect(tenderId: number) {
    router.push(`/tender/${tenderId}`);
    setIsSearchFocused(false);
    setIsMobileSearchExpanded(false);
    setSearchInput("");
  }

  function handleMobileSearchToggle() {
    setIsMobileSearchExpanded(!isMobileSearchExpanded);
    if (!isMobileSearchExpanded) {
      setIsSearchFocused(true);
    }
  }

  const searchResults = data?.tenders;

  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        isMobileSearchExpanded ? "w-[20rem]" : "w-auto",
        "md:w-[14rem] lg:w-[18rem]"
      )}
      ref={dropdownRef}>
      {/* Mobile: Show only search icon when not expanded */}
      <div className='sm:hidden'>
        {!isMobileSearchExpanded ? (
          <button
            onClick={handleMobileSearchToggle}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
            <Search className='size-5 text-primary' />
          </button>
        ) : (
          <label
            htmlFor='mobile-search'
            className='rounded-full flex w-full items-center'>
            <div className='w-full'>
              <div className='relative'>
                <input
                  id='mobile-search'
                  className={cn(
                    inputStyle,
                    "h-8 border-0 bg-gray-100 placeholder:text-gray-800 focus:outline-primary/10 transition-all duration-300 text-xs w-full"
                  )}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder='Search tenders...'
                  autoFocus
                />
                {searchInput.length > 0 ? (
                  <span
                    className='absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer hover:bg-gray-200 rounded-lg'
                    onClick={handleResetNav}>
                    <X className='size-6 p-1 text-primary' />
                  </span>
                ) : (
                  <span
                    className='absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer hover:bg-gray-200 rounded-lg'
                    onClick={() => setIsMobileSearchExpanded(false)}>
                    <X className='size-6 p-1 text-primary' />
                  </span>
                )}
              </div>
            </div>
          </label>
        )}
      </div>

      {/* Desktop: Always show search bar */}
      <div className='hidden sm:block'>
        <label
          htmlFor='search'
          className='rounded-full flex w-full items-center'>
          <div className='w-full sm:w-auto sm:flex-1'>
            {searchInput.length > 0 && (
              <X
                className='absolute cursor-pointer right-2.5 top-0.5 size-7 text-gray-700'
                onClick={handleResetNav}
              />
            )}
            <span className='relative'>
              <input
                id='search'
                className={cn(
                  inputStyle,
                  "h-7 md:h-[2.1rem] border-0 bg-gray-100 placeholder:text-gray-800 focus:outline-primary/10 transition-all duration-300 text-xs md:text-sm rounded-md placeholder:text-[13px]"
                )}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder='Search tenders...'
              />
              {searchInput.length > 0 ? (
                <span
                  className='absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer hover:bg-gray-200 rounded-lg'
                  onClick={handleResetNav}>
                  <X className='size-6 p-1 text-primary ' />
                </span>
              ) : (
                <span className='absolute right-1 top-1/2 -translate-y-1/2 rounded-lg'>
                  <Search className='size-6 md:size-[1.6rem] p-1 text-primary ' />
                </span>
              )}
            </span>
          </div>
        </label>
      </div>

      {/* Search Results Dropdown */}
      {(isSearchFocused || isMobileSearchExpanded) &&
        searchInput.length > 0 && (
          <div className='fixed top-[4rem] left-1/2 -translate-x-1/2 w-[90vw] md:w-[80vw] lg:w-[70vw] bg-white rounded-xl shadow-xl border border-gray-300 max-h-[70vh] overflow-y-auto z-[9999]'>
            <div className='p-2'>
              {isSearchLoading ? (
                <div className='flex items-center justify-center py-4'>
                  <LoaderCircle
                    className='animate-spin mr-2'
                    size={16}
                  />
                  <span className='text-sm text-gray-500'>Searching...</span>
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <>
                  <div className='text-xs font-medium text-gray-500 px-3 py-2'>
                    Tenders matching &ldquo;{tenderSearchQuery}&rdquo;
                  </div>
                  {searchResults.map((tender) => (
                    <div
                      key={tender.tender_id}
                      onClick={() => handleTenderSelect(tender.tender_id)}
                      className='flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-md transition-colors'>
                      <div className='p-2 bg-primary/5 rounded-full'>
                        <Search className='size-4 text-primary' />
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-medium text-gray-900 line-clamp-1'>
                          {tender.tender_title}
                        </h4>
                        <div className='flex items-center gap-2 mt-1 text-xs text-gray-500'>
                          <span className='bg-primary/5 text-primary rounded-full px-2 py-0.5'>
                            {tender.tender_type}
                          </span>
                          <span>•</span>
                          <span>{tender.tender_location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className='flex flex-col items-center justify-center py-8 px-4 text-center'>
                  <div className='p-3 bg-gray-100 rounded-full mb-3'>
                    <Search className='size-5 text-gray-400' />
                  </div>
                  <h4 className='font-medium text-gray-900 mb-1'>
                    No tenders found
                  </h4>
                  <p className='text-sm text-gray-500 mb-3'>
                    We couldn&apos;t find any tenders matching &ldquo;
                    {tenderSearchQuery}&rdquo;
                  </p>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleResetNav}
                    className='text-xs'>
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default SearchResultBox;
