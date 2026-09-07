"use client";
import React, { useState } from "react";
import DashboardWrapper from "@/components/DashboardWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Trash2, Users, Mail, Calendar } from "lucide-react";
import { formatDisplayDate } from "@/utils/dateUtils";

const AdminsList = () => {
  const { data, isLoading, error, refetch } = trpc.admin.getAll.useQuery();
  console.log(data);
  const deleteAdmin = trpc.admin.delete.useMutation();
  const [deletingAdminId, setDeletingAdminId] = useState<number | null>(null);

  const handleDeleteAdmin = async (adminId: number, adminName: string) => {
    setDeletingAdminId(adminId);
    deleteAdmin.mutate(adminId, {
      onSuccess: () => {
        toast.success(`Admin ${adminName} has been deleted successfully`);
        refetch();
        setDeletingAdminId(null);
      },
      onError: (error) => {
        const errorMessage = error.message || "Failed to delete admin";
        toast.error(errorMessage);
        setDeletingAdminId(null);
      },
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <DashboardWrapper>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <Skeleton className='h-8 w-[250px]' />
            <Skeleton className='h-4 w-[500px]' />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-[200px]' />
              <Skeleton className='h-4 w-[300px]' />
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                {[...Array(5)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className='h-16 w-full'
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardWrapper>
    );
  }

  if (error) {
    return (
      <DashboardWrapper
        title='Admins'
        description='Manage admins'>
        <div className='flex items-center justify-center h-96'>
          <div className='text-center'>
            <div className='text-red-500 mb-4'>
              <Users className='h-16 w-16 mx-auto' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              Failed to load admins
            </h3>
            <p className='text-gray-600 mb-4'>
              There was an error loading the admin list. Please try again.
            </p>
            <Button
              onClick={() => refetch()}
              variant='outline'>
              Retry
            </Button>
          </div>
        </div>
      </DashboardWrapper>
    );
  }

  const admins = data?.data || [];

  return (
    <DashboardWrapper
      title='Admins'
      description=' View and manage all system administrators. Only super admins can
            delete admin accounts.'>
      <div className='space-y-6'>
        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Users className='h-5 w-5' />
              Admin Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-center'>
              <div className='text-2xl font-bold text-primary'>
                {admins && admins.length}
              </div>
              <div className='text-sm text-gray-600'>Total Admins</div>
            </div>
          </CardContent>
        </Card>

        {/* Admins Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Administrators</CardTitle>
            <CardDescription>
              List of all system administrators with their details and actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {admins.length === 0 ? (
              <div className='text-center py-8'>
                <Users className='h-16 w-16 mx-auto text-gray-300 mb-4' />
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  No admins found
                </h3>
                <p className='text-gray-600'>
                  There are no administrators in the system yet.
                </p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Admin</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.map((admin) => (
                      <TableRow key={admin.user_id}>
                        <TableCell>
                          <div className='flex items-center gap-3'>
                            <Avatar>
                              <AvatarFallback>
                                {getInitials(admin.full_name || "Admin")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className='font-medium'>
                                {admin.full_name}
                              </div>
                              <div className='text-sm text-gray-600 flex items-center gap-1'>
                                <Mail className='h-3 w-3' />
                                {admin.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-1 text-sm'>
                            <Calendar className='h-3 w-3' />
                            {formatDisplayDate(admin.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant='secondary'>Active</Badge>
                        </TableCell>
                        <TableCell className='text-right'>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant='destructive'
                                size='sm'
                                disabled={deletingAdminId === admin.user_id}>
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Administrator</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete{" "}
                                  <strong>{admin.full_name}</strong>? This
                                  action cannot be undone. The admin will lose
                                  access to the system immediately.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant='outline'>Cancel</Button>
                                <Button
                                  onClick={() =>
                                    handleDeleteAdmin(
                                      admin.user_id,
                                      admin.full_name || "Admin"
                                    )
                                  }
                                  className='bg-red-600 hover:bg-red-700'>
                                  Delete Admin
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardWrapper>
  );
};

export default AdminsList;
