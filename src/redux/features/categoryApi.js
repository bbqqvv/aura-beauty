import { apiSlice } from "../api/apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
  overrideExisting:true,
  endpoints: (builder) => ({
    addCategory: builder.mutation({
      query: (data) => ({
        url: "/api/category/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Categories'],
    }),
    getShowCategory: builder.query({
      query: () => `/api/category/show`,
      providesTags: ['Categories'],
    }),
    getProductTypeCategory: builder.query({
      query: (type) => `/api/category/show/${type}`,
      providesTags: ['Categories'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/api/category/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Categories'],
    }),
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/category/edit/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ['Categories'],
    }),
  }),
});

export const {
 useAddCategoryMutation,
 useGetProductTypeCategoryQuery,
 useGetShowCategoryQuery,
 useDeleteCategoryMutation,
 useUpdateCategoryMutation,
} = categoryApi;
