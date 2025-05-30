import { createSlice } from "@reduxjs/toolkit";

// Define types for our state
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
  isTermServiceChecked: boolean;
  isAcceptPrivacyChecked: boolean;
  isBusinessEthicsChecked: boolean;
  businessInfoForm: BusinessInfoForm;
  vendorInfoForm: VendorInfoForm;
  documentsInfoForm: DocumentsInfoForm;
  vendorDetailsActive: number;
  manageVendorStatus: string;
  manageVendorSearch: string;
}

const initialData: VendorRegistrationState = {
  isTermServiceChecked: false,
  isAcceptPrivacyChecked: false,
  isBusinessEthicsChecked: false,
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
};

// Validation functions
export const isAgreementValid = (state: VendorRegistrationState): boolean => {
  return (
    state.isTermServiceChecked &&
    state.isAcceptPrivacyChecked &&
    state.isBusinessEthicsChecked
  );
};

export const isBusinessFormValid = (
  businessForm: BusinessInfoForm
): boolean => {
  // Check all fields except addressLineTwo which might be optional
  const requiredFields = Object.entries(businessForm)
    .filter(([key]) => key !== "addressLineTwo")
    .map(([, value]) => value.trim());

  return requiredFields.every((value) => value !== "");
};

export const isVendorFormValid = (vendorForm: VendorInfoForm): boolean => {
  const requiredFields = Object.values(vendorForm).map((value) => value.trim());
  return requiredFields.every((value) => value !== "");
};

export const isFormValid = (state: VendorRegistrationState): boolean => {
  return (
    isAgreementValid(state) &&
    isBusinessFormValid(state.businessInfoForm) &&
    isVendorFormValid(state.vendorInfoForm)
  );
};

export const vendorSlice = createSlice({
  name: "vendorRegistrationSlice",
  initialState: initialData,
  reducers: {
    setAgreementForm: (state, { payload }) => {
      state.isTermServiceChecked = payload.isTermServiceChecked;
      state.isAcceptPrivacyChecked = payload.isAcceptPrivacyChecked;
      state.isBusinessEthicsChecked = payload.isBusinessEthicsChecked;
    },

    setBusinessForm: (state, { payload }) => {
      state.businessInfoForm = payload;
    },
    setVendorForm: (state, { payload }) => {
      state.vendorInfoForm = payload;
    },
    setDocumentsForm: (state, { payload }) => {
      state.documentsInfoForm = payload;
    },
    setActiveVendorDetails: (state, { payload }) => {
      state.vendorDetailsActive = payload;
    },
    setManageVendorStatus: (state, { payload }) => {
      state.manageVendorStatus = payload;
    },
    setManageVendorSearch: (state, { payload }) => {
      state.manageVendorSearch = payload;
    },
  },
});

export const {
  setAgreementForm,
  setBusinessForm,
  setVendorForm,
  setDocumentsForm,
  setActiveVendorDetails,
  setManageVendorStatus,
  setManageVendorSearch,
} = vendorSlice.actions;

export default vendorSlice;
