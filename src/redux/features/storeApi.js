import { apiSlice } from "../api/apiSlice";

export const storeApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getActiveStores: builder.query({
      query: () => `/api/store/active`
    }),
    getAllStores: builder.query({
      query: () => `/api/store/all`
    }),
    addStore: builder.mutation({
      query: (data) => ({
        url: `/api/store/add`,
        method: 'POST',
        body: data,
      })
    }),
    updateStore: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/store/edit/${id}`,
        method: 'PATCH',
        body: data,
      })
    }),
    deleteStore: builder.mutation({
      query: (id) => ({
        url: `/api/store/delete/${id}`,
        method: 'DELETE',
      })
    }),
  }),
});

export const {
  useGetActiveStoresQuery,
  useGetAllStoresQuery,
  useAddStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
} = storeApi;
