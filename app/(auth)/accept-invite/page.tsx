"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Input } from "@/_components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/_components/ui/form";
import {
  UserPlus,
  User,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { trpc } from "@/lib/trpc";
import { isApiError } from "@/utils/isApiError";
import CustomButton from "@/_components/Shared/CustomButton";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PageLoading from "@/_components/Shared/PageLoading";

const AcceptInviteInputSchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters long"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirm_password: z.string(),
});

type AcceptInviteInput = z.infer<typeof AcceptInviteInputSchema>;

const AcceptInvite = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const { data: inviteDetails, isLoading: isInviteDetailsLoading } =
    trpc.auth.getInviteDetails.useQuery(token || "", {
      enabled: !!token,
    });

  const acceptAdminInvite = trpc.auth.acceptInvite.useMutation();
  const isAcceptingInvite = acceptAdminInvite.isPending;

  const form = useForm<AcceptInviteInput>({
    defaultValues: {
      full_name: "",
      password: "",
      confirm_password: "",
    },
    resolver: zodResolver(AcceptInviteInputSchema),
  });

  useEffect(() => {
    if (!isInviteDetailsLoading && !inviteDetails) {
      toast.error("Invalid invite link");
      router.push("/sign-in");
    }
  }, [isInviteDetailsLoading, router, inviteDetails]);

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: AcceptInviteInput) => {
    if (data.password !== data.confirm_password) {
      form.setError("confirm_password", {
        message: "Passwords do not match",
      });
      return;
    }

    try {
      if (!token) {
        toast.error("Invalid invite link");
        router.push("/sign-in");
        return;
      }

      await acceptAdminInvite.mutateAsync({
        ...data,
        token,
      });
      toast.success("Admin account created successfully!");
      router.push("/sign-in?message=account-created");
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.message);
      } else {
        toast.error("Failed to create admin account");
      }
    }
  };

  if (isInviteDetailsLoading) {
    return <PageLoading fullScreen message="Validating invite..." />;
  }

  if (!inviteDetails) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6'>
            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
              <div className='flex items-center space-x-2'>
                <AlertCircle className='h-4 w-4 text-red-500' />
                <span className='text-red-800'>
                  This invite link is invalid or has expired.
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md mx-auto'>
        <div className='text-center mb-8'>
          <UserPlus className='h-12 w-12 text-primary mx-auto mb-4' />
          <h1 className='text-3xl font-bold text-gray-900'>
            Accept Admin Invite
          </h1>
          <p className='text-gray-600 mt-2'>
            Complete your admin account setup
          </p>
        </div>

        <Card className='shadow-lg'>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <CheckCircle className='h-5 w-5 text-green-500' />
              <span>Admin Invitation</span>
            </CardTitle>
            <CardDescription>
              You have been invited to join as an administrator for{" "}
              <strong>{inviteDetails.data.email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'>
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name='full_name'
                  rules={{ required: "Full name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <div className='relative'>
                        <User className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                        <FormControl>
                          <Input
                            type='text'
                            placeholder='Enter your full name'
                            className='pl-10'
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name='password'
                  rules={{ required: "Password is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password *</FormLabel>
                      <div className='relative'>
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder='Enter password (min. 6 characters)'
                            className='pr-10'
                            {...field}
                          />
                        </FormControl>
                        <button
                          type='button'
                          onClick={() => setShowPassword(!showPassword)}
                          className='absolute right-3 top-3 text-gray-400 hover:text-gray-600'>
                          {showPassword ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name='confirm_password'
                  rules={{ required: "Please confirm your password" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password *</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Confirm your password'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CustomButton
                  btnName='Create Admin Account'
                  disabled={isAcceptingInvite}
                  type='submit'
                  variant='primary'
                  fullWidth={true}
                  isLoading={isAcceptingInvite}
                />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AcceptInvite;
