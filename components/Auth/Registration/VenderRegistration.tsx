import { FormProvider, useForm } from "react-hook-form";
import React, { useState } from "react";
import BusinessInfo from "./RegistrationForms/BusinessInfo";
import VenderInfo from "./RegistrationForms/VenderInfo";
import VenderDocumentsInfo from "./RegistrationForms/VenderDocumentsInfo";
import { useRegisterVenderMutation } from "@/Redux/auth/authApi";
import { toast } from "sonner";
import { FileText, LoaderCircle, Building, FileUp, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeleteFileUrlMutation } from "@/Redux/s3-files/s3-files-Api";
import { IVenderRegistrationForm } from "@/Types/User-Types";
import useUploadFileToS3 from "@/hooks/useUploadFileToS3";
import { ErrorCodes } from "@/lib/errorCodes";
import { ApiError } from "@/Types";

const VenderRegistration = () => {
  const [active, setActive] = useState(0);
  const [registerVender, { isLoading: isRegisterVenderLoading }] =
    useRegisterVenderMutation();

  const router = useRouter();

  const [uploadFile, { isLoading: isUploading }] = useUploadFileToS3();
  const [deleteFileUrl] = useDeleteFileUrlMutation();

  const methods = useForm<IVenderRegistrationForm>({
    mode: "onChange",
    defaultValues: {
      fullname: "",
      email: "",
      contactNumber: "",
      password: "",
      confirmPassword: "",
      panCardNumber: "",
      panCardDoc: null,
      businessName: "",
      businessClassification: "",
      establishedYear: "",
      registrationNumber: "",
      gstNumber: "",
      companyEmail: "",
      companyPhone: "",
      annualTurnover: "",
      website: "",
      addressLineOne: "",
      addressLineTwo: "",
      locality: "",
      city: "",
      pinCode: "",
      country: "",
      registrationDoc: null,
      msmeCertificateDoc: null,
    },
  });

  const { handleSubmit, reset, trigger } = methods;

  const handleVenderMutate = handleSubmit(
    async (data: IVenderRegistrationForm) => {
      const { panCardDoc, registrationDoc, msmeCertificateDoc, ...restData } =
        data;
      if (!panCardDoc) {
        toast.error("Please upload PAN card document");
        return;
      }
      if (!registrationDoc) {
        toast.error("Please upload registration document");
        return;
      }
      let panCardFileName = "";
      let registrationDocFileName = "";
      let msmeCertificateFileName = "";
      try {
        panCardFileName = await uploadFile(panCardDoc, "pan card");
        registrationDocFileName = await uploadFile(
          registrationDoc,
          "registration"
        );

        // Upload MSME certificate if provided
        if (msmeCertificateDoc) {
          msmeCertificateFileName = await uploadFile(
            msmeCertificateDoc,
            "msme certificate"
          );
        }

        const formData = {
          ...restData,
          panCardDocName: panCardFileName,
          registrationDocName: registrationDocFileName,
          ...(msmeCertificateFileName && {
            msmeCertificateDocName: msmeCertificateFileName,
          }),
        };

        const result = await registerVender(formData).unwrap();

        if (result.success) {
          router.push("/register/successful");
          toast.success("Form Submitted Successfully");
          reset();
        }
      } catch (error) {
        const apiError = error as ApiError;
        if (apiError?.data?.errorCode && ErrorCodes[apiError.data.errorCode]) {
          toast.error(ErrorCodes[apiError.data.errorCode]);
        } else {
          toast.error("Registration failed. Please try again.");
        }

        if (panCardFileName) {
          await deleteFileUrl({
            fileName: `${process.env.NEXT_PUBLIC_AWS_S3_PDF_FOLDER}/${panCardFileName}`,
          });
        }
        if (registrationDocFileName) {
          await deleteFileUrl({
            fileName: `${process.env.NEXT_PUBLIC_AWS_S3_PDF_FOLDER}/${registrationDocFileName}`,
          });
        }
        if (msmeCertificateFileName) {
          await deleteFileUrl({
            fileName: `${process.env.NEXT_PUBLIC_AWS_S3_PDF_FOLDER}/${msmeCertificateFileName}`,
          });
        }
      }
    }
  );

  const handleNextStep = async (nextStep: number) => {
    const isValid = await trigger();
    if (isValid) {
      setActive(nextStep);
    }
  };

  const registrationSteps = [
    {
      title: "Personal Information",
      icon: (
        <FileText
          size={18}
          className='text-primary'
        />
      ),
      description: "Basic account details",
    },
    {
      title: "Business Information",
      icon: (
        <Building
          size={18}
          className='text-primary'
        />
      ),
      description: "Company and address details",
    },
    {
      title: "Document Upload",
      icon: (
        <FileUp
          size={18}
          className='text-primary'
        />
      ),
      description: "Required verification documents",
    },
  ];

  const isLoading = isRegisterVenderLoading || isUploading;

  const getProgressPercentage = () => {
    return Math.round((active / (registrationSteps.length - 1)) * 100);
  };

  return (
    <FormProvider {...methods}>
      <div className='bg-white shadow-sm border-b mb-8'>
        <div className='container mx-auto px-32 py-8'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Vendor Registration
          </h1>
          <p className='text-gray-600 mt-2 max-w-2xl'>
            Complete all the required information to register your company as a
            vendor. This multi-step form will guide you through the registration
            process.
          </p>

          <div className='mt-6 w-full h-2 bg-gray-100 rounded-full overflow-hidden'>
            <div
              className='h-full bg-primary transition-all duration-300 ease-in-out'
              style={{ width: `${getProgressPercentage()}%` }}></div>
          </div>

          <div className='flex items-center justify-between mt-2'>
            <span className='text-sm font-medium text-gray-700'>
              Step {active + 1} of {registrationSteps.length}
            </span>
            <span className='text-sm font-medium text-gray-700'>
              {getProgressPercentage()}% Complete
            </span>
          </div>
        </div>
      </div>

      <div className='container mx-auto max-w-[72rem] px-6 flex justify-between gap-8 mb-12'>
        <div className='w-72 shrink-0'>
          <div className='sticky top-36 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
            <div className='p-4 bg-gray-50 border-b'>
              <h2 className='font-semibold text-gray-900'>
                Registration Steps
              </h2>
            </div>
            <div className='p-2'>
              {registrationSteps?.map((step, i) => (
                <div
                  key={step.title}
                  className={`flex items-start gap-3 hover:bg-gray-50 cursor-pointer rounded-lg p-3 transition-all
                   ${
                     active === i
                       ? "bg-primary/5 border-l-4 border-primary"
                       : ""
                   }`}
                  onClick={() => {
                    if (i < active) setActive(i);
                  }}>
                  <div
                    className={`flex items-center justify-center rounded-full w-8 h-8 mt-0.5 ${
                      i < active
                        ? "bg-green-100 text-green-700"
                        : active === i
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                    {i < active ? <Check size={16} /> : step.icon}
                  </div>
                  <div>
                    <p
                      className={`font-medium text-sm ${
                        active === i ? "text-primary" : "text-gray-900"
                      }`}>
                      {step.title}
                    </p>
                    <p className='text-xs text-gray-500 mt-0.5'>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='flex-1 max-w-3xl'>
          <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
            {active === 0 && <VenderInfo handleNextStep={handleNextStep} />}
            {active === 1 && (
              <BusinessInfo
                handleNextStep={handleNextStep}
                setActive={setActive}
              />
            )}
            {active === 2 && (
              <VenderDocumentsInfo
                handleNextStep={handleNextStep}
                handleVenderMutate={handleVenderMutate}
                setActive={setActive}
              />
            )}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className='flex z-[1000] flex-col items-center justify-center bg-gray-950/75 fixed top-0 left-0 w-full h-full'>
          <p className='text-gray-400 text-xl mb-1'>Please wait</p>
          <h1 className='text-gray-300 mb-8 text-3xl'>Registering Vendor</h1>
          <LoaderCircle
            className='text-gray-400 animate-spin'
            size={30}
          />
        </div>
      )}
    </FormProvider>
  );
};

export default VenderRegistration;
