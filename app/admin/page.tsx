"use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useEffect, useState } from "react";
import {
  // BriefcaseBusiness,
  // Building2,
  // BarChartHorizontalBig,
  // Clock,
  // Coins,
  // FileArchive,
  FilePlus2,
  // FileText,
  // Trophy,
  // Users,
  // LayoutDashboard,
  // BarChart4,
  // TrendingUp,
  // ClipboardList,
  // PieChart,
} from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Progress } from "@/components/ui/progress";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
import { primaryButtonStyle } from "@/app/Styles";

// Mock data for demonstration (will need to be replaced with actual API calls)
// const mockStats = {
//   totalTenders: 24,
//   activeTenders: 12,
//   archivedTenders: 8,
//   draftTenders: 4,
//   totalBids: 56,
//   pendingBids: 23,
//   approvedBids: 33,
//   totalVendors: 42,
//   activeVendors: 38,
//   inactiveVendors: 4,
//   totalValue: "₹12,450,000",
//   categoryCount: 18,
// };

// const recentTenders = [
//   {
//     id: 1,
//     title: "Hospital Equipment Procurement",
//     tenderNumber: "TERI-2023-045",
//     date: "2023-07-15",
//     status: "active",
//     category: "Medical",
//     bids: 8,
//   },
//   {
//     id: 2,
//     title: "IT Infrastructure Upgrade",
//     tenderNumber: "TERI-2023-046",
//     date: "2023-07-10",
//     status: "active",
//     category: "IT",
//     bids: 12,
//   },
//   {
//     id: 3,
//     title: "Office Renovation",
//     tenderNumber: "TERI-2023-044",
//     date: "2023-07-05",
//     status: "closed",
//     category: "Construction",
//     bids: 6,
//   },
//   {
//     id: 4,
//     title: "Vehicle Fleet Expansion",
//     tenderNumber: "TERI-2023-043",
//     date: "2023-07-01",
//     status: "active",
//     category: "Automotive",
//     bids: 10,
//   },
// ];

// const recentBids = [
//   {
//     id: 1,
//     tender: "Hospital Equipment Procurement",
//     vendor: "MediTech Solutions",
//     date: "2023-07-14",
//     status: "pending",
//     amount: "₹1,245,000",
//   },
//   {
//     id: 2,
//     tender: "IT Infrastructure Upgrade",
//     vendor: "TechPro Systems",
//     date: "2023-07-09",
//     status: "approved",
//     amount: "₹2,876,000",
//   },
//   {
//     id: 3,
//     tender: "Office Renovation",
//     vendor: "BuildRight Construction",
//     date: "2023-07-04",
//     status: "rejected",
//     amount: "₹980,000",
//   },
//   {
//     id: 4,
//     tender: "IT Infrastructure Upgrade",
//     vendor: "NexGen IT",
//     date: "2023-07-08",
//     status: "approved",
//     amount: "₹2,650,000",
//   },
// ];

// const topVendors = [
//   {
//     id: 1,
//     name: "TechPro Systems",
//     bids: 12,
//     wins: 8,
//     amount: "₹8,450,000",
//     category: "IT",
//     rating: 4.8,
//   },
//   {
//     id: 2,
//     name: "MediTech Solutions",
//     bids: 10,
//     wins: 6,
//     amount: "₹6,275,000",
//     category: "Medical",
//     rating: 4.5,
//   },
//   {
//     id: 3,
//     name: "BuildRight Construction",
//     bids: 8,
//     wins: 4,
//     amount: "₹5,120,000",
//     category: "Construction",
//     rating: 4.2,
//   },
//   {
//     id: 4,
//     name: "GreenEnergy Systems",
//     bids: 6,
//     wins: 3,
//     amount: "₹4,350,000",
//     category: "Energy",
//     rating: 4.6,
//   },
// ];

// const categoryDistribution = [
//   { name: "IT", count: 8, percentage: 32 },
//   { name: "Medical", count: 6, percentage: 24 },
//   { name: "Construction", count: 5, percentage: 20 },
//   { name: "Automotive", count: 3, percentage: 12 },
//   { name: "Energy", count: 3, percentage: 12 },
// ];

// const formatDate = (dateString: string) => {
//   const date = new Date(dateString);
//   return new Intl.DateTimeFormat("en-IN", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   }).format(date);
// };

