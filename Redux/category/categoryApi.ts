import { api } from "../api";

export interface ICategoriesRes {
  categories: {
    created_at: string;
    description: string | null;
    id: number;
    is_sub_category: boolean;
    name: string;
    scope: string;
    short_name: string;
    status: string;
    sub_category_main: string | null;
    type: string;
    updated_at: string;
  }[];
  hasMore: boolean;
  page: number;
  success: boolean;
  totalCategories: number;
}

const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: ({ page = 1, limit = 10, search }) => ({
        url: `/category/admin-all?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      serializeQueryArgs: ({ endpointName }: { endpointName: string }) => {
        return endpointName;
      },
      merge: (currentCache: ICategoriesRes, newItems: ICategoriesRes) => {
        if (newItems.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          categories: [...currentCache.categories, ...newItems.categories],
        };
      },
      forceRefetch({
        currentArg,
        previousArg,
      }: {
        currentArg?: { page: number; limit: number };
        previousArg?: { page: number; limit: number };
      }) {
        return currentArg?.page !== previousArg?.page;
      },
      providesTags: ["get_categories"],
    }),
    getCategoriesParentsName: builder.query({
      query: () => ({
        url: `/category/parents-name`,
        method: "GET",
      }),
      providesTags: ["get_categories_names"],
    }),
    getCategoriesNames: builder.query({
      query: () => ({
        url: `/category/names`,
        method: "GET",
      }),
      providesTags: ["get_categories_names"],
    }),
    getCategory: builder.query({
      query: (id) => ({
        url: `/category/single/${id}`,
        method: "GET",
      }),
      providesTags: ["get_single_category"],
    }),
    getChildCategories: builder.query({
      query: (main) => ({
        url: `/category/child-categories/${main}`,
        method: "GET",
      }),
      providesTags: ["get_single_category"],
    }),
    getVendorCategories: builder.query({
      query: (userId) => ({
        url: `/category/vendor-all/${userId}`,
        method: "GET",
      }),
      providesTags: ["get_vendor_categories"],
    }),
    getVendorCategory: builder.query({
      query: (userCategoryId) => ({
        url: `/category/vendor/${userCategoryId}`,
        method: "GET",
      }),
      providesTags: ["get_vendor_categories"],
    }),

    createCategory: builder.mutation({
      query: (data) => ({
        url: `/category/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["get_categories", "get_categories_names"],
    }),
    editCategory: builder.mutation({
      query: ({ data, id }) => ({
        url: `/category/edit/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        "get_categories",
        "get_categories_names",
        "get_single_category",
      ],
    }),
    addVendorCategory: builder.mutation({
      query: (data) => ({
        url: "/category/add-vendor",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["get_vendor_categories"],
    }),
    updateVendorCategory: builder.mutation({
      query: (data) => ({
        url: "/category/update-vendor",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["get_vendor_categories"],
    }),

    deleteCategories: builder.mutation({
      query: (data) => ({
        url: "/category/multiple",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["get_categories", "get_categories_names"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/single/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useEditCategoryMutation,
  useGetCategoriesParentsNameQuery,
  useGetChildCategoriesQuery,
  useGetCategoriesNamesQuery,
  useAddVendorCategoryMutation,
  useUpdateVendorCategoryMutation,
  useGetVendorCategoriesQuery,
  useGetVendorCategoryQuery,
  useDeleteCategoriesMutation,
  useDeleteCategoryMutation,
} = categoryApi;
