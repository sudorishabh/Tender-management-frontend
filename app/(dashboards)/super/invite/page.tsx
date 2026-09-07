"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/_components/ui/form";
import { Mail, Send, Clock, User } from "lucide-react";
import { toast } from "sonner";
import DashboardWrapper from "@/components/DashboardWrapper";
import { trpc } from "@/lib/trpc";
import { isApiError } from "@/utils/isApiError";
import CustomButton from "@/_components/Shared/CustomButton";
import CustomInput from "@/_components/Shared/CustomInput";
import { useForm } from "react-hook-form";

interface InviteFormData {
  email: string;
  full_name: string;
}

const AdminInvite = () => {
  const form = useForm<InviteFormData>({
    defaultValues: {
      email: "",
      full_name: "",
    },
  });

  const sendInvite = trpc.auth.sendAdminInvite.useMutation();
  const isLoading = sendInvite.isPending;

  const onSubmit = async (data: InviteFormData) => {
    try {
      await sendInvite.mutateAsync(data);
      toast.success("Admin invite sent successfully!");
      form.reset();
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.message);
      } else {
        toast.error("Failed to send invite");
      }
    }
  };

  return (
    <DashboardWrapper
      title='Invite Admin'
      description='Invite a new administrator to join the TERI Tender Management System'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Send Admin Invite Card */}
        <Card className='shadow-lg'>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <Mail className='h-5 w-5 text-primary' />
              <span>Send Admin Invite</span>
            </CardTitle>
            <CardDescription>
              Invite a new administrator to join the TERI Tender Management
              System
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8 pt-8'>
                <CustomInput
                  control={form.control}
                  fieldName='email'
                  Label='Email Address'
                  LabelIcon={Mail}
                  placeholder='admin@example.com'
                  type='email'
                  rules={{ required: "Email address is required" }}
                />

                <CustomInput
                  control={form.control}
                  fieldName='full_name'
                  Label='Full Name'
                  LabelIcon={User}
                  placeholder='John Doe'
                  type='text'
                  rules={{ required: "Full name is required" }}
                />

                <CustomButton
                  type='submit'
                  variant='primary'
                  btnName='Send Admin Invite'
                  LeftIcon={Send}
                  disabled={isLoading}
                  isLoading={isLoading}
                  fullWidth={true}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className='shadow-lg'>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <Clock className='h-5 w-5 text-amber-500' />
              <span>Invite Information</span>
            </CardTitle>
            <CardDescription>
              Important details about admin invitations
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4 text-xs'>
            <div className='bg-primary/5 p-4  rounded-lg border border-primary/20'>
              <h4 className='font-semibold text-primary mb-2'>
                Invite Validity
              </h4>
              <p className='text-primary'>
                Admin invite links are valid for <strong>10 minutes</strong>
                after being sent.
              </p>
            </div>

            <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
              <h4 className='font-semibold text-green-900 mb-2'>
                Admin Permissions
              </h4>
              <ul className='text-green-800 space-y-1'>
                <li>• Manage and publish tenders</li>
                <li>• Review and evaluate vendor bids</li>
              </ul>
            </div>

            <div className='bg-amber-50 p-4 rounded-lg border border-amber-200'>
              <h4 className='font-semibold text-amber-900 mb-2'>
                Security Note
              </h4>
              <p className='text-amber-800'>
                Only invite trusted individuals as administrators. Each invite
                can only be used once.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardWrapper>
  );
};

export default AdminInvite;
