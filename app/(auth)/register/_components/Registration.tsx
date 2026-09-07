"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import BusinessInfo from "./BusinessInfo";
import VendorInfo from "./VendorInfo";
import VendorDocumentsInfo from "./VendorDocumentsInfo";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { IVendorRegistrationForm } from "@/_types/auth/registration.type";
import RegistrationNavSidebar from "./RegistrationNavSidebar";
import useHandleRegisterVendor from "../_hooks/useHandleRegisterVendor";
import { Form } from "@/_components/ui/form";
import {
  registrationSchema,
  type RegistrationFormValues,
} from "../_schemas/registration.schema";
import {
  CalendarClock,
  FileText,
  CheckCircle,
  Mail,
  Users,
} from "lucide-react";
import { primaryButtonStyle } from "@/app/styles";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Registration = () => {
  const [active, setActive] = useState(0);
  const [isRegistrationSuccessful, setIsRegistrationSuccessful] =
    useState(false);
  const searchParams = useSearchParams();
  const source = searchParams.get("source");

  const [handleVendorRegistration, { isLoading }] =
    useHandleRegisterVendor() as [
      (data: {
        data: IVendorRegistrationForm;
        vendor_source: "direct" | "invite";
      }) => Promise<{ success: boolean }>,
      { isLoading: boolean }
    ];

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
    defaultValues: {
      user: {
        full_name: "",
        email: "",
        password: "",
        confirm_password: "",
      },
      vendor: {
        vendor_contact: "",
        vendor_pan_number: "",
        vendor_adhar_doc: undefined,
        vendor_pan_doc: undefined,
      },
      business: {
        biz_legal_name: "",
        biz_trade_name: "",
        biz_classification: "",
        biz_reg_number: "",
        biz_reg_doc: undefined,
        biz_established_year: "",
        biz_addr_line1: "",
        biz_addr_line2: "",
        biz_locality: "",
        biz_city: "",
        biz_pin_code: "",
        biz_state: "",
        biz_country: "",
        biz_gst_number: "",
        biz_gst_doc: undefined,
        biz_bank_doc: undefined,
        biz_msme_cert_doc: undefined,
        biz_has_msme: false,
        biz_website: "",
        biz_email: "",
        biz_phone: "",
        biz_3_year_turnover: "",
        biz_employee_count: 0,
      },
    },
  });

  const { handleSubmit, reset } = form;

  const handleVendorMutate = handleSubmit(async (data) => {
    const vendor_source: "direct" | "invite" =
      source === "invite" ? "invite" : "direct";
    const result = await handleVendorRegistration({
      data: data as IVendorRegistrationForm,
      vendor_source,
    });
    if (result.success) {
      reset();
      setIsRegistrationSuccessful(true);
      toast.success("Form Submitted Successfully");
    }
  });

  const handleNextStep = (nextStep: number) => {
    // Validation is already done in the child component before calling this
    setActive(nextStep);
  };

  // Show success message if registration is successful
  if (isRegistrationSuccessful) {
    return (
      <div className='min-h-screen flex justify-center items-center p-4 bg-gray-50'>
        <div className='bg-white max-w-xl w-full p-6 md:p-8 rounded-xl shadow-lg border border-gray-100'>
          <div className='flex flex-col items-center'>
            {/* Success Icon */}
            <div className='h-14 w-14 bg-green-100 rounded-full flex items-center justify-center mb-4'>
              <CheckCircle className='h-8 w-8 text-green-600' />
            </div>

            {/* Main Heading */}
            <h1 className='text-2xl font-bold text-gray-900 text-center mb-2'>
              Registration Submitted!
            </h1>

            <p className='text-sm text-gray-600 text-center max-w-md mb-6'>
              Thank you for registering! Your application is under review and
              you&apos;ll receive an email notification once approved.
            </p>

            {/* Simple Status Cards */}
            <div className='w-full grid md:grid-cols-2 gap-4 mb-6'>
              <div className='bg-primary/5 p-4 rounded-lg border border-primary/5'>
                <div className='flex items-center gap-2 mb-2'>
                  <CalendarClock className='h-5 w-5 text-primary' />
                  <h3 className='font-semibold text-gray-900 text-sm'>
                    Review Timeline
                  </h3>
                </div>
                <p className='text-gray-700 text-xs'>
                  Typically takes <strong>1-3 business days</strong> for our
                  team to review your application.
                </p>
              </div>

              <div className='bg-amber-50 p-4 rounded-lg border border-amber-200/30'>
                <div className='flex items-center gap-2 mb-2'>
                  <Users className='h-5 w-5 text-amber-600' />
                  <h3 className='font-semibold text-gray-900 text-sm'>
                    After Approval
                  </h3>
                </div>
                <p className='text-gray-700 text-xs'>
                  You&apos;ll get full access to browse tenders and submit bids
                  on our platform.
                </p>
              </div>
            </div>

            {/* Simple Progress Steps */}
            <div className='w-full mb-6'>
              <h3 className='text-sm font-semibold text-gray-900 text-center mb-4'>
                What happens next?
              </h3>
              <div className='space-y-2'>
                <div className='flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100'>
                  <CheckCircle className='h-5 w-5 text-green-600 flex-shrink-0' />
                  <div>
                    <div className='font-medium text-gray-900 text-sm'>
                      Application Submitted ✓
                    </div>
                    <div className='text-xs text-gray-600'>
                      Your registration has been received
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100'>
                  <FileText className='h-5 w-5 text-amber-600 flex-shrink-0' />
                  <div>
                    <div className='font-medium text-gray-900 text-sm'>
                      Under Review
                    </div>
                    <div className='text-xs text-gray-600'>
                      Our team is reviewing your documents
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200'>
                  <Mail className='h-5 w-5 text-gray-400 flex-shrink-0' />
                  <div>
                    <div className='font-medium text-gray-500 text-sm'>
                      Email Notification
                    </div>
                    <div className='text-xs text-gray-500'>
                      You&apos;ll receive confirmation once approved
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className='w-full max-w-xs'>
              <Link href={"/"}>
                <Button
                  className={cn(
                    primaryButtonStyle,
                    "w-full h-10 text-sm font-semibold"
                  )}>
                  Return to Home
                </Button>
              </Link>

              <div className='text-center mt-4'>
                <p className='text-xs text-gray-500 mb-1'>Need help?</p>
                <button className='text-primary hover:text-primary font-medium text-xs'>
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show registration form
  return (
    <div className='container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
      <div className='flex flex-col lg:flex-row gap-6 lg:gap-10'>
        {/* Sidebar Navigation */}
        <RegistrationNavSidebar
          active={active}
          setActive={setActive}
        />

        {/* Main Form Content */}
        <Form {...form}>
          <form className='flex-1 min-w-0'>
            <div className='bg-white rounded-xl shadow-lg shadow-gray-200 border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/60'>
              {active === 0 ? (
                <VendorInfo handleNextStep={handleNextStep} />
              ) : null}
              {active === 1 ? (
                <BusinessInfo
                  handleNextStep={handleNextStep}
                  setActive={setActive}
                />
              ) : null}
              {active === 2 ? (
                <VendorDocumentsInfo
                  handleNextStep={handleNextStep}
                  handleVendorMutate={handleVendorMutate}
                  setActive={setActive}
                />
              ) : null}
            </div>
          </form>
        </Form>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className='flex z-[1000] flex-col items-center justify-center bg-gray-950/80 backdrop-blur-sm fixed inset-0'>
          <div className='bg-white/10 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center border border-white/20'>
            <p className='text-gray-300 text-lg mb-2'>Please wait</p>
            <h1 className='text-white mb-6 text-2xl font-semibold'>
              Registering Vendor
            </h1>
            <div className='relative'>
              <div className='w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin' />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registration;
