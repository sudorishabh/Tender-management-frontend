"use client";
import React, { useState } from "react";
import { use } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  SearchX,
  ThumbsDown,
  ThumbsUp,
  Trophy,
  ArrowLeft,
  Building,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
import PageLoading from "@/components/Shared/PageLoading";
import { primaryButtonStyle, secondaryButtonStyle2 } from "@/app/Styles";
import {
  useGetSelectedBidsQuery,
  useGetRejectedBidsQuery,
} from "@/Redux/bid/bidApi";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import SelectedBidsTable from "@/components/Bid/For-Admin/SelectedBidsTable";
import RejectedBidsTable from "@/components/Bid/For-Admin/RejectedBidsTable";
import BidRankingDialog from "@/components/Bid/For-Admin/BidRankingDialog";

const ReviewedBids = ({
  params,
}: {
  params: Promise<{ tenderId: string }>;
}) => {
  const [activeTab, setActiveTab] = useState("selected");
  const { tenderId } = use(params);
  const router = useRouter();
  const { data: selectedBids, isLoading: isSelectedBidsLoading } =
    useGetSelectedBidsQuery(tenderId);
  const { data: rejectedBids, isLoading: isRejectedBidsLoading } =
    useGetRejectedBidsQuery(tenderId, { skip: activeTab === "selected" });
  const [rankedBidsDialogOpen, setRankedBidsDialogOpen] = useState(false);

  return (
    <AdminPagesWrapper>
      <div className='w-full bg-white mb-7'>
        <div className='container mx-auto px-6 pt-8'>
          <div className='flex justify-between items-center mb-4'>
            <div className='flex items-center gap-4'>
              <button
                onClick={() => router.back()}
                className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'>
                <ArrowLeft className='size-6' />
              </button>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>
                  Reviewed Bids
                </h1>
                <p className='text-gray-600 mt-2 max-w-2xl'>
                  Manage bids that have been reviewed for this tender. You can
                  rank selected bids and communicate with vendors.
                </p>
              </div>
            </div>
            <Button
              className={primaryButtonStyle}
              onClick={() => router.push(`/admin/live/${tenderId}/bid`)}>
              <FileText size={16} />
              Rate and Review Bids
            </Button>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-6 mb-12'>
        <Tabs
          defaultValue='selected'
          value={activeTab}
          onValueChange={setActiveTab}
          className='w-full'>
          <TabsList className='bg-gray-100 rounded-full p-1'>
            <TabsTrigger
              value='selected'
              className='data-[state=active]:bg-primary data-[state=active]:text-white px-6 rounded-full'>
              <ThumbsUp className='h-4 w-4 mr-2' />
              Selected Bids
            </TabsTrigger>
            <TabsTrigger
              value='rejected'
              className='data-[state=active]:bg-primary data-[state=active]:text-white px-6 rounded-full'>
              <ThumbsDown className='h-4 w-4 mr-2' />
              Rejected Bids
            </TabsTrigger>
          </TabsList>

          <TabsContent value='selected'>
            <div className='p-4 bg-gray-50 border-b flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Users
                  size={18}
                  className='text-primary'
                />
                <h2 className='font-semibold text-gray-900'>Selected Bids</h2>
              </div>
              <div className='flex items-center gap-4 text-sm text-gray-500'>
                <div className='flex items-center gap-2 text-sm text-gray-500'>
                  <Building
                    size={16}
                    className='text-gray-400'
                  />
                  <span>Total Selected Bids: ${selectedBids?.bids.length}</span>
                </div>
                <Button
                  className={cn(secondaryButtonStyle2, "h-8")}
                  onClick={() => setRankedBidsDialogOpen(true)}>
                  <Trophy className='h-4 w-4' />
                  View Ranked Bids
                </Button>
              </div>
            </div>
            {isSelectedBidsLoading ? (
              <PageLoading />
            ) : (
              <div className='bg-gray-50 shadow p-5 rounded-lg'>
                {selectedBids?.bids.length === 0 ? (
                  <div className='bg-white p-16 flex flex-col items-center justify-center rounded-md'>
                    <SearchX className='mx-auto h-12 w-12 text-gray-400 mb-4' />
                    <h3 className='text-xl font-medium text-gray-900 mb-2'>
                      No Selected Bids Found
                    </h3>
                    <p className='text-gray-500 max-w-md mx-auto'>
                      There are no selected bids for this tender or matching
                      your search criteria.
                    </p>
                  </div>
                ) : (
                  <SelectedBidsTable
                    bids={selectedBids?.bids}
                    tenderId={tenderId}
                  />
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value='rejected'>
            <div className='p-4 bg-gray-50 border-b flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Users
                  size={18}
                  className='text-primary'
                />
                <h2 className='font-semibold text-gray-900'>Rejected Bids</h2>
              </div>
              <div className='flex items-center gap-4 text-sm text-gray-500'>
                <div className='flex items-center gap-2 text-sm text-gray-500'>
                  <Building
                    size={16}
                    className='text-gray-400'
                  />
                  <span>Total Rejected Bids: ${selectedBids?.bids.length}</span>
                </div>
              </div>
            </div>
            {isRejectedBidsLoading ? (
              <PageLoading />
            ) : (
              <div className='bg-gray-50 shadow p-5 rounded-lg'>
                {rejectedBids?.bids?.length === 0 ? (
                  <div className='bg-white p-16 flex flex-col items-center justify-center rounded-md'>
                    <SearchX className='mx-auto h-12 w-12 text-gray-400 mb-4' />
                    <h3 className='text-xl font-medium text-gray-900 mb-2'>
                      No Rejected Bids Found
                    </h3>
                    <p className='text-gray-500 max-w-md mx-auto'>
                      There are no rejected bids for this tender or matching
                      your search criteria.
                    </p>
                  </div>
                ) : (
                  <RejectedBidsTable
                    bids={rejectedBids?.bids}
                    tenderId={tenderId}
                  />
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Message Dialog */}

      {/* Ranked Bids Dialog */}
      <BidRankingDialog
        tenderId={tenderId}
        rankedBidsDialogOpen={rankedBidsDialogOpen}
        setRankedBidsDialogOpen={setRankedBidsDialogOpen}
        // selectedBids={selectedBids}
      />
    </AdminPagesWrapper>
  );
};

export default ReviewedBids;
