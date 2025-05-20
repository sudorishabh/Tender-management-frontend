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
import { Eye, FilePenLine } from "lucide-react";
import Link from "next/link";
import { capitalizeFirstLetter } from "@/lib/helper";
import { ICategories } from "@/Types/Category-Types";
import { Button } from "@/components/ui/button";

interface Props {
  data: ICategories;
  setIsCategoryDelete: (isVenisCategoryDeletederDelete: string[]) => void;
  isCategoryDelete: string[];
}
const CategoriesTable: FC<Props> = ({
  data,
  isCategoryDelete,
  setIsCategoryDelete,
}) => {
  return (
    <div className='bg-gray-50 shadow p-5 rounded-lg'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-32'>Scope</TableHead>
            <TableHead>Sub Category</TableHead>
            <TableHead>Parent Category</TableHead>
            <TableHead className='w-24 text-center'>Details</TableHead>
            <TableHead className='w-24 text-center'>Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.categories?.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className='text-center text-red-600'>
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data?.categories?.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <Checkbox
                    className='border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600'
                    onCheckedChange={(val) => {
                      if (val) {
                        setIsCategoryDelete([...isCategoryDelete, category.id]);
                      }
                      if (!val) {
                        const arr = isCategoryDelete.filter(
                          (id) => id !== category.id
                        );
                        setIsCategoryDelete(arr);
                      }
                    }}
                  />
                </TableCell>
                <TableCell className='font-medium'>
                  {capitalizeFirstLetter(category.name)}
                </TableCell>
                <TableCell>
                  <span
                    className={`font-medium border-[0.1rem] rounded-sm text-[0.8rem] px-1 ${
                      category && category.status === "active"
                        ? "bg-green-100  text-green-600 border-green-200"
                        : category.status === "inactive"
                        ? "bg-red-100  text-red-600 border-red-200"
                        : ""
                    }`}>
                    {capitalizeFirstLetter(category.status)}
                  </span>
                </TableCell>
                <TableCell className=''>
                  {capitalizeFirstLetter(category.scope)}
                </TableCell>
                <TableCell className=''>
                  {category.is_sub_category ? "Yes" : "No"}
                </TableCell>
                <TableCell>
                  {category.sub_category_main
                    ? category.sub_category_main
                    : "---"}
                </TableCell>

                <TableCell className='text-center'>
                  <Link href={`/admin/categories/${category.id}`}>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='w-full text-accent bg-accent/5 hover:bg-accent/10 hover:text-accent'>
                      <Eye className='size-3.5' /> View
                    </Button>
                  </Link>
                </TableCell>
                <TableCell className='text-center'>
                  <Link href={`/admin/categories/edit/${category.id}`}>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='w-full text-accent bg-accent/5 hover:bg-accent/10 hover:text-accent'>
                      <FilePenLine className='size-3.5' /> Edit
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

export default CategoriesTable;
