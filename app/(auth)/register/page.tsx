"use client";
import Heading from "@/components/Shared/Heading";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { setAgreementForm } from "@/Redux/vendor/venderRegistrationSlice";
import { useRouter } from "next/navigation";
import { AlertTriangle, FileCheck, Info, Scroll } from "lucide-react";

const Registration = () => {
  const [isAgreementFormErr, setIsAgreementFormErr] = useState({
    termErr: false,
    accPrivacyErr: false,
    businessEthicsErr: false,
  });

  const {
    isAcceptPrivacyChecked,
    isBusinessEthicsChecked,
    isTermServiceChecked,
  } = useSelector((state: RootState) => state.venderRegistrationSlice);

  const dispatch = useDispatch();
  const router = useRouter();

  function handleAgreementForm() {
    if (!isTermServiceChecked) {
      setIsAgreementFormErr((prev) => ({ ...prev, termErr: true }));
    } else {
      setIsAgreementFormErr((prev) => ({ ...prev, termErr: false }));
    }
    if (!isAcceptPrivacyChecked) {
      setIsAgreementFormErr((prev) => ({ ...prev, accPrivacyErr: true }));
    } else {
      setIsAgreementFormErr((prev) => ({ ...prev, accPrivacyErr: false }));
    }
    if (!isBusinessEthicsChecked) {
      setIsAgreementFormErr((prev) => ({ ...prev, businessEthicsErr: true }));
    } else {
      setIsAgreementFormErr((prev) => ({ ...prev, businessEthicsErr: false }));
    }

    if (
      isTermServiceChecked &&
      isAcceptPrivacyChecked &&
      isBusinessEthicsChecked
    )
      router.push("/register/vender");
  }

  const setIsTermServiceChecked = (val: boolean) => {
    dispatch(
      setAgreementForm({
        isAcceptPrivacyChecked,
        isBusinessEthicsChecked,
        isTermServiceChecked: val,
      })
    );
  };
  const setIsAcceptPrivacyChecked = (val: boolean) => {
    dispatch(
      setAgreementForm({
        isAcceptPrivacyChecked: val,
        isBusinessEthicsChecked,
        isTermServiceChecked,
      })
    );
  };
  const setIsBusinessEthicsChecked = (val: boolean) => {
    dispatch(
      setAgreementForm({
        isAcceptPrivacyChecked,
        isBusinessEthicsChecked: val,
        isTermServiceChecked,
      })
    );
  };

  return (
    <div className='min-h-screen pt-[3.8rem] bg-gray-50'>
      <Heading
        title='TERI - Tender Management'
        description='A platform for vendors to bid'
        keywords='Tender, Vendor, Projects'
      />

      <div className='container mx-auto px-6 py-12 max-w-4xl'>
        {/* Header */}
        <div className='bg-white shadow border-b mb-8 rounded-xl'>
          <div className='px-6 py-8'>
            <div className='flex items-center gap-3 mb-4 justify-center'>
              <div className='bg-primary/10 rounded-full p-3'>
                <Scroll className='h-6 w-6 text-primary' />
              </div>
            </div>
            <h1 className='text-3xl font-bold text-gray-900 text-center'>
              Vendor Registration
            </h1>
            <p className='text-gray-600 mt-2 text-center max-w-xl mx-auto'>
              Before proceeding with registration, please review and accept our
              terms and conditions.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className='bg-white rounded-xl shadow border border-gray-100'>
          <div className='p-6'>
            <div className='space-y-6'>
              <div className='bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-start gap-3'>
                <Info
                  className='text-blue-600 shrink-0 mt-0.5'
                  size={18}
                />
                <div className='text-sm text-gray-700'>
                  <p className='font-medium text-blue-800 mb-1'>
                    Important Information
                  </p>
                  <p>
                    Please read the agreement carefully. By accepting these
                    terms, you agree to comply with all platform policies. After
                    successful registration, you&apos;ll receive a copy of this
                    agreement via email.
                  </p>
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2 mb-1'>
                  <FileCheck
                    size={18}
                    className='text-primary'
                  />
                  <h2 className='text-lg font-semibold text-gray-900'>
                    Terms of Service
                  </h2>
                </div>
                <Textarea
                  className='bg-gray-50 text-base rounded-md p-4 text-gray-700 border-gray-200 min-h-[200px]'
                  readOnly={true}
                  defaultValue={
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec nulla lobortis, semper quam quis, viverra lorem. In porttitor blandit tellus sit amet cursus. Integer iaculis arcu nulla, sit amet mollis orci pellentesque sit amet. Duis velit lacus, tempor eu sollicitudin vitae, consectetur et enim. Suspendisse euismod pellentesque lacus, bibendum commodo ipsum luctus nec. Proin tortor lorem, tincidunt nec odio eu, molestie consequat lectus. Integer cursus justo sed augue semper suscipit. Aenean finibus libero quis fermentum rhoncus. Nullam quis massa a nisl efficitur blandit. Duis malesuada volutpat vulputate. Suspendisse potenti. In interdum faucibus ipsum interdum mattis. Pellentesque fringilla mollis turpis in rhoncus. Quisque consectetur enim augue, sed blandit libero ullamcorper vel. Vivamus et diam ullamcorper, imperdiet dui interdum, egestas justo. Pellentesque id justo finibus, volutpat tortor id, lacinia dolor. Aenean congue velit ac leo euismod, nec convallis risus cursus. Aenean faucibus sem vitae tortor elementum, nec feugiat enim eleifend. Ut feugiat, ligula a aliquam bibendum, neque nibh condimentum ante, sed tincidunt nibh mauris ut purus. Duis fringilla cursus mauris, non pretium leo laoreet ut. Integer ut vestibulum sapien. Sed pharetra augue at eleifend mollis. Fusce ultricies porta mi, non lobortis metus interdum ultricies."
                  }
                />
              </div>

              <div className='space-y-4 bg-gray-50 p-5 rounded-lg border border-gray-200'>
                <h3 className='font-medium text-gray-800 mb-3'>
                  Required Agreements
                </h3>

                <div className='space-y-4'>
                  <div className='flex items-start space-x-3'>
                    <Checkbox
                      id='term-service'
                      className='mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary'
                      checked={isTermServiceChecked}
                      onCheckedChange={(val) =>
                        setIsTermServiceChecked(val as boolean)
                      }
                    />
                    <div className='space-y-1'>
                      <label
                        htmlFor='term-service'
                        className='font-medium text-gray-700 cursor-pointer'>
                        I agree to Terms of Service
                      </label>
                      {isAgreementFormErr.termErr && (
                        <p className='text-red-600 text-[0.85rem] flex items-center gap-1.5'>
                          <AlertTriangle
                            size={14}
                            className='text-red-600'
                          />
                          This agreement is required to proceed
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='flex items-start space-x-3'>
                    <Checkbox
                      id='accept-privacy'
                      className='mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary'
                      checked={isAcceptPrivacyChecked}
                      onCheckedChange={(val) =>
                        setIsAcceptPrivacyChecked(val as boolean)
                      }
                    />
                    <div className='space-y-1'>
                      <label
                        htmlFor='accept-privacy'
                        className='font-medium text-gray-700 cursor-pointer'>
                        I read and accept Privacy and Data Sharing Policies
                      </label>
                      {isAgreementFormErr.accPrivacyErr && (
                        <p className='text-red-600 text-[0.85rem] flex items-center gap-1.5'>
                          <AlertTriangle
                            size={14}
                            className='text-red-600'
                          />
                          This agreement is required to proceed
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='flex items-start space-x-3'>
                    <Checkbox
                      id='business-ethics'
                      className='mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary'
                      checked={isBusinessEthicsChecked}
                      onCheckedChange={(val) =>
                        setIsBusinessEthicsChecked(val as boolean)
                      }
                    />
                    <div className='space-y-1'>
                      <label
                        htmlFor='business-ethics'
                        className='font-medium text-gray-700 cursor-pointer'>
                        I read and promise to follow Business Ethics and Codes
                      </label>
                      {isAgreementFormErr.businessEthicsErr && (
                        <p className='text-red-600 text-[0.85rem] flex items-center gap-1.5'>
                          <AlertTriangle
                            size={14}
                            className='text-red-600'
                          />
                          This agreement is required to proceed
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex justify-end pt-2'>
                <Button
                  onClick={handleAgreementForm}
                  className='bg-primary hover:bg-primary/90 text-white px-6 h-10'>
                  Continue to Registration
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
