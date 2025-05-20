"use client";
import React, { FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Star } from "lucide-react";
import Link from "next/link";
import { capitalizeFirstLetter } from "@/lib/helper";
import { IBidsResponse } from "@/Types/Bid-Types";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Props {
  data: IBidsResponse;
  setIsBidDelete: (isBidDelete: string[]) => void;
  isBidDelete: string[];
}

const BidsTable: FC<Props> = ({ data, isBidDelete, setIsBidDelete }) => {
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-600 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-600 border-red-200";
      case "under_review":
        return "bg-yellow-100 text-yellow-600 border-yellow-200";
      case "reviewed":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "awarded":
        return "bg-purple-100 text-purple-600 border-purple-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const formatStatus = (status: string) => {
    return capitalizeFirstLetter(status.replace(/_/g, " "));
  };

  return (
    <div className='bg-gray-50 shadow p-5 rounded-lg'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Tender</TableHead>
            <TableHead>DD Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className='text-center'>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.bids?.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className='text-center text-red-600'>
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data?.bids?.map((bid) => (
              <TableRow key={bid.id}>
                <TableCell>
                  <Checkbox
                    className='border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600'
                    onCheckedChange={(val) => {
                      if (val) {
                        setIsBidDelete([...isBidDelete, bid.id]);
                      }
                      if (!val) {
                        const arr = isBidDelete.filter((id) => id !== bid.id);
                        setIsBidDelete(arr);
                      }
                    }}
                  />
                </TableCell>
                <TableCell className='font-medium'>
                  {bid.business_name}
                </TableCell>
                <TableCell>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium'>
                      {bid.tender_title}
                    </span>
                    <span className='text-xs text-gray-500'>
                      {bid.tender_number}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{bid.dd_number}</TableCell>
                <TableCell>
                  <span
                    className={`font-medium border-[0.1rem] rounded-sm text-[0.8rem] px-1 ${getStatusClass(
                      bid.status
                    )}`}>
                    {formatStatus(bid.status)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-1'>
                    <Star className='h-3.5 w-3.5 text-yellow-500 fill-yellow-500' />
                    <span className='font-medium'>
                      {Number(bid.total_score).toFixed(1)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(bid.created_at), "dd/MM/yyyy")}
                </TableCell>
                <TableCell className='text-center'>
                  <Link
                    href={`/admin/tenders/bids/details/${bid.tender_id}/${bid.id}`}>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='w-full text-accent bg-accent/5 hover:bg-accent/10 hover:text-accent'>
                      <Eye className='size-3.5' /> View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BidsTable;
