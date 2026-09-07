"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface BusinessInfoForm {
  businessName: string;
  businessClassification: string;
  establishedYear: string;
  registrationNumber: string;
  addressLineOne: string;
  addressLineTwo: string;
  locality: string;
  city: string;
  pinCode: string;
  country: string;
}

interface VendorInfoForm {
  email: string;
  password: string;
  fullname: string;
  contactNumber: string;
  confirmPassword: string;
  panCardNumber: string;
}

interface DocumentsInfoForm {
  registrationS3DocName: string;
  panCardS3DocName: string;
}

interface VendorRegistrationState {
  businessInfoForm: BusinessInfoForm;
  vendorInfoForm: VendorInfoForm;
  documentsInfoForm: DocumentsInfoForm;
  vendorDetailsActive: number;
  manageVendorStatus: string;
  manageVendorSearch: string;
}

interface VendorContextType extends VendorRegistrationState {
  setBusinessForm: (form: BusinessInfoForm) => void;
  setVendorForm: (form: VendorInfoForm) => void;
  setDocumentsForm: (form: DocumentsInfoForm) => void;
  setActiveVendorDetails: (active: number) => void;
  setManageVendorStatus: (status: string) => void;
  setManageVendorSearch: (search: string) => void;
  resetVendorFilterOptions: () => void;
  isAgreementValid: () => boolean;
  isBusinessFormValid: () => boolean;
  isVendorFormValid: () => boolean;
  isFormValid: () => boolean;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export const useVendorContext = () => {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error("useVendorContext must be used within VendorProvider");
  }
  return context;
};

const isBusinessFormValidFn = (businessForm: BusinessInfoForm): boolean => {
  const requiredFields = Object.entries(businessForm)
    .filter(([key]) => key !== "addressLineTwo")
    .map(([, value]) => value.trim());

  return requiredFields.every((value) => value !== "");
};

const isVendorFormValidFn = (vendorForm: VendorInfoForm): boolean => {
  const requiredFields = Object.values(vendorForm).map((value) => value.trim());
  return requiredFields.every((value) => value !== "");
};

export const VendorProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<VendorRegistrationState>({
    businessInfoForm: {
      businessName: "",
      businessClassification: "",
      establishedYear: "",
      registrationNumber: "",
      addressLineOne: "",
      addressLineTwo: "",
      locality: "",
      city: "",
      pinCode: "",
      country: "",
    },
    vendorInfoForm: {
      fullname: "",
      email: "",
      contactNumber: "",
      password: "",
      confirmPassword: "",
      panCardNumber: "",
    },
    documentsInfoForm: {
      registrationS3DocName: "",
      panCardS3DocName: "",
    },
    vendorDetailsActive: 0,
    manageVendorStatus: "all",
    manageVendorSearch: "",
  });

  const setBusinessForm = useCallback((form: BusinessInfoForm) => {
    setState((prev) => ({ ...prev, businessInfoForm: form }));
  }, []);

  const setVendorForm = useCallback((form: VendorInfoForm) => {
    setState((prev) => ({ ...prev, vendorInfoForm: form }));
  }, []);

  const setDocumentsForm = useCallback((form: DocumentsInfoForm) => {
    setState((prev) => ({ ...prev, documentsInfoForm: form }));
  }, []);

  const setActiveVendorDetails = useCallback((active: number) => {
    setState((prev) => ({ ...prev, vendorDetailsActive: active }));
  }, []);

  const setManageVendorStatus = useCallback((status: string) => {
    setState((prev) => ({ ...prev, manageVendorStatus: status }));
  }, []);

  const setManageVendorSearch = useCallback((search: string) => {
    setState((prev) => ({ ...prev, manageVendorSearch: search }));
  }, []);

  const resetVendorFilterOptions = useCallback(() => {
    setState((prev) => ({
      ...prev,
      manageVendorStatus: "all",
      manageVendorSearch: "",
    }));
  }, []);

  const isAgreementValid = useCallback(() => {
    return (
      state.documentsInfoForm.registrationS3DocName.trim() !== "" &&
      state.documentsInfoForm.panCardS3DocName.trim() !== ""
    );
  }, [state.documentsInfoForm]);

  const isBusinessFormValid = useCallback(() => {
    return isBusinessFormValidFn(state.businessInfoForm);
  }, [state.businessInfoForm]);

  const isVendorFormValid = useCallback(() => {
    return isVendorFormValidFn(state.vendorInfoForm);
  }, [state.vendorInfoForm]);

  const isFormValid = useCallback(() => {
    return isBusinessFormValid() && isVendorFormValid();
  }, [isBusinessFormValid, isVendorFormValid]);

  const value = {
    ...state,
    setBusinessForm,
    setVendorForm,
    setDocumentsForm,
    setActiveVendorDetails,
    setManageVendorStatus,
    setManageVendorSearch,
    resetVendorFilterOptions,
    isAgreementValid,
    isBusinessFormValid,
    isVendorFormValid,
    isFormValid,
  };

  return (
    <VendorContext.Provider value={value}>{children}</VendorContext.Provider>
  );
};