// const getStatusColor = (status: string) => {
//   switch (status.toLowerCase()) {
//     case "active":
//       return "bg-green-100 text-green-800 border-green-200";
//     case "pending":
//       return "bg-yellow-100 text-yellow-800 border-yellow-200";
//     case "approved":
//       return "bg-green-100 text-green-800 border-green-200";
//     case "rejected":
//       return "bg-red-100 text-red-800 border-red-200";
//     case "closed":
//       return "bg-gray-100 text-gray-800 border-gray-200";
//     default:
//       return "bg-blue-100 text-blue-800 border-blue-200";
//   }
// };

const AdminDashboard = () => {
  const router = useRouter();
  // const [activeTab, setActiveTab] = useState("overview");

  // In a real implementation, data would be fetched from APIs
  // useEffect(() => {
  //   // Fetch dashboard data from the server
  //   // This would include statistics, recent tenders, recent bids, etc.
  // }, []);

  return (
    <AdminPagesWrapper>
      <div>
        <div className='w-full bg-white mb-8'>
          <div className='container mx-auto px-6 py-8'>
            <div className='flex justify-between items-center'>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>
                  Admin Dashboard
                </h1>
                <p className='text-gray-600 mt-2 max-w-2xl'>
                  Get a comprehensive overview of all tenders, bids, and vendors
                  in the system. Track performance and manage your procurement
                  activities efficiently.
                </p>
              </div>
              <Button
                onClick={() => router.push("/admin/create-tender")}
                className={primaryButtonStyle}>
                <FilePlus2 className='mr-2 h-4 w-4' /> Create New Tender
              </Button>
            </div>
          </div>
        </div>

        {/* <div className='container mx-auto px-6 mb-12'>
        <Tabs
          defaultValue='overview'
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-6 '>
          <div className=' border-gray-100 overflow-hidden'>
            <div className='py-4 px-2 border-b'>
              <TabsList className='bg-transparent border rounded-full border-gray-200 p-1'>
                <TabsTrigger
                  value='overview'
                  className='data-[state=active]:bg-primary px-8 rounded-full data-[state=active]:text-white '>
                  <LayoutDashboard className='h-4 w-4 mr-2' />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value='tenders'
                  className='data-[state=active]:bg-primary px-8 data-[state=active]:text-white rounded-full'>
                  <ClipboardList className='h-4 w-4 mr-2' />
                  Tenders
                </TabsTrigger>
                <TabsTrigger
                  value='bids'
                  className='data-[state=active]:bg-primary px-8 data-[state=active]:text-white rounded-full'>
                  <BarChart4 className='h-4 w-4 mr-2' />
                  Bids
                </TabsTrigger>
                <TabsTrigger
                  value='vendors'
                  className='data-[state=active]:bg-primary px-8 data-[state=active]:text-white rounded-full'>
                  <Users className='h-4 w-4 mr-2' />
                  Vendors
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

        
          <TabsContent
            value='overview'
            className='space-y-6'>
         
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <Card className='bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Tenders
                  </CardTitle>
                  <div className='h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center'>
                    <FileText className='h-4 w-4 text-blue-700' />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl text-nowrap font-bold'>
                    {mockStats.totalTenders}
                  </div>
                  <div className='flex flex-wrap items-center gap-2 mt-1'>
                    <span className='text-xs px-2 text-nowrap py-0.5 rounded-full bg-green-100 text-green-800'>
                      {mockStats.activeTenders} active
                    </span>
                    <span className='text-xs px-2 text-nowrap py-0.5 rounded-full bg-gray-100 text-gray-800'>
                      {mockStats.archivedTenders} archived
                    </span>
                    <span className='text-xs px-2 text-nowrap py-0.5 rounded-full bg-yellow-100 text-yellow-800'>
                      {mockStats.draftTenders} drafts
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Bids
                  </CardTitle>
                  <div className='h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center'>
                    <BriefcaseBusiness className='h-4 w-4 text-purple-700' />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {mockStats.totalBids}
                  </div>
                  <div className='flex items-center gap-2 mt-1'>
                    <span className='text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800'>
                      {mockStats.pendingBids} pending
                    </span>
                    <span className='text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800'>
                      {mockStats.approvedBids} approved
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Registered Vendors
                  </CardTitle>
                  <div className='h-8 w-8 rounded-full bg-green-100 flex items-center justify-center'>
                    <Users className='h-4 w-4 text-green-700' />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {mockStats.totalVendors}
                  </div>
                  <div className='flex items-center gap-2 mt-1'>
                    <span className='text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800'>
                      {mockStats.activeVendors} active
                    </span>
                    <span className='text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800'>
                      {mockStats.inactiveVendors} inactive
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Value
                  </CardTitle>
                  <div className='h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center'>
                    <Coins className='h-4 w-4 text-amber-700' />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {mockStats.totalValue}
                  </div>
                  <div className='flex items-center gap-2 mt-1'>
                    <span className='text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800'>
                      Across {mockStats.totalTenders} tenders
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

      
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
         
              <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
                <div className='p-4 bg-gray-50 border-b flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <ClipboardList
                      size={18}
                      className='text-primary'
                    />
                    <h2 className='font-semibold text-gray-900'>
                      Recent Tenders
                    </h2>
                  </div>
                  <Button
                    variant='ghost'
                    className='text-sm h-8 text-primary hover:text-primary/90'
                    onClick={() => router.push("/admin/tenders")}>
                    View all
                  </Button>
                </div>
                <div className='p-4'>
                  <div className='space-y-4'>
                    {recentTenders.map((tender) => (
                      <div
                        key={tender.id}
                        className='flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 cursor-pointer hover:bg-gray-50'
                        onClick={() =>
                          router.push(`/admin/tenders/${tender.id}`)
                        }>
                        <div className='flex flex-col'>
                          <div className='font-medium text-gray-900'>
                            {tender.title}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {tender.tenderNumber} • {formatDate(tender.date)}
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Badge
                            className={getStatusColor(tender.status)}
                            variant='outline'>
                            {tender.status}
                          </Badge>
                          <span className='text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200'>
                            {tender.bids} bids
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

       
              <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
                <div className='p-4 bg-gray-50 border-b flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <BarChart4
                      size={18}
                      className='text-primary'
                    />
                    <h2 className='font-semibold text-gray-900'>Recent Bids</h2>
                  </div>
                  <Button
                    variant='ghost'
                    className='text-sm h-8 text-primary hover:text-primary/90'
                    onClick={() => router.push("/admin/bids")}>
                    View all
                  </Button>
                </div>
                <div className='p-4'>
                  <div className='space-y-4'>
                    {recentBids.map((bid) => (
                      <div
                        key={bid.id}
                        className='flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 cursor-pointer hover:bg-gray-50'
                        onClick={() => router.push(`/admin/bids/${bid.id}`)}>
                        <div className='flex flex-col'>
                          <div className='font-medium text-gray-900'>
                            {bid.vendor}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {bid.tender} • {formatDate(bid.date)}
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Badge
                            className={getStatusColor(bid.status)}
                            variant='outline'>
                            {bid.status}
                          </Badge>
                          <span className='font-medium text-sm'>
                            {bid.amount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

      
            <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
              <div className='p-4 bg-gray-50 border-b flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <PieChart
                    size={18}
                    className='text-primary'
                  />
                  <h2 className='font-semibold text-gray-900'>
                    Category Distribution
                  </h2>
                </div>
              </div>
              <div className='p-4'>
                <div className='space-y-4'>
                  {categoryDistribution.map((category) => (
                    <div
                      key={category.name}
                      className='flex flex-col space-y-1'>
                      <div className='flex justify-between items-center'>
                        <span className='text-sm font-medium text-gray-900'>
                          {category.name}
                        </span>
                        <div className='flex items-center gap-2'>
                          <span className='text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200'>
                            {category.count} tenders
                          </span>
                          <span className='text-sm text-gray-500'>
                            {category.percentage}%
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={category.percentage}
                        className='h-2 bg-gray-100'
                      />
                    </div>
                  ))}
                  <div className='pt-2 text-sm text-gray-500 text-center'>
                    Total of {mockStats.categoryCount} categories in the system
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value='tenders'
            className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4'>
                <div className='flex items-center gap-3 mb-3'>
                  <div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center'>
                    <FileText className='h-5 w-5 text-blue-700' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      Active Tenders
                    </h3>
                    <p className='text-3xl font-bold mt-1'>
                      {mockStats.activeTenders}
                    </p>
                  </div>
                </div>
                <Button
                  variant='outline'
                  className='w-full border-primary text-primary hover:bg-primary/10 mt-2'
                  onClick={() => router.push("/admin/tenders?status=active")}>
                  View active tenders
                </Button>
              </div>

              <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4'>
                <div className='flex items-center gap-3 mb-3'>
                  <div className='h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center'>
                    <FileArchive className='h-5 w-5 text-gray-700' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      Archived Tenders
                    </h3>
                    <p className='text-3xl font-bold mt-1'>
                      {mockStats.archivedTenders}
                    </p>
                  </div>
                </div>
                <Button
                  variant='outline'
                  className='w-full border-gray-500 text-gray-700 hover:bg-gray-100 mt-2'
                  onClick={() => router.push("/admin/archived")}>
                  View archived tenders
                </Button>
              </div>

              <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4'>
                <div className='flex items-center gap-3 mb-3'>
                  <div className='h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center'>
                    <Clock className='h-5 w-5 text-yellow-700' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      Draft Tenders
                    </h3>
                    <p className='text-3xl font-bold mt-1'>
                      {mockStats.draftTenders}
                    </p>
                  </div>
                </div>
                <Button
                  variant='outline'
                  className='w-full border-yellow-500 text-yellow-700 hover:bg-yellow-50 mt-2'
                  onClick={() => router.push("/admin/tenders?status=draft")}>
                  View draft tenders
                </Button>
              </div>
            </div>

            <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
              <div className='p-4 bg-gray-50 border-b flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <ClipboardList
                    size={18}
                    className='text-primary'
                  />
                  <h2 className='font-semibold text-gray-900'>
                    Latest Tenders
                  </h2>
                </div>
                <Button
                  onClick={() => router.push("/admin/create-tender")}
                  className='bg-primary hover:bg-primary/90 text-white'>
                  <FilePlus2 className='mr-2 h-4 w-4' /> Create New Tender
                </Button>
              </div>
              <div className='p-4'>
                <Table>
                  <TableHeader>
                    <TableRow className='bg-gray-50 hover:bg-gray-50'>
                      <TableHead className='font-medium'>Title</TableHead>
                      <TableHead className='font-medium'>Tender #</TableHead>
                      <TableHead className='font-medium'>Category</TableHead>
                      <TableHead className='font-medium'>Date</TableHead>
                      <TableHead className='font-medium'>Bids</TableHead>
                      <TableHead className='font-medium'>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTenders.map((tender) => (
                      <TableRow
                        key={tender.id}
                        className='cursor-pointer hover:bg-gray-50'
                        onClick={() =>
                          router.push(`/admin/tenders/${tender.id}`)
                        }>
                        <TableCell className='font-medium'>
                          {tender.title}
                        </TableCell>
                        <TableCell>{tender.tenderNumber}</TableCell>
                        <TableCell>{tender.category}</TableCell>
                        <TableCell>{formatDate(tender.date)}</TableCell>
                        <TableCell>{tender.bids}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(tender.status)}>
                            {tender.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value='bids'
            className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4'>
                <div className='flex items-center gap-3 mb-3'>
                  <div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center'>
                    <BriefcaseBusiness className='h-5 w-5 text-blue-700' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>Total Bids</h3>
                    <p className='text-3xl font-bold mt-1'>
                      {mockStats.totalBids}
                    </p>
                  </div>
                </div>
                <Button
                  variant='outline'
                  className='w-full border-primary text-primary hover:bg-primary/10 mt-2'
                  onClick={() => router.push("/admin/bids")}>
                  View all bids
                </Button>
              </div>

              <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4'>
                <div className='flex items-center gap-3 mb-3'>
                  <div className='h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center'>
                    <Clock className='h-5 w-5 text-yellow-700' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      Pending Bids
                    </h3>
                    <p className='text-3xl font-bold mt-1'>
                      {mockStats.pendingBids}
                    </p>
                  </div>
                </div>
                <Button
                  variant='outline'
                  className='w-full border-yellow-500 text-yellow-700 hover:bg-yellow-50 mt-2'
                  onClick={() => router.push("/admin/bids?status=pending")}>
                  View pending bids
                </Button>
              </div>

              <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4'>
                <div className='flex items-center gap-3 mb-3'>
                  <div className='h-10 w-10 rounded-full bg-green-100 flex items-center justify-center'>
                    <Trophy className='h-5 w-5 text-green-700' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      Approved Bids
                    </h3>
                    <p className='text-3xl font-bold mt-1'>
                      {mockStats.approvedBids}
                    </p>
                  </div>
                </div>
                <Button
                  variant='outline'
                  className='w-full border-green-500 text-green-700 hover:bg-green-50 mt-2'
                  onClick={() => router.push("/admin/bids?status=approved")}>
                  View approved bids
                </Button>
              </div>
            </div>

            <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
              <div className='p-4 bg-gray-50 border-b flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <BarChart4
                    size={18}
                    className='text-primary'
                  />
                  <h2 className='font-semibold text-gray-900'>Recent Bids</h2>
                </div>
              </div>
              <div className='p-4'>
                <Table>
                  <TableHeader>
                    <TableRow className='bg-gray-50 hover:bg-gray-50'>
                      <TableHead className='font-medium'>Vendor</TableHead>
                      <TableHead className='font-medium'>Tender</TableHead>
                      <TableHead className='font-medium'>Date</TableHead>
                      <TableHead className='font-medium'>Amount</TableHead>
                      <TableHead className='font-medium'>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBids.map((bid) => (
                      <TableRow
                        key={bid.id}
                        className='cursor-pointer hover:bg-gray-50'
                        onClick={() => router.push(`/admin/bids/${bid.id}`)}>
                        <TableCell className='font-medium'>
                          {bid.vendor}
                        </TableCell>
                        <TableCell>{bid.tender}</TableCell>
                        <TableCell>{formatDate(bid.date)}</TableCell>
                        <TableCell>{bid.amount}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(bid.status)}>
                            {bid.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

         
          <TabsContent
            value='vendors'
            className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4'>
                <div className='flex items-center gap-3 mb-3'>
                  <div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center'>
                    <Users className='h-5 w-5 text-blue-700' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      Total Vendors
                    </h3>
                    <p className='text-3xl font-bold mt-1'>
                      {mockStats.totalVendors}
                    </p>
                  </div>
                </div>
                <Button
                  variant='outline'
                  className='w-full border-primary text-primary hover:bg-primary/10 mt-2'
                  onClick={() => router.push("/admin/vendors")}>
                  Manage vendors
                </Button>
              </div>

              <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4'>
                <div className='flex items-center gap-3 mb-3'>
                  <div className='h-10 w-10 rounded-full bg-green-100 flex items-center justify-center'>
                    <Building2 className='h-5 w-5 text-green-700' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      Active Vendors
                    </h3>
                    <p className='text-3xl font-bold mt-1'>
                      {mockStats.activeVendors}
                    </p>
                  </div>
                </div>
                <Button
                  variant='outline'
                  className='w-full border-green-500 text-green-700 hover:bg-green-50 mt-2'
                  onClick={() => router.push("/admin/vendors?status=active")}>
                  View active vendors
                </Button>
              </div>

              <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4'>
                <div className='flex items-center gap-3 mb-3'>
                  <div className='h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center'>
                    <BarChartHorizontalBig className='h-5 w-5 text-purple-700' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>Categories</h3>
                    <p className='text-3xl font-bold mt-1'>
                      {mockStats.categoryCount}
                    </p>
                  </div>
                </div>
                <Button
                  variant='outline'
                  className='w-full border-purple-500 text-purple-700 hover:bg-purple-50 mt-2'
                  onClick={() => router.push("/admin/categories")}>
                  Manage categories
                </Button>
              </div>
            </div>

            <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
              <div className='p-4 bg-gray-50 border-b flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <TrendingUp
                    size={18}
                    className='text-primary'
                  />
                  <h2 className='font-semibold text-gray-900'>
                    Top Performing Vendors
                  </h2>
                </div>
              </div>
              <div className='p-4'>
                <Table>
                  <TableHeader>
                    <TableRow className='bg-gray-50 hover:bg-gray-50'>
                      <TableHead className='font-medium'>Vendor</TableHead>
                      <TableHead className='font-medium'>Category</TableHead>
                      <TableHead className='font-medium'>Bids</TableHead>
                      <TableHead className='font-medium'>Wins</TableHead>
                      <TableHead className='font-medium'>Total Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topVendors.map((vendor) => (
                      <TableRow
                        key={vendor.id}
                        className='cursor-pointer hover:bg-gray-50'
                        onClick={() =>
                          router.push(`/admin/vendors/${vendor.id}`)
                        }>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <Avatar className='h-8 w-8 border border-gray-200'>
                              <AvatarFallback className='bg-gray-100 text-gray-800 font-medium'>
                                {vendor.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className='font-medium'>{vendor.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{vendor.category}</TableCell>
                        <TableCell>{vendor.bids}</TableCell>
                        <TableCell>{vendor.wins}</TableCell>
                        <TableCell>{vendor.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div> */}
      </div>
    </AdminPagesWrapper>
  );
};

export default AdminDashboard;
