export interface ICategoryInfo {
  created_at: "2025-03-26T07:29:54.000Z";
  id: number;
  is_sub_category: boolean;
  name: string;
  scope: string;
  shortened: string;
  status: string;
  sub_category_parent: string | null;
  type: string;
}

export interface ICategoryName {
  id: number;
  name: string;
}

export interface ICategories {
  categories: {
    id: string;
    name: string;
    type: string;
    is_sub_category: boolean;
    sub_category_main: string;
    scope: string;
    status: string;
    created_at: string;
  }[];
  success: boolean;
}

export interface ICategoriesResponse {
  categories: ICategoryName[];
  success: boolean;
}

export interface ICategoryAddUpdateData {
  name: string;
  type: string;
  scope: string;
  status: string;
  isSubCategory: boolean;
  subCategoryMain: string | null;
}

export interface IVenderCategoryTable {
  id: number;
  status: string;
  category_id: number;
  user_id: number;
  expires_at: string;
  created_at: string;
  category: string;
}
