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

interface VenderInfoForm {
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

interface VenderRegistrationState {
  isTermServiceChecked: boolean;
  isAcceptPrivacyChecked: boolean;
  isBusinessEthicsChecked: boolean;
  businessInfoForm: BusinessInfoForm;
  venderInfoForm: VenderInfoForm;
  documentsInfoForm: DocumentsInfoForm;
}

const initialData: VenderRegistrationState = {
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
  venderInfoForm: {
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
};

// Validation functions
export const isAgreementValid = (state: VenderRegistrationState): boolean => {
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

export const isVendorFormValid = (vendorForm: VenderInfoForm): boolean => {
  const requiredFields = Object.values(vendorForm).map((value) => value.trim());
  return requiredFields.every((value) => value !== "");
};

export const isFormValid = (state: VenderRegistrationState): boolean => {
  return (
    isAgreementValid(state) &&
    isBusinessFormValid(state.businessInfoForm) &&
    isVendorFormValid(state.venderInfoForm)
  );
};

export const venderRegistrationSlice = createSlice({
  name: "venderRegistrationSlice",
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
    setVenderForm: (state, { payload }) => {
      state.venderInfoForm = payload;
    },
    setDocumentsForm: (state, { payload }) => {
      state.documentsInfoForm = payload;
    },
  },
});

export const {
  setAgreementForm,
  setBusinessForm,
  setVenderForm,
  setDocumentsForm,
} = venderRegistrationSlice.actions;

export default venderRegistrationSlice;
