export interface IVenderRegistrationForm {
  email: string;
  password: string;
  fullname: string;
  contactNumber: string;
  confirmPassword: string;
  panCardNumber: string;
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
  gstNumber: string;
  companyEmail: string;
  companyPhone: string;
  annualTurnover: string;
  website?: string;
  panCardDoc: File | null;
  registrationDoc: File | null;
  msmeCertificateDoc: File | null;
}

export interface IVendersTable {
  businessClassification: string;
  status: string;
  fullname: string;
  email: string;
  businessName: string;
  city: string;
  id: string;
}
