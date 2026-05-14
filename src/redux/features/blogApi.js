import { apiSlice } from "../api/apiSlice";

export const blogApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: () => `/api/blog/all`,
      providesTags: ['Blogs']
    }),
    getSingleBlog: builder.query({
      query: (id) => `/api/blog/single-blog/${id}`,
      providesTags: (result, error, arg) => [{ type: "Blog", id: arg }],
    }),
    addBlog: builder.mutation({
      query: (data) => ({
        url: `/api/blog/add`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Blogs'],
    }),
    updateBlog: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/blog/edit-blog/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Blogs', 'Blog'],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/api/blog/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blogs'],
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useGetSingleBlogQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
