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
import { FC } from "react";
import { capitalizeFirstLetter } from "@/lib/helper";
import { IVendorsTable } from "@/Types/Vendor-Types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import InfiniteScroll from "@/components/Shared/InfiniteScroll";
import { VendorCategory } from "@/Redux/vendor/vendorApi";
interface Props {
  data:
    | {
        vendors?: IVendorsTable[] | VendorCategory[];
        totalVendors: number;
        hasMore: boolean;
        page: number;
      }
    | undefined;
  hasMore: boolean;
  isFetching: boolean;
  refetch: () => void;
  pageRef: React.MutableRefObject<number>;
}

const VendorsTable: FC<Props> = ({
  data,
  hasMore,
  isFetching,
  refetch,
  pageRef,
}) => {
  return (
    <div className='bg-gray-50 p-5 rounded-lg'>
      <ScrollArea className='h-[440px] flex pr-1'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>Status</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Company Type</TableHead>
              <TableHead className='text-center w-24'>Details</TableHead>
              <TableHead className='text-center w-24'>Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.vendors?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className='text-center text-red-600'>
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              <InfiniteScroll
                hasMore={hasMore}
                isFetching={isFetching}
                refetch={refetch}
                pageRef={pageRef}
                asTableRows={true}
                className='flex flex-col gap-2 mb-10'>
                {data?.vendors?.map((vendor: IVendorsTable) => (
                  <TableRow
                    key={vendor.email}
                    className='my-4'>
                    <TableCell>
                      <span
                        className={`font-medium border-[0.1rem] rounded-sm text-[0.8rem] py-0.5 px-2 ${
                          vendor && vendor.status === "pending"
                            ? "bg-orange-100  text-orange-700 border-orange-200"
                            : vendor.status === "approved"
                            ? "bg-green-100  text-green-700 border-green-200"
                            : vendor.status === "rejected"
                            ? "bg-red-100  text-red-700 border-red-200"
                            : ""
                        }`}>
                        {capitalizeFirstLetter(vendor.status)}
                      </span>
                    </TableCell>
                    <TableCell className='text-gray-900'>
                      {capitalizeFirstLetter(vendor.fullname)}
                    </TableCell>
                    <TableCell className='text-gray-900'>
                      {vendor.email}
                    </TableCell>
                    <TableCell className='text-gray-900'>
                      {vendor.businessName}
                    </TableCell>
                    <TableCell className='text-gray-900'>
                      {vendor.businessClassification}
                    </TableCell>
                    <TableCell className='text-center'>
                      <Link href={`/admin/vendors/${vendor.id}`}>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='w-full text-accent bg-accent/5 hover:bg-accent/10 hover:text-accent'>
                          <Eye className='size-3.5' /> View
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell className='text-center'>
                      <Link href={`/admin/vendors/${vendor.id}/edit`}>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='w-full text-accent bg-accent/5 hover:bg-accent/10 hover:text-accent'>
                          <FilePenLine className='size-3.5' /> Edit
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </InfiniteScroll>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default VendorsTable;
