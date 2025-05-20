import { ErrorCodes } from "@/lib/errorCodes";

export interface ISignupInputs {
  name: string;
  email: string;
  password: string;
}
export interface ISigninInputs {
  email: string;
  password: string;
}

export interface ApiError {
  data: {
    errorCode: keyof typeof ErrorCodes;
    message?: string;
  };
}

// export interface IUser {
//   created_at: string;
//   description: string | null;
//   email: string;
//   full_name: string;
//   id: string;
//   defaultValues: {
//     fullname: string;
//     email: string;
//     contactNumber: string;
//     password: string;
//   };
// }

// export interface IBusinessRegistrationForm {
//   businessName: string;
//   businessClassification: string;
//   establishedYear: string;
//   registrationNumber: string;
//   addressLineOne: string;
//   addressLineTwo: string;
//   locality: string;
//   city: string;
//   pinCode: string;
//   country: string;
// }

// export interface IDocumentRegistrationForm {
//   registrationDoc: File;
//   panCardDoc: File;
// }

export interface CategoryFormErrors {
  categoryName: string;
  selectCategory: string;
  scope: string;
  status: string;
}

export interface Category {
  id: string;
  name: string;
  type: string;
  is_sub_category: boolean;
  sub_category_main: string;
  scope: string;
  status: string;
  created_at: string;
}

export interface IUserInfo {
  id: string;
  createdAt: string;
  description: string | null;
  email: string;
  fullname: string;
  panCardDoc: string;
  panCardNumber: string;
  phoneNumber: string;
  role: string;
  status: string;
  username: string;
}

export interface IBusinessInfo {
  id: string;
  addressLineOne: string;
  addressLineTwo: string;
  businessClassification: string;
  businessName: string;
  city: string;
  country: string;
  establishedYear: string;
  locality: string;
  pinCode: string;
  registrationNumber: string;
  registrationDoc: string;
}

export interface IVenderCategory {
  id: string;
  status: string;
  category: string;
  category_id: string;
  user_id: string;
  expires_at: string;
  created_at: Date;
}
