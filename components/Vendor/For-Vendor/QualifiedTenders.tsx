"use client";
import React, { useState } from "react";
import TenderCard from "@/components/Tender/TenderCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import InfoCard from "@/components/Shared/InfoCard";
import { ITenderCard } from "@/app/Types/Tender-Types";

const QualifiedTenders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  // Mock data - would come from an API in a real app
  const mockTenders: Partial<ITenderCard>[] = [
    {
      id: "1",
      title: "Development of Solar Power System for TERI Campus",
      type: "works",
      category: "Energy",
      department: "Energy Division",
      location: "Delhi",
      scope: "National",
      status: "live",
      tenderNumber: "10001",
      bidEndDate: "2023-12-31",
      documentFee: "1500",
      emd: "25000",
    },
    {
      id: "2",
      title: "Supply of Laboratory Equipment for Environmental Testing",
      type: "goods",
      category: "Equipment",
      department: "Environment Division",
      location: "Bangalore",
      scope: "National",
      status: "live",
      tenderNumber: "10002",
      bidEndDate: "2023-11-15",
      documentFee: "1000",
      emd: "15000",
    },
  ];

  // Filter and search tenders
  const filteredTenders = mockTenders
    .filter((tender) => filter === "all" || tender.status === filter)
    .filter(
      (tender) =>
        tender.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tender.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold mb-6'>Qualified Tenders</h1>

      <div className='flex flex-col md:flex-row gap-4 mb-8'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
          <Input
            placeholder='Search tenders...'
            className='pl-10'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={filter}
          onValueChange={setFilter}>
          <SelectTrigger className='w-full md:w-[180px]'>
            <SelectValue placeholder='Filter Status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Tenders</SelectItem>
            <SelectItem value='live'>Live</SelectItem>
            <SelectItem value='closed'>Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredTenders.length > 0 ? (
        <div className='flex flex-col gap-5 mb-10'>
          {filteredTenders.map((tender) => (
            <div
              className='relative max-w-[55rem]'
              key={tender.id}>
              <TenderCard tender={tender as ITenderCard} />
              <span className='absolute bg-green-100 border-green-200 border text-[0.75rem] rounded-tl-xl text-green-800 rounded px-2 -top-0 -left-0'>
                Qualified
              </span>
            </div>
          ))}
        </div>
      ) : (
        <InfoCard
          title='No Qualified Tenders'
          className='bg-gray-50'>
          <p className='text-center py-6 text-gray-500'>
            No qualified tenders match your search criteria. Try adjusting your
            filters or search query.
          </p>
        </InfoCard>
      )}
    </div>
  );
};

export default QualifiedTenders;
