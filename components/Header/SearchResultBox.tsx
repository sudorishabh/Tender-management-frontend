import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { LoaderCircle, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { useGetSearchResultsQuery } from "@/Redux/tender/tenderApi";
import { inputStyle } from "@/app/Styles";
import { cn } from "@/lib/utils";

interface Tender {
  id: string;
  title: string;
  category: string;
  department: string;
  location: string;
}

const SearchResultBox = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [tenderSearchQuery, setTenderSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, isLoading: isSearchLoading } = useGetSearchResultsQuery(
    tenderSearchQuery,
    {
      skip: !tenderSearchQuery,
    }
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTenderSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  function handleResetNav() {
    setSearchInput("");
  }

  function handleTenderSelect(tenderId: string) {
    router.push(`/tender/${tenderId}`);
    setIsSearchFocused(false);
    setSearchInput("");
  }

  const searchResults = data?.tenders;

  return (
    <div
      className='w-[35rem] relative'
      ref={dropdownRef}>
      <label
        htmlFor='search'
        className='rounded-full flex w-full items-center '>
        <div className='relative w-full sm:w-auto sm:flex-1'>
          <Search className='absolute left-2.5 top-2 h-4 w-4 text-gray-700' />

          {searchInput.length > 0 && (
            <X
              className='absolute cursor-pointer right-2.5 top-0.5 size-7 text-gray-700'
              onClick={handleResetNav}
            />
          )}

          <Input
            id='search'
            className={cn(inputStyle, "h-8")}
            style={{ paddingLeft: "2rem", paddingRight: "2.5rem" }}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder='Search tenders by Title, Category, Location, Department, etc.'
          />
        </div>
      </label>

      {/* Search Results Dropdown */}
      {isSearchFocused && searchInput.length > 0 && (
        <div className='absolute  top-ful left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-[70vh] overflow-y-auto z-[9999]'>
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
                {searchResults.map((tender: Tender) => (
                  <div
                    key={tender.id}
                    onClick={() => handleTenderSelect(tender.id)}
                    className='flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-md transition-colors'>
                    <div className='p-2 bg-primary/5 rounded-full'>
                      <Search className='size-4 text-accent' />
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-medium text-gray-900 line-clamp-1'>
                        {tender.title}
                      </h4>
                      <div className='flex items-center gap-2 mt-1 text-xs text-gray-500'>
                        <span className='bg-primary/5 text-accent rounded-full px-2 py-0.5'>
                          {tender.category}
                        </span>
                        <span>{tender.department}</span>
                        <span>•</span>
                        <span>{tender.location}</span>
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
