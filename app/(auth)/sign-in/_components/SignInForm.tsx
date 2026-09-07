"use client";
import React, { useState } from "react";
import { Form } from "@/_components/ui/form";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import CustomButton from "@/_components/Shared/CustomButton";
import CustomInput from "@/_components/Shared/CustomInput";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignInFormValues) {
    try {
      setIsLoading(true);

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
      } else if (result?.ok) {
        toast.success("Sign In Successfully!");
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-5 mb-10'>
          <CustomInput
            control={form.control}
            fieldName='email'
            Label='Email Address'
            LabelIcon={Mail}
            placeholder='you@example.com'
            type='email'
          />

          <CustomInput
            control={form.control}
            fieldName='password'
            LabelIcon={Lock}
            Label='Password'
            placeholder='••••••••••'
            type={showPassword ? "text" : "password"}
            inputIconButton={{
              icon: showPassword ? EyeOff : Eye,
              onClick: togglePasswordVisibility,
            }}
          />
        </div>

        <CustomButton
          btnName='Sign In'
          variant='primary'
          type='submit'
          fullWidth={true}
          RightIcon={ArrowRight}
          isLoading={isLoading}
        />
      </form>
    </Form>
  );
};

export default SignInForm;
