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
  user: {
    id: string;
    fullname: string;
    status: string;
    contactNumber: string;
  };
  business: {
    id: string;
    businessName: string;
    establishedYear: string;
    addressLineOne: string;
    addressLineTwo: string;
    locality: string;
    city: string;
    pinCode: string;
    country: string;
    website: string;
    companyEmail: string;
    companyPhone: string;
  };
}

export interface IVendorEditResponse {
  vendorDetails: IVendorDetails;

  success: boolean;
}
