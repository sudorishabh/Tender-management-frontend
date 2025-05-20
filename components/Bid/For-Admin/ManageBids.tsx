import { Button } from "@/components/ui/button";
import { LoaderCircle, Trash, Receipt, SearchX, Building } from "lucide-react";
import React, { FC } from "react";
import BidsTable from "@/components/Bid/For-Admin/BidsTable";
import { IBidsResponse } from "@/Types/Bid-Types";

interface Props {
  data: IBidsResponse;
  handleDeleteBids: () => void;
  deletingMultiple: boolean;
  isBidDelete: string[];
  setIsBidDelete: (isBidDelete: string[]) => void;
}

const ManageBids: FC<Props> = ({
  data,
  handleDeleteBids,
  deletingMultiple,
  isBidDelete,
  setIsBidDelete,
}) => {
  return (
    <div>
      <div className='w-full bg-white border-b mb-8'>
        <div className='container mx-auto px-6 py-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Manage Bids</h1>
          <p className='text-gray-600 mt-2 max-w-2xl'>
            Review and manage all bid submissions across tenders. Evaluate
            technical and financial scores, update status, and track vendor
            performance.
          </p>
        </div>
      </div>

      <div className='container mx-auto px-6 space-y-6 mb-12'>
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
          <div className='p-4 bg-gray-50 border-b flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Receipt
                size={18}
                className='text-primary'
              />
              <h2 className='font-semibold text-gray-900'>Bids</h2>
            </div>

            <div className='flex items-center gap-4'>
              <div className='flex mr-4 items-center gap-2 text-sm text-gray-500'>
                <Building
                  size={16}
                  className='text-gray-400'
                />
                <span>Total Bids: {data?.bids?.length || 0}</span>
              </div>
              {isBidDelete.length > 0 && (
                <Button
                  className='flex items-center gap-2 rounded-md bg-red-200 hover:bg-red-300 text-red-900'
                  onClick={handleDeleteBids}
                  disabled={deletingMultiple}>
                  {deletingMultiple ? (
                    <LoaderCircle className='animate-spin size-4' />
                  ) : (
                    <Trash className='size-4' />
                  )}
                  Delete Selected ({isBidDelete.length})
                </Button>
              )}
            </div>
          </div>

          {data?.bids?.length ? (
            <BidsTable
              data={data}
              setIsBidDelete={setIsBidDelete}
              isBidDelete={isBidDelete}
            />
          ) : (
            <div className='bg-white p-20 flex flex-col items-center justify-center'>
              <SearchX
                className='mb-4 text-gray-400'
                size={48}
              />
              <h3 className='text-gray-700 font-medium text-lg mb-1'>
                No bids found
              </h3>
              <p className='text-gray-500'>
                There are no bids in the system yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBids;
