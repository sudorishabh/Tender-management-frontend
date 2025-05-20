import { Trash } from "lucide-react";
import { FilePenLine } from "lucide-react";
import React, { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IVenderCategoryTable } from "@/Types/Category-Types";
import { capitalizeFirstLetter } from "@/lib/helper";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";

interface Props {
  data: IVenderCategoryTable[];
  id: string;
}

const VendorCategoriesTable: FC<Props> = ({ data, id: vendorId }) => {
  return (
    <div className='bg-gray-50 shadow p-5 rounded-lg'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expires At</TableHead>
            <TableHead className='text-center w-24'>Edit</TableHead>
            <TableHead className='text-center w-24'>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className='text-center -10 text-red-600'>
                No categories available
              </TableCell>
            </TableRow>
          ) : (
            data?.map((category: IVenderCategoryTable) => (
              <TableRow key={category.id}>
                <TableCell className='font-medium'>
                  {capitalizeFirstLetter(category.category)}
                </TableCell>
                <TableCell>
                  <span
                    className={`font-medium border-[0.1rem] rounded-sm text-[0.8rem] py-0.5 px-2 ${
                      category.status === "active"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-red-100 text-red-700 border-red-200"
                    }`}>
                    {capitalizeFirstLetter(category.status)}
                  </span>
                </TableCell>
                <TableCell>
                  {format(category.expires_at, "dd MMM yyyy")}
                </TableCell>
                <TableCell className='text-center'>
                  <Link
                    href={`/admin/vendors/${vendorId}/category/edit/${category?.id}`}>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='w-full text-accent bg-accent/5 hover:bg-accent/10 hover:text-accent'>
                      <FilePenLine className='size-3.5' /> Edit
                    </Button>
                  </Link>
                </TableCell>
                <TableCell className='text-center'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full text-red-800 bg-red-100 hover:bg-red-200 hover:text-red-800'>
                    <Trash className='size-3.5' /> Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default VendorCategoriesTable;
