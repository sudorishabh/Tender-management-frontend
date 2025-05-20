export interface IVendorsTable {
  id: string;
  fullname: string;
  email: string;
  status: string;
  businessName: string;
  businessClassification: string;
  city: string;
}

export interface IVendorsResponse {
  vendors: IVendorsTable[];
  hasMore: boolean;
  page: number;
  totalVendors: number;
}

export interface IVendorDetails {
  business: {
    addressLineOne: string;
    addressLineTwo: string;
    annualTurnover: string;
    businessClassification: string;
    businessName: string;
    city: string;
    companyEmail: string;
    companyPhone: string;
    country: string;
    establishedYear: string;
    gstNumber: string;
    id: number;
    locality: string;
    msmeCertificate: string;
    pinCode: string;
    registrationDoc: string;
    registrationNumber: string;
    website: string;
  };
  user: {
    createdAt: string;
    email: string;
    fullname: string;
    id: number;
    panCardDoc: string;
    panCardNumber: string;
    phoneNumber: string;
    role: string;
    status: string;
  };
}

export interface IVendorEditResponse {
  vendorDetails: IVendorDetails;

  success: boolean;
}
