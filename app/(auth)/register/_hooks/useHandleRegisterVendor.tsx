import { IVendorRegistrationForm } from "@/_types/auth/registration.type";
import useDeleteFileFromS3 from "@/hooks/useDeleteFileFromS3";
import useUploadFileToS3 from "@/hooks/useUploadFileToS3";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const useHandleRegisterVendor = () => {
  const { mutateAsync: registerVendor, isPending: isRegisterVendorLoading } =
    trpc.auth.register.useMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileToS3();
  const [deleteFile, { isLoading: isDeleting }] = useDeleteFileFromS3();

  const handleVendorMutate = async ({
    data,
    vendor_source,
  }: {
    data: IVendorRegistrationForm;
    vendor_source: "direct" | "invite";
  }) => {
    const {
      vendor: { vendor_pan_doc, vendor_adhar_doc },
      business: { biz_reg_doc, biz_gst_doc, biz_bank_doc, biz_msme_cert_doc },
      ...restData
    }: IVendorRegistrationForm = data;
    if (!vendor_pan_doc) {
      toast.error("Please upload PAN card document");
      return;
    }
    if (!biz_reg_doc) {
      toast.error("Please upload registration document");
      return;
    }
    if (!biz_gst_doc) {
      toast.error("Please upload GST document");
      return;
    }
    if (!biz_bank_doc) {
      toast.error("Please upload cheque passbook image");
      return;
    }
    if (!vendor_adhar_doc) {
      toast.error("Please upload Aadhar card document");
      return;
    }

    let panCardFileName = "";
    let registrationDocFileName = "";
    let gstDocFileName = "";
    let chequePassbookDocFileName = "";
    let msmeCertificateFileName = "";
    let adharCardDocFileName = "";

    try {
      panCardFileName = await uploadFile(vendor_pan_doc, "pan card");

      registrationDocFileName = await uploadFile(biz_reg_doc, "registration");
      gstDocFileName = await uploadFile(biz_gst_doc, "gst");

      chequePassbookDocFileName = await uploadFile(
        biz_bank_doc,
        "cheque passbook"
      );

      adharCardDocFileName = await uploadFile(vendor_adhar_doc, "adhar card");

      if (biz_msme_cert_doc) {
        msmeCertificateFileName = await uploadFile(
          biz_msme_cert_doc,
          "msme certificate"
        );
      }

      const formData = {
        ...restData,
        user: {
          full_name: restData.user.full_name,
          email: restData.user.email,
          password: restData.user.password,
        },
        vendor: {
          ...data.vendor,
          vendor_pan_doc_key: panCardFileName,
          vendor_adhar_doc_key: adharCardDocFileName,
        },
        business: {
          ...data.business,
          biz_reg_doc_key: registrationDocFileName,
          biz_gst_doc_key: gstDocFileName,
          biz_bank_doc_key: chequePassbookDocFileName,
          biz_msme_cert_doc_key: msmeCertificateFileName,
        },
        vendor_source,
      };

      const result = await registerVendor(formData);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
      if (panCardFileName && panCardFileName !== "") {
        await deleteFile(panCardFileName);
      }
      if (registrationDocFileName && registrationDocFileName !== "") {
        await deleteFile(registrationDocFileName);
      }
      if (gstDocFileName && gstDocFileName !== "") {
        await deleteFile(gstDocFileName);
      }
      if (chequePassbookDocFileName && chequePassbookDocFileName !== "") {
        await deleteFile(chequePassbookDocFileName);
      }
      if (msmeCertificateFileName && msmeCertificateFileName !== "") {
        await deleteFile(msmeCertificateFileName);
      }
      if (adharCardDocFileName && adharCardDocFileName !== "") {
        await deleteFile(adharCardDocFileName);
      }
    }
  };
  const isLoading = isRegisterVendorLoading || isUploading || isDeleting;

  return [handleVendorMutate, { isLoading }];
};

export default useHandleRegisterVendor;
