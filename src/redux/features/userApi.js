import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => `/api/user/all`,
      providesTags: ['Users']
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/user/update-user/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Users']
    }),
    addUser: builder.mutation({
      query: (data) => ({
        url: `/api/user/admin/add`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Users']
    })
  }),
});

export const {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useAddUserMutation
} = userApi;
